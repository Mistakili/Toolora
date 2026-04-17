import { Router, type IRouter, type Request, type Response } from "express";
import crypto from "node:crypto";
import { db } from "@workspace/db";
import { checkoutIntentsTable, sponsorsTable, mcpListingsTable } from "@workspace/db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { invalidateSponsorCache } from "../lib/sponsors";
import { verifySolanaPayPayment } from "../lib/solanaPayVerify";
import { base58Encode } from "../lib/base58";

const router: IRouter = Router();

const VAULT = process.env.SOLANA_VAULT_ADDRESS ?? "59wUbJWMiBK737srMxPjtKFJDrcuh28Uezj9xjtMimQF";
const CLUSTER = (process.env.SOLANA_CLUSTER === "mainnet" ? "mainnet" : "devnet") as "mainnet" | "devnet";
const USDC_MINT_MAINNET = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const USDC_MINT_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
const USDC_MINT = CLUSTER === "mainnet" ? USDC_MINT_MAINNET : USDC_MINT_DEVNET;

// Demo fulfillment is OFF by default and ONLY honored in non-production with
// explicit opt-in. This prevents the test backdoor from ever shipping live.
const ALLOW_DEMO =
  process.env.NODE_ENV !== "production" && process.env.CHECKOUT_ALLOW_DEMO === "1";

const PRICES_USD: Record<string, number> = {
  footer_rotation: 299,
  featured_sponsor: 999,
  blog_sponsor: 199,
  newsletter_sponsor: 149,
  mcp_listing: 49,
  mcp_featured: 99,
};

const SPONSOR_DURATION_DAYS: Record<string, number> = {
  footer_rotation: 30,
  featured_sponsor: 30,
  blog_sponsor: 365,
  newsletter_sponsor: 7,
};

const ALLOWED_KINDS = new Set(Object.keys(PRICES_USD));

