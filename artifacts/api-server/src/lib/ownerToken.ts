import crypto from "node:crypto";

const IS_PROD = process.env.NODE_ENV === "production";
export const OWNER_SECRET =
  process.env.OWNER_DASHBOARD_SECRET ??
  process.env.SESSION_SECRET ??
  (IS_PROD ? "" : "toolora-owner-dev-secret-DO-NOT-USE-IN-PROD");

if (IS_PROD && !OWNER_SECRET) {
  // Fail fast on startup so a forgeable-token deploy never ships.
  throw new Error(
    "OWNER_DASHBOARD_SECRET (or SESSION_SECRET) must be set in production — owner dashboard tokens would otherwise be forgeable.",
  );
}

/** HMAC-signed owner token. Format: base64url(`${listingId}.${email}.${exp}.${sig}`). */
export function signOwnerToken(listingId: string, email: string): string {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = `${listingId}.${email}.${exp}`;
  const sig = crypto.createHmac("sha256", OWNER_SECRET).update(payload).digest("hex").slice(0, 32);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

/** Returns the email/identity if the token is valid for this listing, else null. */
export function verifyOwnerToken(token: string, listingId: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(".");
    // Payload is `${listingId}.${identity}.${exp}.${sig}` — but the identity
    // can be an email containing dots (e.g. user@gmail.com), so we anchor on
    // the LAST two segments (exp + sig) and rejoin everything in the middle
    // as the identity. listingId is a UUID (hyphens, no dots) so position [0]
    // is always reliably the listingId. Backward-compatible with 4-part
    // tokens where identity has no dots (e.g. `gh:owner`).
    if (parts.length < 4) return null;
    const sig = parts[parts.length - 1];
    const expStr = parts[parts.length - 2];
    const tListingId = parts[0];
    const email = parts.slice(1, parts.length - 2).join(".");
    if (tListingId !== listingId) return null;
    const exp = parseInt(expStr, 10);
    if (!Number.isFinite(exp) || exp < Date.now()) return null;
    const expected = crypto
      .createHmac("sha256", OWNER_SECRET)
      .update(`${tListingId}.${email}.${expStr}`)
      .digest("hex")
      .slice(0, 32);
    if (sig !== expected) return null;
    return email;
  } catch {
    return null;
  }
}

/** Extract a Bearer token from an Authorization header. */
export function extractBearerToken(authHeader: string | string[] | undefined): string | null {
  if (!authHeader) return null;
  const value = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  const m = /^Bearer\s+(.+)$/i.exec(value);
  return m ? m[1].trim() : null;
}
