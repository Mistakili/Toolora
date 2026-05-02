import { Router, type IRouter, type Request, type Response } from "express";
import { Agent as UndiciAgent, fetch as undiciFetch } from "undici";
import dns from "node:dns";
import { recordGatewayCriticalEvent } from "../lib/gatewayHealth.js";
import { db } from "@workspace/db";
import {
  gatewayConfigsTable,
  gatewayBillingEventsTable,
  mcpListingsTable,
  type GatewayConfig,
} from "@workspace/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { validateUpstreamUrl, sanitizeUpstreamHeaders } from "../lib/ssrf";
import { buildX402Challenge, verifyX402Payment } from "../lib/x402";
import { splitUsdc, payoutMode } from "../lib/usdcSplitter";
import { verifyOwnerToken, extractBearerToken } from "../lib/ownerToken";
import { logger } from "../lib/logger";
import { getPublicProofRows } from "../lib/gatewayRefunds";
import { openapiMcpSpecsTable } from "@workspace/db/schema";

const router: IRouter = Router();

// Configurable per-deployment via GATEWAY_UPSTREAM_TIMEOUT_MS. Defaults to
// 30s — long enough for slow LLM-backed MCP servers, short enough that a
// stuck upstream doesn't tie up our connections indefinitely. Lowered in
// integration tests to keep timeout coverage runnable in seconds.
const UPSTREAM_TIMEOUT_MS = (() => {
  const raw = Number(process.env.GATEWAY_UPSTREAM_TIMEOUT_MS);
  return Number.isFinite(raw) && raw >= 1_000 && raw <= 120_000 ? raw : 30_000;
})();
const MAX_UPSTREAM_BYTES = 10 * 1024 * 1024; // 10 MB cap
const MIN_PRICE_MICROS = 1; // $0.000001
const MAX_PRICE_MICROS = 100_000_000; // $100/call hard ceiling

// ─── Owner-auth middleware ──────────────────────────────────────────────────
function requireOwner(req: Request, res: Response, next: () => void): void {
  const listingId = String(req.params.listingId ?? "");
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }
  const token =
    extractBearerToken(req.headers.authorization) ??
    (typeof req.headers["x-owner-token"] === "string" ? req.headers["x-owner-token"] : null);
  if (!token) {
    res.status(401).json({ ok: false, error: "missing_owner_token" });
    return;
  }
  const identity = verifyOwnerToken(token, listingId);
  if (!identity) {
    res.status(401).json({ ok: false, error: "invalid_owner_token" });
    return;
  }
  (req as Request & { ownerIdentity?: string }).ownerIdentity = identity;
  next();
}

// ─── Helpers ────────────────────────────────────────────────────────────────
async function getEnabledConfig(listingId: string): Promise<GatewayConfig | null> {
  const rows = await db
    .select()
    .from(gatewayConfigsTable)
    .where(and(eq(gatewayConfigsTable.listingId, listingId), eq(gatewayConfigsTable.enabled, true)))
    .limit(1);
  return rows[0] ?? null;
}

async function getAnyConfig(listingId: string): Promise<GatewayConfig | null> {
  const rows = await db
    .select()
    .from(gatewayConfigsTable)
    .where(eq(gatewayConfigsTable.listingId, listingId))
    .limit(1);
  return rows[0] ?? null;
}

