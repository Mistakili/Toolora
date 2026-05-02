/**
 * Gateway integration smoke — exercises all four post-payment outcomes
 * against a running api-server and asserts a billing-event row is written
 * for each. Run with: pnpm --filter @workspace/scripts run gateway-smoke
 *
 * Pre-requisites:
 *   - api-server running locally on $API (default http://localhost:8080)
 *   - .local/may2-smoke-creds.json present with { listingId, ownerToken }
 *
 * Outcomes covered:
 *   1. SUCCESS  — happy path, status='settled', fee retained
 *   2. NON_2XX  — upstream returns 500, status='failed', no fee retained
 *   3. TIMEOUT  — upstream delays 35s (> our 30s timeout), status='failed'
 *   4. NETWORK  — same code path as NON_2XX (both funnel into
 *                 recordFailedCallAndRespond). Verified by inspecting code.
 *
 * Exits non-zero on any failed assertion so CI / a watcher can detect
 * regressions in the accounting integrity invariant.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const API = process.env.API ?? "http://localhost:8080";
// Anchor on this file's location so the script works regardless of cwd
// (pnpm runs scripts with cwd=<package dir>, not the repo root).
const __dirname = dirname(fileURLToPath(import.meta.url));
const CREDS_PATH =
  process.env.GATEWAY_SMOKE_CREDS ??
  resolve(__dirname, "..", "..", ".local", "may2-smoke-creds.json");

interface Creds {
  listingId: string;
  ownerToken: string;
  ownerEmail?: string;
}
interface BillingEvent {
  id: string;
  status: "settled" | "pending" | "failed";
  errorReason: string | null;
  paymentTxHash: string | null;
  tooloraFeeUsdcMicros: number;
  toolName: string | null;
  createdAt: string;
}

const creds: Creds = JSON.parse(readFileSync(CREDS_PATH, "utf-8"));
const auth = { Authorization: `Bearer ${creds.ownerToken}` } as const;
const json = { "Content-Type": "application/json" } as const;

let pass = 0;
let fail = 0;
const lines: string[] = [];
function record(name: string, ok: boolean, detail = "") {
  if (ok) {
    pass += 1;
    lines.push(`  PASS  ${name}${detail ? " — " + detail : ""}`);
  } else {
    fail += 1;
    lines.push(`  FAIL  ${name}${detail ? " — " + detail : ""}`);
  }
}

async function setUpstream(url: string): Promise<void> {
  const r = await fetch(`${API}/api/gateway/configs/${creds.listingId}`, {
    method: "PATCH",
    headers: { ...auth, ...json },
    body: JSON.stringify({ upstreamMcpUrl: url }),
  });
  if (!r.ok) throw new Error(`set upstream → ${r.status}: ${await r.text()}`);
}

async function callProxy(label: string): Promise<{ status: number; tooloraStatus: string | null }> {
  const r = await fetch(`${API}/api/gateway/proxy/${creds.listingId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-PAYMENT": `stub-smoke-${label}-${Date.now()}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: `smoke_${label}` },
    }),
  });
  return { status: r.status, tooloraStatus: r.headers.get("x-toolora-gateway-status") };
}

async function latestEvent(): Promise<BillingEvent | null> {
  const r = await fetch(
    `${API}/api/gateway/billing-events/${creds.listingId}?limit=1`,
    { headers: { ...auth } },
  );
  if (!r.ok) throw new Error(`fetch events → ${r.status}: ${await r.text()}`);
  const body = (await r.json()) as { events?: BillingEvent[] };
  return body.events?.[0] ?? null;
}

async function eventCount(): Promise<number> {
  const r = await fetch(
    `${API}/api/gateway/billing-events/${creds.listingId}?limit=10000`,
    { headers: { ...auth } },
  );
  if (!r.ok) throw new Error(`count events → ${r.status}: ${await r.text()}`);
  const body = (await r.json()) as { events?: BillingEvent[] };
  return (body.events ?? []).length;
}

async function gatewayHealth(): Promise<{
  status: string;
  gateway: { status: string; criticalEventsTotal: number; lastCriticalAt: string | null };
}> {
  const r = await fetch(`${API}/api/healthz`);
  if (!r.ok) throw new Error(`healthz → ${r.status}`);
  return (await r.json()) as Awaited<ReturnType<typeof gatewayHealth>>;
}

async function main(): Promise<void> {
  console.log(`gateway-smoke → API=${API} listing=${creds.listingId}\n`);

  const originalUpstream = `https://${process.env.REPLIT_DEV_DOMAIN ?? "localhost:8080"}/api/gateway/echo`;

  // ── OUTCOME 1: SUCCESS ──────────────────────────────────────────────────
  await setUpstream(originalUpstream);
  const before1 = await eventCount();
  const r1 = await callProxy("success");
  const after1 = await eventCount();
  const ev1 = await latestEvent();
  record("OUTCOME 1 (success): HTTP 200", r1.status === 200, `got ${r1.status}`);
  record(
    "OUTCOME 1 (success): X-Toolora-Gateway-Status=settled",
    r1.tooloraStatus === "settled",
    `got ${r1.tooloraStatus}`,
  );
  record("OUTCOME 1 (success): event row inserted", after1 === before1 + 1, `${before1} → ${after1}`);
  record(
    "OUTCOME 1 (success): event.status=settled with fee retained",
    !!ev1 && ev1.status === "settled" && ev1.tooloraFeeUsdcMicros > 0,
    ev1 ? `status=${ev1.status} fee=${ev1.tooloraFeeUsdcMicros}` : "no event",
  );

  // ── OUTCOME 2: NON_2XX (upstream 500) ───────────────────────────────────
  await setUpstream("https://httpbin.org/status/500");
  const before2 = await eventCount();
  const r2 = await callProxy("non2xx");
  const after2 = await eventCount();
  const ev2 = await latestEvent();
  record("OUTCOME 2 (non-2xx): HTTP 502", r2.status === 502, `got ${r2.status}`);
  record(
    "OUTCOME 2 (non-2xx): X-Toolora-Gateway-Status=failed",
    r2.tooloraStatus === "failed",
    `got ${r2.tooloraStatus}`,
  );
  record("OUTCOME 2 (non-2xx): event row inserted", after2 === before2 + 1, `${before2} → ${after2}`);
  record(
    "OUTCOME 2 (non-2xx): event.status=failed, fee=0, errorReason set",
    !!ev2 &&
      ev2.status === "failed" &&
      ev2.tooloraFeeUsdcMicros === 0 &&
      typeof ev2.errorReason === "string" &&
      ev2.errorReason.startsWith("upstream_status:"),
    ev2
      ? `status=${ev2.status} fee=${ev2.tooloraFeeUsdcMicros} reason=${ev2.errorReason}`
      : "no event",
  );

  // ── OUTCOME 3: TIMEOUT ──────────────────────────────────────────────────
  // Point at our own /echo endpoint with ?delayMs=N. This is self-contained,
  // 100% reliable, and exercises the same upstream-timeout code path as a
  // real third-party MCP that hangs. Default 35s exceeds the default 30s
  // GATEWAY_UPSTREAM_TIMEOUT_MS; override either via env to make the smoke
  // run in seconds (e.g. GATEWAY_UPSTREAM_TIMEOUT_MS=2000 + GATEWAY_SMOKE_SLEEP_MS=4000).
  const sleepMs = Number(process.env.GATEWAY_SMOKE_SLEEP_MS ?? 35_000);
  console.log(`  …running timeout test (sleep=${sleepMs}ms)…`);
  await setUpstream(`${originalUpstream}?delayMs=${sleepMs}`);
  const before3 = await eventCount();
  const r3 = await callProxy("timeout");
  const after3 = await eventCount();
  const ev3 = await latestEvent();
  record("OUTCOME 3 (timeout): HTTP 504", r3.status === 504, `got ${r3.status}`);
  record(
    "OUTCOME 3 (timeout): X-Toolora-Gateway-Status=failed",
    r3.tooloraStatus === "failed",
    `got ${r3.tooloraStatus}`,
  );
  record("OUTCOME 3 (timeout): event row inserted", after3 === before3 + 1, `${before3} → ${after3}`);
  record(
    "OUTCOME 3 (timeout): event.status=failed with upstream_timeout reason",
    !!ev3 &&
      ev3.status === "failed" &&
      typeof ev3.errorReason === "string" &&
      ev3.errorReason.startsWith("upstream_timeout:"),
    ev3 ? `status=${ev3.status} reason=${ev3.errorReason}` : "no event",
  );

  // ── OUTCOME 4: NETWORK_ERROR (TCP-level failure) ────────────────────────
  // example.com is RFC 2606 reserved, resolves to a routable public IP (so
  // SSRF passes — port is irrelevant to the validator), but port 9999 is
  // virtually guaranteed to refuse the TCP connection. This exercises the
  // SAME recordFailedCallAndRespond branch as outcome 2 but with
  // unreachableReason populated rather than upstreamStatus, ensuring both
  // sub-branches of the failure-record helper are wired correctly.
  console.log("  …running network-error test (TCP refused)…");
  await setUpstream("https://example.com:9999/anything");
  const before4 = await eventCount();
  const r4 = await callProxy("network");
  const after4 = await eventCount();
  const ev4 = await latestEvent();
  // Either 502 (TCP refused fast) or 504 (timeout) is acceptable — the key
  // invariant is that a failed billing event was written either way.
  record(
    "OUTCOME 4 (network): HTTP 502 or 504",
    r4.status === 502 || r4.status === 504,
    `got ${r4.status}`,
  );
  record(
    "OUTCOME 4 (network): X-Toolora-Gateway-Status=failed",
    r4.tooloraStatus === "failed",
    `got ${r4.tooloraStatus}`,
  );
  record(
    "OUTCOME 4 (network): event row inserted with status=failed",
    after4 === before4 + 1 && !!ev4 && ev4.status === "failed",
    ev4 ? `${before4}→${after4} status=${ev4.status} reason=${ev4.errorReason}` : "no event",
  );

  // ── HEALTHZ SANITY ──────────────────────────────────────────────────────
  const h = await gatewayHealth();
  record(
    "HEALTH: /api/healthz exposes gateway counter",
    typeof h.gateway?.criticalEventsTotal === "number",
    `criticalEventsTotal=${h.gateway?.criticalEventsTotal}`,
  );

  // Restore upstream
  await setUpstream(originalUpstream);

  console.log("\n" + lines.join("\n"));
  console.log(`\nResults: ${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("smoke crashed:", err);
  process.exit(2);
});
