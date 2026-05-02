import crypto from "node:crypto";
import { db } from "@workspace/db";
import { gatewayBillingEventsTable, gatewayConfigsTable } from "@workspace/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { logger } from "./logger";
import { payoutMode } from "./usdcSplitter";

/**
 * Auto-refund worker.
 *
 * The gateway records `status='failed'` rows whenever the upstream MCP returns
 * a non-2xx response, times out, or is unreachable. The agent has already
 * paid via x402 but received no useful work — so we owe them a refund.
 *
 * In stub mode (default for dev) we synthesize a refund tx hash. In broadcast
 * mode (production, once the platform wallet is funded) the same hook will
 * actually broadcast a Solana SPL-USDC transfer back to the caller.
 *
 * The worker is idempotent: it only picks up rows where refund_tx_hash IS NULL,
 * and uses a guarded UPDATE so two workers running concurrently can't double-
 * refund the same event.
 *
 * Why not refund inline at the proxy? Two reasons:
 *   1. Refunds shouldn't block the response we send back to the agent — they
 *      already know the call failed.
 *   2. Putting it in a worker means we automatically clean up any historical
 *      failed events that pre-date this feature.
 */

export interface RefundResult {
  scanned: number;
  refunded: number;
  errors: number;
}

const MAX_PER_RUN = 50; // be gentle with the DB

/**
 * Process pending refunds. Safe to call as often as you like; idempotent.
 */
export async function processGatewayRefunds(): Promise<RefundResult> {
  const result: RefundResult = { scanned: 0, refunded: 0, errors: 0 };

  let candidates: { id: string; amountUsdcMicros: number; callerPaymentRef: string | null; paymentTxHash: string | null }[] = [];
  try {
    candidates = await db
      .select({
        id: gatewayBillingEventsTable.id,
        amountUsdcMicros: gatewayBillingEventsTable.amountUsdcMicros,
        callerPaymentRef: gatewayBillingEventsTable.callerPaymentRef,
        paymentTxHash: gatewayBillingEventsTable.paymentTxHash,
      })
      .from(gatewayBillingEventsTable)
      .where(
        and(
          eq(gatewayBillingEventsTable.status, "failed"),
          isNull(gatewayBillingEventsTable.refundTxHash),
        ),
      )
      .limit(MAX_PER_RUN);
  } catch (err) {
    logger.error({ err }, "[refund-worker] candidate scan failed");
    return result;
  }

  result.scanned = candidates.length;
  if (candidates.length === 0) return result;

  const mode = payoutMode();
  // A unique-per-process claim sentinel so we can tell our own claims apart
  // from another worker's. Anything starting with "pending_" is a claim, not
  // a real refund tx hash, so the public-proof endpoint hides those rows
  // (see filter below in getPublicProofRows). Length budget: 64 chars, well
  // under refund_tx_hash's text capacity.
  const workerId = crypto.randomBytes(6).toString("hex");

  for (const row of candidates) {
    // Phase 1 — atomic claim BEFORE any external side-effect. Two workers
    // hitting the same row will race on this UPDATE; only one's RETURNING
    // will produce a row, the other's will be empty and we silently skip.
    // This is the financial-safety primitive: we will never broadcast a
    // refund without first owning the row.
    const claimToken = `pending_${workerId}_${row.id}`;
    let claimed: { id: string }[] = [];
    try {
      claimed = await db
        .update(gatewayBillingEventsTable)
        .set({ refundTxHash: claimToken })
        .where(
          and(
            eq(gatewayBillingEventsTable.id, row.id),
            isNull(gatewayBillingEventsTable.refundTxHash),
          ),
        )
        .returning({ id: gatewayBillingEventsTable.id });
    } catch (err) {
      result.errors += 1;
      logger.warn({ err, eventId: row.id }, "[refund-worker] claim failed");
      continue;
    }
    if (claimed.length === 0) continue; // another worker beat us — fine.

    // Phase 2 — perform the side-effect. If anything throws here we MUST
    // release the claim so a future scan can retry. Otherwise the row is
    // permanently stuck in "pending_" purgatory.
    let refundTx: string;
    try {
      refundTx =
        mode === "stub"
          ? "stub_refund_" +
            crypto
              .createHash("sha256")
              .update(`${row.id}|${row.paymentTxHash ?? "no_tx"}|${row.amountUsdcMicros}`)
              .digest("hex")
              .slice(0, 32)
          : await broadcastRealRefund(row);
    } catch (err) {
      result.errors += 1;
      logger.warn({ err, eventId: row.id }, "[refund-worker] broadcast failed; releasing claim");
      try {
        await db
          .update(gatewayBillingEventsTable)
          .set({ refundTxHash: null })
          .where(
            and(
              eq(gatewayBillingEventsTable.id, row.id),
              eq(gatewayBillingEventsTable.refundTxHash, claimToken),
            ),
          );
      } catch (releaseErr) {
        logger.error(
          { releaseErr, eventId: row.id, claimToken },
          "[refund-worker] CRITICAL: claim release failed — row may be stuck",
        );
      }
      continue;
    }

    // Phase 3 — finalize. Guarded on our own claim token so we never
    // overwrite someone else's finalized hash.
    try {
      const finalized = await db
        .update(gatewayBillingEventsTable)
        .set({ refundTxHash: refundTx, refundedAt: new Date() })
        .where(
          and(
            eq(gatewayBillingEventsTable.id, row.id),
            eq(gatewayBillingEventsTable.refundTxHash, claimToken),
          ),
        )
        .returning({ id: gatewayBillingEventsTable.id });
      if (finalized.length > 0) {
        result.refunded += 1;
        logger.info(
          { eventId: row.id, refundTx, mode, amountMicros: row.amountUsdcMicros },
          "[refund-worker] refunded failed gateway call",
        );
      }
    } catch (err) {
      result.errors += 1;
      logger.error(
        { err, eventId: row.id, refundTx, claimToken },
        "[refund-worker] CRITICAL: finalize failed after broadcast — money may have moved without ledger update",
      );
    }
  }

  return result;
}