async function getListing(listingId: string): Promise<{ id: string; name: string } | null> {
  const rows = await db
    .select({ id: mcpListingsTable.id, name: mcpListingsTable.name })
    .from(mcpListingsTable)
    .where(eq(mcpListingsTable.id, listingId))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Pin the outbound TCP connection to the IP we already validated, eliminating
 * the SSRF TOCTOU window between `validateUpstreamUrl()` and the actual fetch.
 * Without this, an attacker-controlled DNS server could return a safe IP
 * during validation and an internal IP at connect time (DNS rebinding).
 *
 * For allowlisted hosts (e.g. *.replit.dev in dev) we deliberately fall back
 * to the platform's default DNS so Replit's loopback-reflection works.
 */
function pinnedDispatcher(resolvedIps: string[]): UndiciAgent | undefined {
  const realIps = resolvedIps.filter((s) => !s.startsWith("allowlisted:"));
  if (realIps.length === 0) return undefined; // allowlisted host — let default DNS run
  // Choose the first validated IP. (We could rotate; for our traffic shape
  // a single connection per call is fine and avoids retry-amplification.)
  const ip = realIps[0];
  const family: 4 | 6 = ip.includes(":") ? 6 : 4;
  return new UndiciAgent({
    connect: {
      // The lookup callback bypasses libc's getaddrinfo — undici will connect
      // to exactly this IP. SNI / Host header still derive from the original
      // URL's hostname, so HTTPS cert validation works correctly.
      // We must honor BOTH dns.lookup signatures:
      //   - options.all=true  →  callback(null, [{address, family}, ...])
      //   - options.all=false →  callback(null, address, family)
      // undici sets options.all=true internally; passing the single-form result
      // when an array is expected makes net.isIP() throw ERR_INVALID_IP_ADDRESS.
      lookup: (
        _hostname: string,
        options: dns.LookupOptions,
        callback: (
          err: NodeJS.ErrnoException | null,
          addressOrList: string | dns.LookupAddress[],
          family?: number,
        ) => void,
      ) => {
        if (options && options.all) {
          (callback as (e: NodeJS.ErrnoException | null, l: dns.LookupAddress[]) => void)(null, [
            { address: ip, family },
          ]);
        } else {
          (callback as (e: NodeJS.ErrnoException | null, a: string, f: number) => void)(null, ip, family);
        }
      },
    },
  });
}

function extractToolName(body: unknown): string | null {
  try {
    if (body && typeof body === "object") {
      const b = body as { method?: string; params?: { name?: string } };
      if (b.params?.name) return String(b.params.name).slice(0, 80);
      if (b.method) return String(b.method).slice(0, 80);
    }
  } catch {
    /* noop */
  }
  return null;
}

// ─── 1. Public proxy — ALL /api/gateway/proxy/:listingId ───────────────────
// In production this is intended to live at gateway.toolora.dev/mcp/:listingId
// via subdomain routing; in dev it's mounted under /api/gateway/proxy/:listingId.
router.all("/proxy/:listingId", async (req: Request, res: Response): Promise<void> => {
  const listingId = String(req.params.listingId ?? "");
  if (!listingId) {
    res.status(400).json({ error: "missing_listing_id" });
    return;
  }

  const config = await getEnabledConfig(listingId);
  if (!config) {
    res.status(404).json({ error: "not_found_or_disabled" });
    return;
  }

  // SSRF re-check on every call (DNS rebinding, owner edit since last call, etc.)
  const ssrf = await validateUpstreamUrl(config.upstreamMcpUrl);
  if (!ssrf.ok) {
    logger.warn({ listingId, reason: ssrf.reason }, "[gateway] upstream blocked by SSRF guard");
    res.status(403).json({ error: "upstream_blocked", reason: ssrf.reason });
    return;
  }

  const listing = await getListing(listingId);
  const challenge = buildX402Challenge({
    pricePerCallUsdcMicros: config.pricePerCallUsdcMicros,
    payoutNetwork: config.payoutNetwork,
    resource: `gateway.toolora.dev/mcp/${listingId}`,
    listingName: listing?.name,
  });

  const payment = await verifyX402Payment(req, config.pricePerCallUsdcMicros);
  if (!payment.ok) {
    res.status(402).json(challenge);
    return;
  }

  // ── Forward to upstream ──
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let upstreamRes: Response | null = null;
  let upstreamStatus = 502;
  let upstreamHeaders: Record<string, string> = {};
  let upstreamBody: Buffer = Buffer.alloc(0);
  let timedOut = false;
  let unreachableReason: string | null = null;
  try {
    const dispatcher = pinnedDispatcher(ssrf.resolvedIps ?? []);
    // We use undici's own `fetch` (not the global) so the dispatcher option is
    // honored. Node's global fetch is backed by an internal copy of undici that
    // doesn't accept dispatchers from separately-installed undici instances —
    // that mismatch silently produced "fetch failed" with no detail.
    const init: Parameters<typeof undiciFetch>[1] = {
      method: req.method,
      headers: {
        "content-type": req.headers["content-type"]?.toString() ?? "application/json",
        accept: req.headers.accept?.toString() ?? "application/json",
        ...sanitizeUpstreamHeaders(req.headers as Record<string, string | string[] | undefined>),
      },
      signal: controller.signal,
      // No automatic redirects — each redirect would need a fresh SSRF check.
      redirect: "manual",
    };
    if (dispatcher) init.dispatcher = dispatcher;
    if (req.method !== "GET" && req.method !== "HEAD" && req.body !== undefined) {
      init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }
    const r = await undiciFetch(config.upstreamMcpUrl, init);
    upstreamStatus = r.status;
    r.headers.forEach((v, k) => {
      // Drop hop-by-hop and content-encoding (we already decoded)
      if (["transfer-encoding", "content-encoding", "content-length", "connection"].includes(k.toLowerCase())) return;
      upstreamHeaders[k] = v;
    });
    // Cap body size
    const reader = r.body?.getReader();
    if (reader) {
      const chunks: Uint8Array[] = [];
      let total = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          total += value.byteLength;
          if (total > MAX_UPSTREAM_BYTES) {
            unreachableReason = "upstream_response_too_large";
            break;
          }
          chunks.push(value);
        }
      }
      if (!unreachableReason) upstreamBody = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    }
  } catch (err) {
    // controller.signal.aborted is the source of truth here. undici translates
    // a mid-flight abort into TypeError("fetch failed") with cause UND_ERR_SOCKET
    // (NOT an AbortError), so checking err.name alone misses every real timeout
    // and routes them through the unreachable branch with the wrong HTTP code.
    if (controller.signal.aborted || (err as Error & { name?: string })?.name === "AbortError") {
      timedOut = true;
    } else {
      const e = err as Error & { cause?: { code?: string; message?: string } };
      const causeMsg = e.cause?.code ?? e.cause?.message;
      unreachableReason = causeMsg ? `${e.message}: ${causeMsg}` : (e.message ?? "fetch_failed");
      logger.warn({ listingId, err: e.message, cause: e.cause }, "[gateway] upstream fetch error detail");
    }
  } finally {
    clearTimeout(timeout);
  }

  // ── Accounting integrity for upstream failures ──
  // The agent has ALREADY paid via x402 (verifyX402Payment was called above).
  // If the upstream is unreachable / timed-out / non-2xx, the caller did NOT
  // receive value — but we still owe a ledger row so a reconciliation/refund
  // job can find the paid-but-unserved call. We do NOT call splitUsdc (no
  // value was delivered → no payout to owner). The 502/504 response semantic
  // for the caller is preserved; in production with verify mode, ops will
  // refund the caller's x402 prepayment from the ledger.
  async function recordFailedCallAndRespond(httpStatus: number, errorReason: string, errBody: object) {
    try {
      await db.insert(gatewayBillingEventsTable).values({
        gatewayConfigId: config!.id,
        listingId: config!.listingId,
        callerPaymentRef: payment.callerRef ?? null,
        toolName: extractToolName(req.body),
        amountUsdcMicros: config!.pricePerCallUsdcMicros,
        tooloraFeeUsdcMicros: 0, // no fee retained — caller didn't get a response
        paymentTxHash: payment.txHash ?? null,
        payoutTxHash: null,
        status: "failed",
        errorReason: errorReason.slice(0, 200),
        settledAt: null,
      });
    } catch (err) {
      recordGatewayCriticalEvent("failed_upstream_insert");
      logger.error(
        {
          err,
          listingId,
          configId: config!.id,
          paymentTx: payment.txHash,
          callerRef: payment.callerRef,
          httpStatus,
          errorReason,
        },
        "[gateway] CRITICAL: failed to record billing event for paid-but-failed upstream — manual reconciliation required",
      );
    }
    res.setHeader("X-Toolora-Gateway-Status", "failed");
    res.setHeader("X-Toolora-Gateway-Payout-Mode", payoutMode());
    res.status(httpStatus).json(errBody);
  }

  if (timedOut) {
    logger.warn({ listingId }, "[gateway] upstream timeout >30s — caller will not be charged owner-payout");
    await recordFailedCallAndRespond(504, `upstream_timeout:${UPSTREAM_TIMEOUT_MS}ms`, { error: "upstream_timeout" });
    return;
  }
  if (unreachableReason || upstreamStatus < 200 || upstreamStatus >= 300) {
    logger.warn({ listingId, upstreamStatus, unreachableReason }, "[gateway] upstream unreachable or non-2xx — caller will not be charged owner-payout");
    await recordFailedCallAndRespond(
      502,
      unreachableReason ? `upstream_unreachable:${unreachableReason}` : `upstream_status:${upstreamStatus}`,
      { error: "upstream_unreachable", upstreamStatus, reason: unreachableReason },
    );
    return;
  }

  // ── Upstream succeeded → split + log ──
  // Important accounting invariant: the caller (agent) has ALREADY paid via
  // x402 before we forwarded the request. We owe the owner their 95%. If the
  // payout call throws or returns failed, we MUST still:
  //   (a) record the billing event with status='failed' so reconciliation
  //       can settle it later (or support can refund the agent if needed)
  //   (b) return the upstream response to the caller (they paid for it)
  //   (c) surface the failure honestly via the X-Toolora-Gateway-Status header
  // Throwing a 500 here would be the worst of both worlds: caller paid, no
  // value, no ledger row, no recovery.
  const feeMicros = Math.max(1, Math.round(config.pricePerCallUsdcMicros * 0.05));
  let splitStatus: "settled" | "pending" | "failed" = "failed";
  let splitPayoutTx: string | null = null;
  let splitErrorReason: string | null = null;
  try {
    const split = await splitUsdc({
      amountMicros: config.pricePerCallUsdcMicros,
      feeMicros,
      payoutWallet: config.payoutWalletAddress,
      payoutNetwork: config.payoutNetwork,
      paymentTxHash: payment.txHash ?? "unknown",
    });
    splitStatus = split.status;
    splitPayoutTx = split.payoutTxHash ?? null;
    splitErrorReason = split.errorReason ?? null;
  } catch (err) {
    splitStatus = "failed";
    splitErrorReason =
      "splitter_threw:" + ((err as Error)?.message ?? "unknown").slice(0, 200);
    logger.error(
      { err, listingId, configId: config.id, paymentTx: payment.txHash },
      "[gateway] splitUsdc threw — billing event will be recorded as failed for reconciliation",
    );
  }

  try {
    await db.insert(gatewayBillingEventsTable).values({
      gatewayConfigId: config.id,
      listingId: config.listingId,
      callerPaymentRef: payment.callerRef ?? null,
      toolName: extractToolName(req.body),
      amountUsdcMicros: config.pricePerCallUsdcMicros,
      tooloraFeeUsdcMicros: feeMicros,
      paymentTxHash: payment.txHash ?? null,
      payoutTxHash: splitPayoutTx,
      status: splitStatus,
      errorReason: splitErrorReason,
      settledAt: splitStatus === "settled" ? new Date() : null,
    });
  } catch (err) {
    // Last-resort log — we lost the ledger row entirely. This is bad but
    // there's nothing we can do for the caller at this point: they paid, the
    // upstream succeeded, and we owe the owner. Operator must reconcile from
    // logs. Logging both the payment ref and the upstream success ensures
    // forensic recovery is possible.
    recordGatewayCriticalEvent("success_billing_insert");
    logger.error(
      {
        err,
        listingId,
        configId: config.id,
        paymentTx: payment.txHash,
        callerRef: payment.callerRef,
        amountMicros: config.pricePerCallUsdcMicros,
        feeMicros,
        splitStatus,
        splitPayoutTx,
      },
      "[gateway] CRITICAL: failed to record billing event after successful upstream call — manual reconciliation required",
    );
  }

  // Forward upstream response to caller
  for (const [k, v] of Object.entries(upstreamHeaders)) {
    try { res.setHeader(k, v); } catch { /* noop */ }
  }
  // Trace headers so the caller (and our own dashboards) can see ground truth
  res.setHeader("X-Toolora-Gateway-Status", splitStatus);
  res.setHeader("X-Toolora-Gateway-Payout-Mode", payoutMode());
  res.status(upstreamStatus).send(upstreamBody);
});

