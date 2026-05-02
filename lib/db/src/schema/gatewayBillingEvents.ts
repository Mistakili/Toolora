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
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    settledAt: timestamp("settled_at", { withTimezone: true }),
  },
  (t) => ({
    configIdx: index("gw_events_config_idx").on(t.gatewayConfigId),
    listingIdx: index("gw_events_listing_idx").on(t.listingId),
    statusIdx: index("gw_events_status_idx").on(t.status),
    createdAtIdx: index("gw_events_created_idx").on(t.createdAt),
  }),
);

export type GatewayBillingEvent = typeof gatewayBillingEventsTable.$inferSelect;
export type InsertGatewayBillingEvent = typeof gatewayBillingEventsTable.$inferInsert;
