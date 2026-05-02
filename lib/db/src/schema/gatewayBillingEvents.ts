import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { gatewayConfigsTable } from "./gatewayConfigs";

export const gatewayBillingEventsTable = pgTable(
  "gateway_billing_events",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    gatewayConfigId: text("gateway_config_id")
      .notNull()
      .references(() => gatewayConfigsTable.id, { onDelete: "cascade" }),
    listingId: text("listing_id").notNull(),
    callerPaymentRef: text("caller_payment_ref"),
    toolName: text("tool_name"),
    amountUsdcMicros: integer("amount_usdc_micros").notNull(),
    tooloraFeeUsdcMicros: integer("toolora_fee_usdc_micros").notNull(),
    paymentTxHash: text("payment_tx_hash"),
    payoutTxHash: text("payout_tx_hash"),
    status: text("status").notNull().default("pending"),
    errorReason: text("error_reason"),
    // Auto-refund tracking. When the upstream returns non-2xx, times out, or
    // is unreachable, the agent has already paid via x402 but didn't get a
    // working response. The refund worker scans status='failed' rows where
    // refund_tx_hash IS NULL and issues a refund (synthetic in stub mode,
    // real Solana tx in broadcast mode), then records the tx + refunded_at.
    refundTxHash: text("refund_tx_hash"),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    settledAt: timestamp("settled_at", { withTimezone: true }),
  },
  (t) => ({
    configIdx: index("gw_events_config_idx").on(t.gatewayConfigId),
    listingIdx: index("gw_events_listing_idx").on(t.listingId),
    statusIdx: index("gw_events_status_idx").on(t.status),
    createdAtIdx: index("gw_events_created_idx").on(t.createdAt),
    // Partial-ish index for the refund worker scan. We don't have partial-
    // index syntax in drizzle's pgTable builder, so this is a regular
    // composite that the planner can still use for the (status='failed' AND
    // refund_tx_hash IS NULL) lookup.
    refundScanIdx: index("gw_events_refund_scan_idx").on(t.status, t.refundTxHash),
  }),
);

export type GatewayBillingEvent = typeof gatewayBillingEventsTable.$inferSelect;
export type InsertGatewayBillingEvent = typeof gatewayBillingEventsTable.$inferInsert;