// ─── 2. Owner config — POST /configs/:listingId (upsert) ───────────────────
router.post("/configs/:listingId", requireOwner, async (req: Request, res: Response): Promise<void> => {
  try {
    const listingId = String(req.params.listingId);
    const body = (req.body ?? {}) as {
      enabled?: boolean;
      pricePerCallUsdcMicros?: number;
      pricePerCallUsd?: number;
      payoutWalletAddress?: string;
      payoutNetwork?: string;
      upstreamMcpUrl?: string;
      embedEnabled?: boolean;
      proofPublic?: boolean;
      leaderboardOptIn?: boolean;
    };

    // Convert dollars → micros if dollars were supplied
    let priceMicros = body.pricePerCallUsdcMicros;
    if (priceMicros == null && typeof body.pricePerCallUsd === "number") {
      priceMicros = Math.round(body.pricePerCallUsd * 1_000_000);
    }
    if (priceMicros == null || !Number.isFinite(priceMicros)) {
      res.status(400).json({ ok: false, error: "missing_price" });
      return;
    }
    if (priceMicros < MIN_PRICE_MICROS || priceMicros > MAX_PRICE_MICROS) {
      res.status(400).json({ ok: false, error: "price_out_of_range", min: MIN_PRICE_MICROS, max: MAX_PRICE_MICROS });
      return;
    }
    if (!body.payoutWalletAddress || !body.upstreamMcpUrl) {
      res.status(400).json({ ok: false, error: "missing_required_fields", required: ["payoutWalletAddress", "upstreamMcpUrl"] });
      return;
    }

    // SSRF check at save time so misconfigured URLs are rejected with a clear error
    const ssrf = await validateUpstreamUrl(body.upstreamMcpUrl);
    if (!ssrf.ok) {
      res.status(400).json({ ok: false, error: "upstream_url_blocked", reason: ssrf.reason });
      return;
    }

    const network = body.payoutNetwork === "stellar" ? "stellar" : "solana";
    const enabled = body.enabled === true;
    // The 3 distribution opt-ins are independent of `enabled` (an owner may
    // want their listing live but not show their numbers publicly, or vice
    // versa). Treat omitted as false so the upsert is deterministic — POST
    // is the dashboard's full save, not a partial.
    const embedEnabled = body.embedEnabled === true;
    const proofPublic = body.proofPublic === true;
    const leaderboardOptIn = body.leaderboardOptIn === true;

    const existing = await getAnyConfig(listingId);
    if (existing) {
      await db
        .update(gatewayConfigsTable)
        .set({
          enabled,
          pricePerCallUsdcMicros: priceMicros,
          payoutWalletAddress: body.payoutWalletAddress,
          payoutNetwork: network,
          upstreamMcpUrl: body.upstreamMcpUrl,
          embedEnabled,
          proofPublic,
          leaderboardOptIn,
          updatedAt: new Date(),
        })
        .where(eq(gatewayConfigsTable.id, existing.id));
    } else {
      await db.insert(gatewayConfigsTable).values({
        listingId,
        enabled,
        pricePerCallUsdcMicros: priceMicros,
        payoutWalletAddress: body.payoutWalletAddress,
        payoutNetwork: network,
        upstreamMcpUrl: body.upstreamMcpUrl,
        embedEnabled,
        proofPublic,
        leaderboardOptIn,
      });
    }
    const fresh = await getAnyConfig(listingId);
    res.json({ ok: true, config: fresh });
  } catch (err) {
    logger.error({ err }, "[gateway] config upsert failed");
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

// ─── 3. Owner config — PATCH /configs/:listingId (partial) ─────────────────
router.patch("/configs/:listingId", requireOwner, async (req: Request, res: Response): Promise<void> => {
  try {
    const listingId = String(req.params.listingId);
    const existing = await getAnyConfig(listingId);
    if (!existing) {
      res.status(404).json({ ok: false, error: "no_config_yet", hint: "POST a full config first." });
      return;
    }
    const body = (req.body ?? {}) as Partial<{
      enabled: boolean;
      pricePerCallUsdcMicros: number;
      pricePerCallUsd: number;
      payoutWalletAddress: string;
      payoutNetwork: string;
      upstreamMcpUrl: string;
      embedEnabled: boolean;
      proofPublic: boolean;
      leaderboardOptIn: boolean;
    }>;
    const patch: Record<string, unknown> = { updatedAt: new Date() };

    if (typeof body.enabled === "boolean") patch.enabled = body.enabled;
    if (typeof body.pricePerCallUsd === "number") patch.pricePerCallUsdcMicros = Math.round(body.pricePerCallUsd * 1_000_000);
    if (typeof body.pricePerCallUsdcMicros === "number") patch.pricePerCallUsdcMicros = body.pricePerCallUsdcMicros;
    if (typeof patch.pricePerCallUsdcMicros === "number") {
      const p = patch.pricePerCallUsdcMicros as number;
      if (p < MIN_PRICE_MICROS || p > MAX_PRICE_MICROS) {
        res.status(400).json({ ok: false, error: "price_out_of_range" });
        return;
      }
    }
    if (typeof body.payoutWalletAddress === "string") patch.payoutWalletAddress = body.payoutWalletAddress;
    if (body.payoutNetwork === "solana" || body.payoutNetwork === "stellar") patch.payoutNetwork = body.payoutNetwork;
    if (typeof body.upstreamMcpUrl === "string") {
      const ssrf = await validateUpstreamUrl(body.upstreamMcpUrl);
      if (!ssrf.ok) {
        res.status(400).json({ ok: false, error: "upstream_url_blocked", reason: ssrf.reason });
        return;
      }
      patch.upstreamMcpUrl = body.upstreamMcpUrl;
    }
    // Three independent owner opt-ins. Each gates a different public surface
    // (embed badge / on-chain proof page / leaderboard). All default false at
    // schema level, so the only way they get exposed is via this PATCH.
    if (typeof body.embedEnabled === "boolean") patch.embedEnabled = body.embedEnabled;
    if (typeof body.proofPublic === "boolean") patch.proofPublic = body.proofPublic;
    if (typeof body.leaderboardOptIn === "boolean") patch.leaderboardOptIn = body.leaderboardOptIn;

    await db.update(gatewayConfigsTable).set(patch).where(eq(gatewayConfigsTable.id, existing.id));
    const fresh = await getAnyConfig(listingId);
    res.json({ ok: true, config: fresh });
  } catch (err) {
    logger.error({ err }, "[gateway] config patch failed");
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

// ─── 4. Owner config — GET /configs/:listingId ─────────────────────────────
router.get("/configs/:listingId", requireOwner, async (req: Request, res: Response): Promise<void> => {
  const listingId = String(req.params.listingId);
  const config = await getAnyConfig(listingId);
  res.json({ ok: true, config: config ?? null, payoutMode: payoutMode() });
});

// ─── 5. Owner billing events — GET /billing-events/:listingId ──────────────
router.get("/billing-events/:listingId", requireOwner, async (req: Request, res: Response): Promise<void> => {
  const listingId = String(req.params.listingId);
  const limit = Math.min(200, Math.max(1, parseInt(String(req.query.limit ?? "50"), 10) || 50));
  const events = await db
    .select()
    .from(gatewayBillingEventsTable)
    .where(eq(gatewayBillingEventsTable.listingId, listingId))
    .orderBy(desc(gatewayBillingEventsTable.createdAt))
    .limit(limit);
  res.json({ ok: true, events });
});

// ─── 6. Owner earnings summary — GET /summary/:listingId ───────────────────
router.get("/summary/:listingId", requireOwner, async (req: Request, res: Response): Promise<void> => {
  const listingId = String(req.params.listingId);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [day, week, all] = await Promise.all([
    db
      .select({
        calls: sql<number>`count(*)::int`,
        amount: sql<number>`coalesce(sum(amount_usdc_micros), 0)::bigint`,
        fee: sql<number>`coalesce(sum(toolora_fee_usdc_micros), 0)::bigint`,
      })
      .from(gatewayBillingEventsTable)
      .where(
        and(
          eq(gatewayBillingEventsTable.listingId, listingId),
          eq(gatewayBillingEventsTable.status, "settled"),
          sql`created_at >= ${oneDayAgo}`,
        ),
      ),
    db
      .select({
        calls: sql<number>`count(*)::int`,
        amount: sql<number>`coalesce(sum(amount_usdc_micros), 0)::bigint`,
        fee: sql<number>`coalesce(sum(toolora_fee_usdc_micros), 0)::bigint`,
      })
      .from(gatewayBillingEventsTable)
      .where(
        and(
          eq(gatewayBillingEventsTable.listingId, listingId),
          eq(gatewayBillingEventsTable.status, "settled"),
          sql`created_at >= ${sevenDaysAgo}`,
        ),
      ),
    db
      .select({
        calls: sql<number>`count(*)::int`,
        amount: sql<number>`coalesce(sum(amount_usdc_micros), 0)::bigint`,
        fee: sql<number>`coalesce(sum(toolora_fee_usdc_micros), 0)::bigint`,
      })
      .from(gatewayBillingEventsTable)
      .where(
        and(eq(gatewayBillingEventsTable.listingId, listingId), eq(gatewayBillingEventsTable.status, "settled")),
      ),
  ]);

  const summarize = (row: { calls: number; amount: number | string; fee: number | string }) => {
    const amount = Number(row.amount ?? 0);
    const fee = Number(row.fee ?? 0);
    return {
      calls: row.calls,
      grossUsd: amount / 1_000_000,
      feeUsd: fee / 1_000_000,
      ownerEarningsUsd: (amount - fee) / 1_000_000,
    };
  };

  res.json({
    ok: true,
    payoutMode: payoutMode(),
    last24h: summarize(day[0] ?? { calls: 0, amount: 0, fee: 0 }),
    last7d: summarize(week[0] ?? { calls: 0, amount: 0, fee: 0 }),
    allTime: summarize(all[0] ?? { calls: 0, amount: 0, fee: 0 }),
  });
});

// ─── 6b. Public demo stats — GET /public-demo-stats ────────────────────────
// Powers the live "Settled on-chain" ticker on the public /gateway landing
// page. Unauthenticated and aggregate-only — no PII, no per-event detail,
// no caller addresses. Only returns data for the demo listing configured via
// GATEWAY_DEMO_LISTING_ID (defaults to the seeded toolora-gateway-demo-mcp
// so we can ship the landing without per-deploy config). This intentionally
// will NOT serve stats for arbitrary owner listings — owners' revenue is
// private until they opt in.
const DEMO_LISTING_ID =
  process.env.GATEWAY_DEMO_LISTING_ID ?? "9f733346-228b-483e-a704-669be72c398d";

router.get("/public-demo-stats", async (_req: Request, res: Response): Promise<void> => {
  res.setHeader("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
  try {
    const rows = await db
      .select({
        status: gatewayBillingEventsTable.status,
        calls: sql<number>`count(*)::int`,
        callerPaidMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.amountUsdcMicros}), 0)::bigint`,
        ownerEarnedMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.amountUsdcMicros} - ${gatewayBillingEventsTable.tooloraFeeUsdcMicros}), 0)::bigint`,
        feeMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.tooloraFeeUsdcMicros}), 0)::bigint`,
        lastAt: sql<string | null>`max(${gatewayBillingEventsTable.createdAt})`,
      })
      .from(gatewayBillingEventsTable)
      .where(eq(gatewayBillingEventsTable.listingId, DEMO_LISTING_ID))
      .groupBy(gatewayBillingEventsTable.status);

    let totalCalls = 0;
    let settledCalls = 0;
    let failedCalls = 0;
    let ownerEarnedMicros = 0;
    let feeMicros = 0;
    let callerPaidMicros = 0;
    // Source-of-truth: only the settled bucket. Failed-call timestamps must
    // never advance lastSettledAt — the public landing renders this field as
    // "last call Xm ago" under a green pulsing dot, so showing a failure
    // there would be misleading.
    let lastSettledEpochMs = 0;
    for (const r of rows) {
      const calls = Number(r.calls) || 0;
      totalCalls += calls;
      if (r.status === "settled") {
        settledCalls += calls;
        ownerEarnedMicros += Number(r.ownerEarnedMicros) || 0;
        feeMicros += Number(r.feeMicros) || 0;
        callerPaidMicros += Number(r.callerPaidMicros) || 0;
        if (r.lastAt) {
          // Normalize via epoch ms before comparing — avoids string-vs-Date
          // ordering surprises across Postgres drivers / runtimes.
          const lastAt: unknown = r.lastAt;
          const t =
            lastAt instanceof Date
              ? lastAt.getTime()
              : Date.parse(String(lastAt));
          if (Number.isFinite(t) && t > lastSettledEpochMs) {
            lastSettledEpochMs = t;
          }
        }
      } else if (r.status === "failed") {
        failedCalls += calls;
      }
    }

    res.json({
      listingId: DEMO_LISTING_ID,
      mode: payoutMode(),
      totals: {
        calls: totalCalls,
        settled: settledCalls,
        failed: failedCalls,
      },
      usdc: {
        callerPaidMicros,
        ownerEarnedMicros,
        tooloraFeeMicros: feeMicros,
        callerPaidUsd: callerPaidMicros / 1_000_000,
        ownerEarnedUsd: ownerEarnedMicros / 1_000_000,
        tooloraFeeUsd: feeMicros / 1_000_000,
      },
      lastSettledAt:
        lastSettledEpochMs > 0
          ? new Date(lastSettledEpochMs).toISOString()
          : null,
    });
  } catch (err) {
    logger.warn({ err }, "[gateway] public-demo-stats query failed");
    res.json({
      listingId: DEMO_LISTING_ID,
      mode: payoutMode(),
      totals: { calls: 0, settled: 0, failed: 0 },
      usdc: { callerPaidMicros: 0, ownerEarnedMicros: 0, tooloraFeeMicros: 0, callerPaidUsd: 0, ownerEarnedUsd: 0, tooloraFeeUsd: 0 },
      lastSettledAt: null,
    });
  }
});

// ─── 6c. Public stats — GET /public-stats/:listingId (gated) ───────────────
// Per-listing aggregate stats for the embeddable badge. Owner must have
// turned on `embed_enabled` in their gateway config. Same response shape as
// /public-demo-stats so the GatewayLiveTicker can reuse it. Aggregate-only
// — no caller addresses, no per-event detail.
router.get("/public-stats/:listingId", async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
  const listingId = String(req.params.listingId ?? "");
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }
  const cfg = await getAnyConfig(listingId);
  if (!cfg || !(cfg as GatewayConfig & { embedEnabled?: boolean }).embedEnabled) {
    res.status(404).json({ ok: false, error: "embed_not_enabled" });
    return;
  }

  try {
    const rows = await db
      .select({
        status: gatewayBillingEventsTable.status,
        calls: sql<number>`count(*)::int`,
        callerPaidMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.amountUsdcMicros}), 0)::bigint`,
        ownerEarnedMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.amountUsdcMicros} - ${gatewayBillingEventsTable.tooloraFeeUsdcMicros}), 0)::bigint`,
        feeMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.tooloraFeeUsdcMicros}), 0)::bigint`,
        lastAt: sql<string | null>`max(${gatewayBillingEventsTable.createdAt})`,
      })
      .from(gatewayBillingEventsTable)
      .where(eq(gatewayBillingEventsTable.listingId, listingId))
      .groupBy(gatewayBillingEventsTable.status);

    let totalCalls = 0;
    let settledCalls = 0;
    let failedCalls = 0;
    let ownerEarnedMicros = 0;
    let feeMicros = 0;
    let callerPaidMicros = 0;
    let lastSettledEpochMs = 0;
    for (const r of rows) {
      const calls = Number(r.calls) || 0;
      totalCalls += calls;
      if (r.status === "settled") {
        settledCalls += calls;
        ownerEarnedMicros += Number(r.ownerEarnedMicros) || 0;
        feeMicros += Number(r.feeMicros) || 0;
        callerPaidMicros += Number(r.callerPaidMicros) || 0;
        if (r.lastAt) {
          // r.lastAt comes back as `string | null` per the column types but
          // some pg drivers materialize it as a Date — coerce defensively.
          const raw = r.lastAt as unknown;
          const t = raw instanceof Date ? raw.getTime() : Date.parse(String(raw));
          if (Number.isFinite(t) && t > lastSettledEpochMs) lastSettledEpochMs = t;
        }
      } else if (r.status === "failed") {
        failedCalls += calls;
      }
    }

    res.json({
      listingId,
      mode: payoutMode(),
      totals: { calls: totalCalls, settled: settledCalls, failed: failedCalls },
      usdc: {
        callerPaidMicros,
        ownerEarnedMicros,
        tooloraFeeMicros: feeMicros,
        callerPaidUsd: callerPaidMicros / 1_000_000,
        ownerEarnedUsd: ownerEarnedMicros / 1_000_000,
        tooloraFeeUsd: feeMicros / 1_000_000,
      },
      lastSettledAt: lastSettledEpochMs > 0 ? new Date(lastSettledEpochMs).toISOString() : null,
    });
  } catch (err) {
    logger.warn({ err, listingId }, "[gateway] public-stats query failed");
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

// ─── 6d. Public proof — GET /public-proof/:listingId (gated) ────────────────
// Last 50 billing events for a listing, projecting only on-chain artifacts
// (tx hashes, amounts, status). Gated by `proof_public` opt-in. Designed to
// power the public proof page where YC partners / customers can audit any
// listing in <30 seconds by clicking the explorer links.
router.get("/public-proof/:listingId", async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
  const listingId = String(req.params.listingId ?? "");
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? "50"), 10) || 50));
  if (!listingId) {
    res.status(400).json({ ok: false, error: "missing_listing_id" });
    return;
  }
  const cfg = await getAnyConfig(listingId);
  if (!cfg || !(cfg as GatewayConfig & { proofPublic?: boolean }).proofPublic) {
    res.status(404).json({ ok: false, error: "proof_not_public" });
    return;
  }
  const listing = await getListing(listingId);
  if (!listing) {
    res.status(404).json({ ok: false, error: "listing_not_found" });
    return;
  }
  try {
    const rows = await getPublicProofRows(listingId, limit);
    res.json({
      ok: true,
      listing: { id: listing.id, name: listing.name },
      mode: payoutMode(),
      rows,
    });
  } catch (err) {
    logger.warn({ err, listingId }, "[gateway] public-proof query failed");
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

// ─── 6d2. Global stats — GET /global-stats ──────────────────────────────────
// Powers the homepage live agent-call ticker. Aggregates across ALL
// leaderboard-opt-in listings within the requested window (1h | 24h | all).
// Cached 20s (matches the homepage ticker poll interval) so a spike on a
// linked HN post can't hammer the DB.
router.get("/global-stats", async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Cache-Control", "public, max-age=20, stale-while-revalidate=60");
  // Public read-only endpoint — allow cross-origin so embedded ticker widgets
  // and third-party dashboards (mcp.so, Smithery) can poll it directly.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  const windowParam = String(req.query.window ?? "1h").toLowerCase();
  const validWindows: Record<string, { ms: number | null; label: string }> = {
    "1h":  { ms:        60 * 60 * 1000, label: "Last hour"  },
    "24h": { ms:   24 * 60 * 60 * 1000, label: "Last 24h"   },
    "7d":  { ms: 7 * 24 * 60 * 60 * 1000, label: "Last 7 days" },
    "all": { ms: null,                    label: "All-time"  },
  };
  const w = validWindows[windowParam] ?? validWindows["1h"];
  // Use parameterized binding (defense in depth — w.ms already comes from a
  // hardcoded validWindows map, but never use sql.raw with anything reachable
  // from req). `make_interval` accepts a numeric `secs` arg that's safely bound.
  const sinceClause = w.ms !== null
    ? sql`${gatewayBillingEventsTable.createdAt} >= now() - make_interval(secs => ${w.ms / 1000})`
    : sql`true`;

  try {
    const [agg] = await db
      .select({
        calls: sql<number>`count(*)::int`,
        settledCalls: sql<number>`count(*) filter (where ${gatewayBillingEventsTable.status} = 'settled')::int`,
        callerPaidMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.amountUsdcMicros}) filter (where ${gatewayBillingEventsTable.status} = 'settled'), 0)::bigint`,
        ownerEarnedMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.amountUsdcMicros} - ${gatewayBillingEventsTable.tooloraFeeUsdcMicros}) filter (where ${gatewayBillingEventsTable.status} = 'settled'), 0)::bigint`,
        tooloraFeeMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.tooloraFeeUsdcMicros}) filter (where ${gatewayBillingEventsTable.status} = 'settled'), 0)::bigint`,
        distinctOwners: sql<number>`count(distinct ${gatewayBillingEventsTable.listingId})::int`,
      })
      .from(gatewayBillingEventsTable)
      .innerJoin(gatewayConfigsTable, eq(gatewayConfigsTable.listingId, gatewayBillingEventsTable.listingId))
      .where(and(eq(gatewayConfigsTable.leaderboardOptIn, true), sinceClause));

    res.json({
      ok: true,
      window: windowParam,
      windowLabel: w.label,
      generatedAt: new Date().toISOString(),
      totals: {
        calls: Number(agg?.calls) || 0,
        settledCalls: Number(agg?.settledCalls) || 0,
        callerPaidUsd: (Number(agg?.callerPaidMicros) || 0) / 1_000_000,
        ownerEarnedUsd: (Number(agg?.ownerEarnedMicros) || 0) / 1_000_000,
        tooloraFeeUsd: (Number(agg?.tooloraFeeMicros) || 0) / 1_000_000,
        distinctOwners: Number(agg?.distinctOwners) || 0,
      },
    });
  } catch (err) {
    logger.warn({ err, window: windowParam }, "[gateway] global-stats query failed");
    res.json({
      ok: true,
      window: windowParam,
      windowLabel: w.label,
      generatedAt: new Date().toISOString(),
      totals: { calls: 0, settledCalls: 0, callerPaidUsd: 0, ownerEarnedUsd: 0, tooloraFeeUsd: 0, distinctOwners: 0 },
    });
  }
});

// ─── 6e. Leaderboard — GET /leaderboard ─────────────────────────────────────
// Top 10 listings by settled USDC volume across all opt-in listings. 60 s
// cache so a Hacker News spike can't melt the DB.
router.get("/leaderboard", async (_req: Request, res: Response): Promise<void> => {
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  try {
    const rows = await db
      .select({
        listingId: gatewayBillingEventsTable.listingId,
        name: mcpListingsTable.name,
        calls: sql<number>`count(*)::int`,
        callerPaidMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.amountUsdcMicros}), 0)::bigint`,
        ownerEarnedMicros: sql<number>`coalesce(sum(${gatewayBillingEventsTable.amountUsdcMicros} - ${gatewayBillingEventsTable.tooloraFeeUsdcMicros}), 0)::bigint`,
      })
      .from(gatewayBillingEventsTable)
      .innerJoin(gatewayConfigsTable, eq(gatewayConfigsTable.listingId, gatewayBillingEventsTable.listingId))
      .innerJoin(mcpListingsTable, eq(mcpListingsTable.id, gatewayBillingEventsTable.listingId))
      .where(
        and(
          eq(gatewayBillingEventsTable.status, "settled"),
          eq(gatewayConfigsTable.leaderboardOptIn, true),
        ),
      )
      .groupBy(gatewayBillingEventsTable.listingId, mcpListingsTable.name)
      .orderBy(desc(sql`sum(${gatewayBillingEventsTable.amountUsdcMicros} - ${gatewayBillingEventsTable.tooloraFeeUsdcMicros})`))
      .limit(10);

    // mcp_listings has no `slug` column — listing detail pages route by id.
    // Leaderboard.tsx tolerates `slug: null` and just hides the deep-link icon.
    const entries = rows.map((r, idx) => ({
      rank: idx + 1,
      listingId: r.listingId,
      name: r.name,
      slug: null as string | null,
      calls: Number(r.calls) || 0,
      callerPaidUsd: (Number(r.callerPaidMicros) || 0) / 1_000_000,
      ownerEarnedUsd: (Number(r.ownerEarnedMicros) || 0) / 1_000_000,
    }));

    res.json({ ok: true, generatedAt: new Date().toISOString(), entries });
  } catch (err) {
    logger.warn({ err }, "[gateway] leaderboard query failed");
    res.json({ ok: true, generatedAt: new Date().toISOString(), entries: [] });
  }
});