/**
 * Placeholder for the real Solana-broadcast refund. Today the platform wallet
 * isn't funded so we never reach this path — the worker only runs in stub
 * mode. When we flip GATEWAY_PAYOUT_MODE=broadcast we'll wire this up to
 * @solana/web3.js the same way usdcSplitter does for outgoing payouts.
 */
async function broadcastRealRefund(_row: {
  id: string;
  amountUsdcMicros: number;
  callerPaymentRef: string | null;
  paymentTxHash: string | null;
}): Promise<string> {
  // Intentionally not implemented. The worker logs "errors+1" if this throws,
  // and the row remains refund_tx_hash=NULL so the next pass will retry. This
  // is the desired behaviour — we'd rather queue indefinitely than mark a
  // refund "done" when no money actually moved.
  throw new Error("broadcast refund mode not yet implemented");
}

let workerHandle: NodeJS.Timeout | null = null;

/**
 * Start the periodic refund scan. Call once at server boot.
 *
 * - Disabled if GATEWAY_REFUND_WORKER_DISABLED=1 or NODE_ENV=test (smoke
 *   tests inject failed rows on purpose and assert against them — auto-
 *   refunds would race the assertions).
 * - Default interval 60s; tunable via GATEWAY_REFUND_WORKER_INTERVAL_MS.
 */
export function startRefundWorker(): void {
  if (workerHandle) return;
  if (process.env.GATEWAY_REFUND_WORKER_DISABLED === "1") {
    logger.info("[refund-worker] disabled via env");
    return;
  }
  if (process.env.NODE_ENV === "test") {
    logger.info("[refund-worker] suppressed in test mode");
    return;
  }
  const raw = Number(process.env.GATEWAY_REFUND_WORKER_INTERVAL_MS);
  const intervalMs = Number.isFinite(raw) && raw >= 5_000 && raw <= 600_000 ? raw : 60_000;

  // Run once shortly after boot so we don't have to wait a full interval to
  // catch up on backlog from previous deploys.
  setTimeout(() => {
    void processGatewayRefunds().then((r) => {
      if (r.scanned > 0) logger.info({ ...r, mode: payoutMode() }, "[refund-worker] initial scan");
    });
  }, 5_000);

  workerHandle = setInterval(() => {
    void processGatewayRefunds().then((r) => {
      if (r.scanned > 0 || r.errors > 0) {
        logger.info({ ...r, mode: payoutMode() }, "[refund-worker] scan complete");
      }
    });
  }, intervalMs);
  logger.info({ intervalMs, mode: payoutMode() }, "[refund-worker] started");
}

/**
 * Lookup helper for the public-proof endpoint — returns the most recent N
 * settled events for a listing, projecting only the columns safe to expose
 * (no caller addresses, no error reasons).
 */
export async function getPublicProofRows(
  listingId: string,
  limit: number,
): Promise<
  {
    id: string;
    toolName: string | null;
    paymentTxHash: string | null;
    payoutTxHash: string | null;
    refundTxHash: string | null;
    amountUsdcMicros: number;
    tooloraFeeUsdcMicros: number;
    status: string;
    createdAt: Date | null;
    settledAt: Date | null;
    refundedAt: Date | null;
  }[]
> {
  // Project an empty string as the public refund hash whenever the value is
  // a worker claim sentinel (`pending_<workerId>_<eventId>`) — those rows
  // are mid-flight and we don't want to leak internal claim tokens to the
  // public proof page. Drizzle has no portable conditional projection so we
  // do it in JS after the SELECT.
  const rows = await db
    .select({
      id: gatewayBillingEventsTable.id,
      toolName: gatewayBillingEventsTable.toolName,
      paymentTxHash: gatewayBillingEventsTable.paymentTxHash,
      payoutTxHash: gatewayBillingEventsTable.payoutTxHash,
      refundTxHash: gatewayBillingEventsTable.refundTxHash,
      amountUsdcMicros: gatewayBillingEventsTable.amountUsdcMicros,
      tooloraFeeUsdcMicros: gatewayBillingEventsTable.tooloraFeeUsdcMicros,
      status: gatewayBillingEventsTable.status,
      createdAt: gatewayBillingEventsTable.createdAt,
      settledAt: gatewayBillingEventsTable.settledAt,
      refundedAt: gatewayBillingEventsTable.refundedAt,
    })
    .from(gatewayBillingEventsTable)
    .where(eq(gatewayBillingEventsTable.listingId, listingId))
    .orderBy(sql`coalesce(${gatewayBillingEventsTable.settledAt}, ${gatewayBillingEventsTable.createdAt}) DESC`)
    .limit(limit);
  return rows.map((r) => ({
    ...r,
    refundTxHash: r.refundTxHash && r.refundTxHash.startsWith("pending_") ? null : r.refundTxHash,
  }));
}
