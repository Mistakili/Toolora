import { promises as dns } from "node:dns";

export interface SsrfResult {
  ok: boolean;
  reason?: string;
  resolvedIps?: string[];
}

const ALLOWED_SCHEMES = new Set(["http:", "https:"]);

/**
 * Hostname-suffix allowlist that bypasses the IP-range block list (scheme
 * is still enforced). Used for two cases:
 *   1. Dev smoke testing — inside the Replit container, the dev domain
 *      resolves to 127.0.0.1 due to Replit's mTLS proxy magic. Without an
 *      allowlist, our own proxy can't call our own echo endpoint.
 *   2. Production — owners may legitimately host their MCP server on
 *      Replit deployments (*.replit.app); the public DNS resolution there
 *      is a normal public IP, so the IP block list wouldn't actually
 *      reject them in prod, but the allowlist lets us short-circuit.
 *
 * Configure via GATEWAY_SSRF_ALLOWLIST=suffix1,suffix2,... at runtime.
 * In NODE_ENV !== "production" we default to allowing replit.dev and
 * replit.app so smoke testing works out of the box.
 */
function buildAllowlist(): string[] {
  const fromEnv = (process.env.GATEWAY_SSRF_ALLOWLIST ?? "").trim();
  if (fromEnv) {
    return fromEnv
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
  if (process.env.NODE_ENV !== "production") {
    return ["replit.dev", "replit.app"];
  }
  return [];
}
const ALLOWLIST_SUFFIXES = buildAllowlist();

function hostMatchesAllowlist(host: string): boolean {
  const h = host.toLowerCase();
  return ALLOWLIST_SUFFIXES.some((suffix) => h === suffix || h.endsWith("." + suffix));
}

interface Cidr4 {
  net: number;
  mask: number;
  label: string;
}

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isInteger(v) || v < 0 || v > 255) return null;
    n = (n << 8) >>> 0;
    n = (n | v) >>> 0;
  }
  return n;
}

function cidr(ip: string, prefix: number, label: string): Cidr4 {
  const net = ipv4ToInt(ip);
  if (net === null) throw new Error(`bad cidr ${ip}`);
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  return { net: (net & mask) >>> 0, mask, label };
}

const BLOCKED_V4: Cidr4[] = [
  cidr("0.0.0.0", 8, "reserved"),
  cidr("10.0.0.0", 8, "private"),
  cidr("100.64.0.0", 10, "carrier-grade-nat"),
  cidr("127.0.0.0", 8, "loopback"),
  cidr("169.254.0.0", 16, "link-local"),
  cidr("172.16.0.0", 12, "private"),
  cidr("192.0.0.0", 24, "ietf-protocol"),
  cidr("192.0.2.0", 24, "test-net-1"),
  cidr("192.168.0.0", 16, "private"),
  cidr("198.18.0.0", 15, "benchmarking"),
  cidr("198.51.100.0", 24, "test-net-2"),
  cidr("203.0.113.0", 24, "test-net-3"),
  cidr("224.0.0.0", 4, "multicast"),
  cidr("240.0.0.0", 4, "reserved"),
  cidr("255.255.255.255", 32, "broadcast"),
];

function isBlockedV4(ip: string): string | null {
  const n = ipv4ToInt(ip);
  if (n === null) return "invalid-ipv4";
  for (const c of BLOCKED_V4) {
    if (((n & c.mask) >>> 0) === c.net) return c.label;
  }
  return null;
}

function isBlockedV6(raw: string): string | null {
  const ip = raw.toLowerCase();
  // IPv4-mapped: ::ffff:a.b.c.d → defer to IPv4 check
  const mapped = ip.match(/^::ffff:([0-9.]+)$/);
  if (mapped) return isBlockedV4(mapped[1]);
  if (ip === "::" || ip === "::1") return "loopback";
  // Unique local fc00::/7 — first byte 0xfc or 0xfd
  if (/^fc[0-9a-f]{2}:/.test(ip) || /^fd[0-9a-f]{2}:/.test(ip)) return "unique-local";
  // Link-local fe80::/10
  if (/^fe[89ab][0-9a-f]:/.test(ip)) return "link-local";
  // Multicast ff00::/8
  if (/^ff[0-9a-f]{2}:/.test(ip)) return "multicast";
  return null;
}

/**
 * Validate an owner-supplied upstream URL against SSRF attack vectors.
 * MUST be called both at config-save time AND on every proxied request
 * (DNS rebinding is real).
 */
export async function validateUpstreamUrl(rawUrl: string): Promise<SsrfResult> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "invalid-url" };
  }
  if (!ALLOWED_SCHEMES.has(url.protocol)) {
    return { ok: false, reason: `scheme-not-allowed:${url.protocol}` };
  }
  const host = url.hostname;
  if (!host) return { ok: false, reason: "missing-host" };

  // Reject literal localhost (catches typos like "localhost.attacker.com" too)
  if (/^localhost$/i.test(host)) return { ok: false, reason: "loopback" };

  // Hostname suffix allowlist bypasses the IP block list (see buildAllowlist).
  // We still enforce scheme + literal-localhost above.
  if (hostMatchesAllowlist(host)) {
    return { ok: true, resolvedIps: ["allowlisted:" + host] };
  }

  // Resolve via DNS — block if ANY resolved IP is in a blocked range.
  // (Don't pick the "good" one — next query may return only blocked.)
  let resolved: string[] = [];
  try {
    const [a, aaaa] = await Promise.all([
      dns.resolve4(host).catch(() => [] as string[]),
      dns.resolve6(host).catch(() => [] as string[]),
    ]);
    resolved = [...a, ...aaaa];
  } catch {
    return { ok: false, reason: "dns-failed" };
  }
  if (resolved.length === 0) {
    // Could be a literal IP in the URL — handle both families
    const v4Block = isBlockedV4(host);
    if (v4Block) return { ok: false, reason: `blocked-ipv4:${v4Block}`, resolvedIps: [host] };
    const v6Block = isBlockedV6(host);
    if (v6Block) return { ok: false, reason: `blocked-ipv6:${v6Block}`, resolvedIps: [host] };
    return { ok: false, reason: "no-dns-resolution" };
  }
  // Dispatch by family — IPv6 contains ":", IPv4 doesn't. Without this
  // dispatch, isBlockedV4 returns "invalid-ipv4" for any v6 address and we
  // wrongly reject all dual-stack hosts (most of the modern web). Both
  // families are still validated; we just route each IP to the right checker.
  for (const ip of resolved) {
    if (ip.includes(":")) {
      const v6 = isBlockedV6(ip);
      if (v6) return { ok: false, reason: `blocked-ipv6:${v6}`, resolvedIps: resolved };
    } else {
      const v4 = isBlockedV4(ip);
      if (v4) return { ok: false, reason: `blocked-ipv4:${v4}`, resolvedIps: resolved };
    }
  }
  return { ok: true, resolvedIps: resolved };
}

/** Strip incoming sensitive headers before forwarding to owner-supplied upstream. */
export function sanitizeUpstreamHeaders(incoming: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  const stripPrefixes = ["x-forwarded-", "x-real-", "cf-", "x-vercel-", "x-replit-"];
  const stripExact = new Set(["host", "cookie", "authorization", "x-owner-token", "x-payment", "content-length"]);
  for (const [k, v] of Object.entries(incoming)) {
    if (v == null) continue;
    const key = k.toLowerCase();
    if (stripExact.has(key)) continue;
    if (stripPrefixes.some((p) => key.startsWith(p))) continue;
    out[key] = Array.isArray(v) ? v.join(", ") : v;
  }
  return out;
}