// ─── 6f. OpenAPI → MCP shim ─────────────────────────────────────────────────
// Anyone with a public OpenAPI 3 JSON spec can register it and get back a
// gateway-billable MCP URL. This is the "long-tail capture" lever — any
// service with a REST API gets MCP-shaped + monetizable in one POST.
//
// Security model: the spec URL itself is SSRF-validated, the parsed
// servers[].url (the upstream the shim forwards to) is SSRF-validated, and
// every per-call invocation re-validates because operation paths can include
// path params that change the resolved host. We never expose secrets — auth
// for the upstream API is the spec author's problem (use a proxy that adds
// the API key, then publish that proxy's spec).

interface OpenApiOperation {
  toolName: string; // sanitized op name
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters?: Array<{ name: string; in: string; required?: boolean; schema?: unknown }>;
  requestBody?: { required?: boolean; content?: Record<string, { schema?: unknown }> };
}

interface ParsedSpec {
  baseUrl: string;
  title: string;
  description?: string;
  operations: OpenApiOperation[];
}

const MAX_SPEC_BYTES = 2 * 1024 * 1024; // 2 MB cap on spec payloads

async function fetchAndParseSpec(specUrl: string): Promise<ParsedSpec> {
  const ssrf = await validateUpstreamUrl(specUrl);
  if (!ssrf.ok) throw new Error(`spec_url_blocked: ${ssrf.reason}`);

  const dispatcher = pinnedDispatcher(ssrf.resolvedIps ?? []);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  // The local `Response` type is Express's res shape (this file is also a
  // route handler); the WHATWG `Response` we actually get from undiciFetch
  // collides with it. Use a structural type for the fields we need.
  let resp: { ok: boolean; status: number; text(): Promise<string> };
  try {
    resp = (await undiciFetch(specUrl, {
      method: "GET",
      headers: { accept: "application/json" },
      signal: ctrl.signal,
      dispatcher,
    })) as unknown as { ok: boolean; status: number; text(): Promise<string> };
  } finally {
    clearTimeout(timer);
  }
  if (!resp.ok) throw new Error(`spec_fetch_failed: http_${resp.status}`);

  const text = await resp.text();
  if (text.length > MAX_SPEC_BYTES) throw new Error("spec_too_large");
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("spec_not_json");
  }

  const spec = json as {
    openapi?: string;
    info?: { title?: string; description?: string };
    servers?: Array<{ url?: string }>;
    paths?: Record<string, Record<string, {
      operationId?: string;
      summary?: string;
      description?: string;
      parameters?: OpenApiOperation["parameters"];
      requestBody?: OpenApiOperation["requestBody"];
    }>>;
  };
  if (!spec.openapi || !spec.openapi.startsWith("3.")) throw new Error("unsupported_openapi_version");
  const rawServerUrl = spec.servers?.[0]?.url;
  // Resolve relative server URLs (e.g. Petstore uses "/api/v3") against the
  // spec URL's origin. Fall back to the spec URL's origin itself when no
  // servers[] is provided (some specs omit it entirely).
  let baseUrl: string;
  try {
    baseUrl = rawServerUrl
      ? new URL(rawServerUrl, specUrl).toString()
      : new URL("/", specUrl).toString();
  } catch {
    throw new Error("spec_invalid_server_url");
  }
  // SSRF-validate the resolved upstream base too
  const baseSsrf = await validateUpstreamUrl(baseUrl);
  if (!baseSsrf.ok) throw new Error(`base_url_blocked: ${baseSsrf.reason}`);

  const operations: OpenApiOperation[] = [];
  const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;
  for (const [pathKey, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op) continue;
      const rawName = op.operationId ?? `${method}_${pathKey.replace(/[^a-z0-9]+/gi, "_")}`;
      const toolName = rawName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
      operations.push({
        toolName,
        method: method.toUpperCase(),
        path: pathKey,
        summary: op.summary,
        description: op.description,
        parameters: op.parameters,
        requestBody: op.requestBody,
      });
      if (operations.length >= 200) break;
    }
    if (operations.length >= 200) break;
  }
  if (operations.length === 0) throw new Error("spec_no_operations");

  return {
    baseUrl,
    title: spec.info?.title ?? "Untitled API",
    description: spec.info?.description,
    operations,
  };
}

