import { Router, type IRouter, type Request, type Response } from "express";
import { Agent as UndiciAgent, fetch as undiciFetch } from "undici";
import dns from "node:dns";
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

const router: IRouter = Router();

const UPSTREAM_TIMEOUT_MS = 30_000;
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
    if ((err as Error & { name?: string })?.name === "AbortError") timedOut = true;
    else {
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

// ─── 7. Echo MCP (smoke-test upstream) ─────────────────────────────────────
// A minimal JSON-RPC echo so the smoke test has a real upstream to forward
// to without spinning up a separate Repl. The "third party MCP" for May 2's
// proof shot is this — clearly marked, removable post-launch.
router.get("/echo/health", (_req, res) => {
  res.json({ ok: true, service: "toolora-gateway-echo-mcp" });
});

router.all("/echo", (req: Request, res: Response): void => {
  const body = req.body as { jsonrpc?: string; id?: number | string; method?: string; params?: unknown };
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