function isHttpsUrl(value: string | undefined | null): boolean {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function clip(value: unknown, max: number): string {
  return String(value ?? "").slice(0, max).trim();
}

// Produce a Solana Pay reference: a base58-encoded random 32-byte pubkey.
function generateReference(): string {
  return base58Encode(crypto.randomBytes(32));
}

router.post("/create", async (req: Request, res: Response): Promise<void> => {
  const body = (req.body ?? {}) as {
    kind?: string;
    metadata?: Record<string, string>;
    buyer_email?: string;
  };
  const kind = clip(body.kind, 40);
  if (!ALLOWED_KINDS.has(kind)) {
    res.status(400).json({ error: "invalid_kind" });
    return;
  }
  const meta = body.metadata ?? {};

  if (kind in SPONSOR_DURATION_DAYS) {
    if (clip(meta.text, 140).length < 10 || !isHttpsUrl(meta.url)) {
      res.status(400).json({ error: "invalid_metadata", message: "Sponsor text and https URL required" });
      return;
    }
  } else if (kind === "mcp_listing" || kind === "mcp_featured") {
    if (!clip(meta.name, 80) || !clip(meta.tagline, 200) || !isHttpsUrl(meta.url)) {
      res.status(400).json({ error: "invalid_metadata", message: "Name, tagline, and https URL required" });
      return;
    }
  }

  const amount = PRICES_USD[kind];
  const reference = generateReference();

  await db.insert(checkoutIntentsTable).values({
    reference,
    kind,
    amountUsd: amount,
    metadata: meta,
    buyerEmail: clip(body.buyer_email, 200) || null,
    status: "pending",
  });

  const params = new URLSearchParams({
    amount: amount.toString(),
    "spl-token": USDC_MINT,
    reference,
    label: "Toolora",
    message: "Toolora " + kind.replace(/_/g, " ") + " · " + amount + " USDC",
    memo: reference, // fallback for wallets that don't pass reference accounts
  });
  const solanaPayUrl = "solana:" + VAULT + "?" + params.toString();

  res.json({
    reference,
    amountUsdc: amount,
    vaultAddress: VAULT,
    cluster: CLUSTER,
    usdcMint: USDC_MINT,
    solanaPayUrl,
    qrPayload: solanaPayUrl,
    expiresInSeconds: 1800,
  });
});

router.post("/verify", async (req: Request, res: Response): Promise<void> => {
  const body = (req.body ?? {}) as { reference?: string; tx_signature?: string };
  const reference = clip(body.reference, 100);
  const sig = clip(body.tx_signature, 100);
  if (!reference || !sig) {
    res.status(400).json({ error: "missing_fields" });
    return;
  }

  const [intent] = await db
    .select()
    .from(checkoutIntentsTable)
    .where(eq(checkoutIntentsTable.reference, reference))
    .limit(1);

  if (!intent) {
    res.status(404).json({ error: "intent_not_found" });
    return;
  }

  if (intent.status === "fulfilled") {
    res.json({ ok: true, status: "already_fulfilled", fulfilledRowId: intent.fulfilledRowId });
    return;
  }

  // Strict on-chain verification: fetch the transaction, prove it sent the
  // exact USDC amount to our vault, and that this intent's reference is in
  // the account list (Solana Pay standard). Demo bypass is only available
  // when explicitly enabled in non-production environments.
  const isDemoSig = sig.startsWith("demo_") || sig.startsWith("sim_");
  if (isDemoSig) {
    if (!ALLOW_DEMO) {
      res.status(402).json({ error: "demo_signatures_disabled" });
      return;
    }
  } else {
    const verified = await verifySolanaPayPayment({
      signature: sig,
      cluster: CLUSTER,
      vaultAddress: VAULT,
      usdcMint: USDC_MINT,
      expectedAmountUsdc: intent.amountUsd,
      reference,
    });
    if (!verified.ok) {
      res.status(402).json({ error: "tx_not_valid", message: verified.error });
      return;
    }
  }

  // Atomic claim: flip status to "fulfilling" only if still pending. This
  // prevents two concurrent /verify calls from both inserting rows.
  const claimed = await db
    .update(checkoutIntentsTable)
    .set({ status: "fulfilling", txSignature: sig })
    .where(and(eq(checkoutIntentsTable.reference, reference), eq(checkoutIntentsTable.status, "pending")))
    .returning({ id: checkoutIntentsTable.id });

  if (claimed.length === 0) {
    // Someone else already claimed it — re-read state.
    const [latest] = await db
      .select({ status: checkoutIntentsTable.status, fulfilledRowId: checkoutIntentsTable.fulfilledRowId })
      .from(checkoutIntentsTable)
      .where(eq(checkoutIntentsTable.reference, reference))
      .limit(1);
    res.json({ ok: true, status: latest?.status ?? "unknown", fulfilledRowId: latest?.fulfilledRowId ?? null });
    return;
  }

  const meta = intent.metadata ?? {};
  let fulfilledRowId: string | null = null;
  try {
    if (intent.kind in SPONSOR_DURATION_DAYS) {
      const days = SPONSOR_DURATION_DAYS[intent.kind];
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      const [row] = await db
        .insert(sponsorsTable)
        .values({
          kind: intent.kind,
          text: clip(meta.text, 140),
          url: isHttpsUrl(meta.url) ? meta.url : null,
          buyerEmail: intent.buyerEmail,
          buyerName: clip(meta.name, 200) || null,
          amountUsd: intent.amountUsd,
          polarCheckoutId: "solana:" + sig.slice(0, 40),
          active: true,
          expiresAt,
        })
        .returning({ id: sponsorsTable.id });
      fulfilledRowId = row?.id ?? null;
      invalidateSponsorCache();
    } else if (intent.kind === "mcp_listing" || intent.kind === "mcp_featured") {
      const featured = intent.kind === "mcp_featured";
      const [row] = await db
        .insert(mcpListingsTable)
        .values({
          name: clip(meta.name, 80),
          tagline: clip(meta.tagline, 200),
          description: clip(meta.description, 2000),
          url: meta.url ?? "",
          configUrl: isHttpsUrl(meta.config_url) ? meta.config_url : null,
          category: clip(meta.category, 40) || "Other",
          logoUrl: isHttpsUrl(meta.logo_url) ? meta.logo_url : null,
          featured,
          featuredUntil: featured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
          buyerEmail: intent.buyerEmail,
          polarCheckoutId: "solana:" + sig.slice(0, 40),
          approved: true,
        })
        .returning({ id: mcpListingsTable.id });
      fulfilledRowId = row?.id ?? null;
    }

    if (!fulfilledRowId) {
      // Insert silently failed — back out so buyer can retry / contact support.
      await db
        .update(checkoutIntentsTable)
        .set({ status: "pending", txSignature: null })
        .where(eq(checkoutIntentsTable.reference, reference));
      res.status(500).json({ error: "fulfillment_insert_failed" });
      return;
    }

    await db
      .update(checkoutIntentsTable)
      .set({ status: "fulfilled", fulfilledRowId, fulfilledAt: new Date() })
      .where(eq(checkoutIntentsTable.reference, reference));

    logger.info({ kind: intent.kind, reference, sig }, "[checkout] Solana payment fulfilled");
    res.json({ ok: true, fulfilledRowId, kind: intent.kind });
  } catch (err) {
    // Roll back the claim so a retry can succeed.
    await db
      .update(checkoutIntentsTable)
      .set({ status: "pending", txSignature: null })
      .where(eq(checkoutIntentsTable.reference, reference));
    logger.error({ err, reference }, "[checkout] fulfillment failed");
    res.status(500).json({ error: "fulfillment_failed" });
  }
});

router.get("/intent/:reference", async (req: Request, res: Response): Promise<void> => {
  const reference = clip(req.params.reference, 100);
  const [intent] = await db
    .select({
      reference: checkoutIntentsTable.reference,
      kind: checkoutIntentsTable.kind,
      amountUsd: checkoutIntentsTable.amountUsd,
      status: checkoutIntentsTable.status,
      createdAt: checkoutIntentsTable.createdAt,
    })
    .from(checkoutIntentsTable)
    .where(eq(checkoutIntentsTable.reference, reference))
    .limit(1);
  if (!intent) {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json(intent);
});

export default router;