// In-memory IP rate limiter for unauthenticated /openapi-to-mcp/init.
// 10 submissions per IP per hour — enough for legit "try, fix, retry" loops,
// tight enough that a single bored actor can't flood the DB with orphan
// listings. Bounded map (≤5k IPs) so this can never OOM the server.
const initRateLimitWindow = 60 * 60 * 1000; // 1h
const initRateLimitMax = 10;
const initRateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkInitRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter: number } {
  if (initRateLimitMap.size > 5000) {
    // Evict oldest 1k entries to bound memory.
    const entries = [...initRateLimitMap.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
    for (let i = 0; i < 1000 && i < entries.length; i++) initRateLimitMap.delete(entries[i][0]);
  }
  const now = Date.now();
  const entry = initRateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    initRateLimitMap.set(ip, { count: 1, resetAt: now + initRateLimitWindow });
    return { allowed: true, remaining: initRateLimitMax - 1, retryAfter: 0 };
  }
  entry.count += 1;
  if (entry.count > initRateLimitMax) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true, remaining: initRateLimitMax - entry.count, retryAfter: 0 };
}

// URL pre-validation — reject obvious garbage before we hit fetchAndParseSpec
// so bots can't waste CPU on us. fetchAndParseSpec also validates SSRF,
// so this is purely a fast-path filter on the public surface.
function preValidateSpecUrl(raw: string): { ok: true; url: URL } | { ok: false; reason: string } {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: "Invalid URL format. Must be a full URL like https://example.com/openapi.json" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, reason: "URL must use http:// or https://" };
  }
  if (raw.length > 2048) {
    return { ok: false, reason: "URL too long (max 2048 chars)" };
  }
  return { ok: true, url };
}

router.post("/openapi-to-mcp/init", async (req: Request, res: Response): Promise<void> => {
  const ip = String(req.ip ?? req.socket.remoteAddress ?? "unknown");
  const rl = checkInitRateLimit(ip);
  res.setHeader("X-RateLimit-Limit", String(initRateLimitMax));
  res.setHeader("X-RateLimit-Remaining", String(rl.remaining));
  if (!rl.allowed) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    res.status(429).json({
      ok: false,
      error: "rate_limited",
      reason: `Too many submissions from your IP. Try again in ${Math.ceil(rl.retryAfter / 60)} minutes.`,
    });
    return;
  }

  const body = (req.body ?? {}) as { specUrl?: string };
  const specUrl = String(body.specUrl ?? "").trim();
  if (!specUrl) {
    res.status(400).json({ ok: false, error: "missing_spec_url" });
    return;
  }
  const pre = preValidateSpecUrl(specUrl);
  if (!pre.ok) {
    res.status(400).json({ ok: false, error: "invalid_url", reason: pre.reason });
    return;
  }
  try {
    const parsed = await fetchAndParseSpec(specUrl);

    const inserted = await db
      .insert(openapiMcpSpecsTable)
      .values({
        specUrl,
        baseUrl: parsed.baseUrl,
        name: parsed.title,
        description: parsed.description,
        parsedSpecJson: parsed,
      })
      .returning({ id: openapiMcpSpecsTable.id });

    const specId = inserted[0]?.id;
    if (!specId) {
      res.status(500).json({ ok: false, error: "insert_failed" });
      return;
    }
    res.json({
      ok: true,
      specId,
      title: parsed.title,
      operationCount: parsed.operations.length,
      mcpUrl: `/api/gateway/openapi-mcp/${specId}`,
      hint: "Use mcpUrl as your Toolora gateway upstreamMcpUrl. Each operation becomes a tool callable via JSON-RPC tools/call.",
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown";
    res.status(400).json({ ok: false, error: "spec_invalid", reason });
  }
});

router.all("/openapi-mcp/:specId", async (req: Request, res: Response): Promise<void> => {
  const specId = String(req.params.specId ?? "");
  if (!specId) {
    res.status(400).json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "missing_spec_id" } });
    return;
  }
  if (req.method === "GET") {
    res.json({ ok: true, hint: "POST a JSON-RPC body. tools/list returns operations; tools/call invokes." });
    return;
  }

  let row: { id: string; baseUrl: string; parsedSpecJson: unknown } | undefined;
  try {
    const rows = await db
      .select({
        id: openapiMcpSpecsTable.id,
        baseUrl: openapiMcpSpecsTable.baseUrl,
        parsedSpecJson: openapiMcpSpecsTable.parsedSpecJson,
      })
      .from(openapiMcpSpecsTable)
      .where(eq(openapiMcpSpecsTable.id, specId))
      .limit(1);
    row = rows[0];
  } catch {
    /* fall through */
  }
  if (!row) {
    res.status(404).json({ jsonrpc: "2.0", id: null, error: { code: -32601, message: "spec_not_found" } });
    return;
  }
  const parsed = row.parsedSpecJson as ParsedSpec;
  const body = (req.body ?? {}) as { jsonrpc?: string; id?: number | string; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };
  const id = body?.id ?? null;
  const method = body?.method ?? "";

  if (method === "tools/list" || method === "initialize") {
    const tools = parsed.operations.map((op) => ({
      name: op.toolName,
      description: op.summary ?? op.description ?? `${op.method} ${op.path}`,
      inputSchema: { type: "object", properties: {}, additionalProperties: true },
    }));
    res.json({ jsonrpc: "2.0", id, result: { tools } });
    return;
  }

  if (method === "tools/call") {
    const toolName = body.params?.name ?? "";
    const args = (body.params?.arguments ?? {}) as Record<string, unknown>;
    const op = parsed.operations.find((o) => o.toolName === toolName);
    if (!op) {
      res.status(404).json({ jsonrpc: "2.0", id, error: { code: -32601, message: `unknown_tool: ${toolName}` } });
      return;
    }

    // Substitute path params from arguments. Anything left over is sent as a
    // query string (GET/DELETE) or JSON body (POST/PUT/PATCH).
    let path = op.path;
    const consumed = new Set<string>();
    path = path.replace(/\{([^}]+)\}/g, (_, name: string) => {
      consumed.add(name);
      const v = args[name];
      return encodeURIComponent(String(v ?? ""));
    });
    const remainingArgs: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(args)) if (!consumed.has(k)) remainingArgs[k] = v;

    const url = new URL(path, parsed.baseUrl).toString();
    // Final SSRF check on the constructed URL — path params could have shifted
    // the host/port if the spec is malicious.
    const ssrf = await validateUpstreamUrl(url);
    if (!ssrf.ok) {
      res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32602, message: `url_blocked: ${ssrf.reason}` } });
      return;
    }

    const usesQuery = op.method === "GET" || op.method === "DELETE";
    const finalUrl = usesQuery && Object.keys(remainingArgs).length > 0
      ? `${url}?${new URLSearchParams(Object.fromEntries(Object.entries(remainingArgs).map(([k, v]) => [k, String(v)])))}`
      : url;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT_MS);
    try {
      const upstream = (await undiciFetch(finalUrl, {
        method: op.method,
        headers: usesQuery ? { accept: "application/json" } : { accept: "application/json", "content-type": "application/json" },
        body: usesQuery ? undefined : JSON.stringify(remainingArgs),
        signal: ctrl.signal,
        dispatcher: pinnedDispatcher(ssrf.resolvedIps ?? []),
      })) as unknown as { ok: boolean; status: number; text(): Promise<string> };
      const text = await upstream.text();
      const truncated = text.length > MAX_UPSTREAM_BYTES;
      res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            { type: "text", text: truncated ? text.slice(0, MAX_UPSTREAM_BYTES) + "\n…(truncated)" : text },
          ],
          meta: { upstreamStatus: upstream.status, openapiTool: op.toolName, method: op.method, path: op.path },
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "upstream_failed";
      res.status(502).json({ jsonrpc: "2.0", id, error: { code: -32603, message: `upstream_failed: ${msg}` } });
    } finally {
      clearTimeout(timer);
    }
    return;
  }

  res.json({ jsonrpc: "2.0", id, error: { code: -32601, message: `unknown_method: ${method}` } });
});

// ─── 7. Echo MCP (smoke-test upstream) ─────────────────────────────────────
// A minimal JSON-RPC echo so the smoke test has a real upstream to forward
// to without spinning up a separate Repl. The "third party MCP" for May 2's
// proof shot is this — clearly marked, removable post-launch.
router.get("/echo/health", (_req, res) => {
  res.json({ ok: true, service: "toolora-gateway-echo-mcp" });
});

router.all("/echo", async (req: Request, res: Response): Promise<void> => {
  const body = req.body as { jsonrpc?: string; id?: number | string; method?: string; params?: unknown };
  // Optional ?delayMs=N (capped at 60s) to support self-contained integration
  // tests of the gateway's UPSTREAM_TIMEOUT_MS path without depending on
  // flaky third-party slow services like httpbin (caps at 10s) or httpstat.us
  // (closes connection early). Only enabled outside production.
  const rawDelay = Number(req.query.delayMs);
  if (
    process.env.NODE_ENV !== "production" &&
    Number.isFinite(rawDelay) &&
    rawDelay > 0
  ) {
    const delayMs = Math.min(rawDelay, 60_000);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  if (req.method === "GET") {
    res.json({ ok: true, service: "toolora-gateway-echo-mcp", hint: "POST a JSON-RPC body to invoke." });
    return;
  }
  // Mimic an MCP-style JSON-RPC response
  res.json({
    jsonrpc: "2.0",
    id: body?.id ?? null,
    result: {
      content: [
        {
          type: "text",
          text: `Echo MCP received method='${body?.method ?? "unknown"}' with params=${JSON.stringify(body?.params ?? null)}`,
        },
      ],
      meta: {
        echo: true,
        receivedAt: new Date().toISOString(),
      },
    },
  });
});

export default router;
