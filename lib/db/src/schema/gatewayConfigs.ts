import { pgTable, text, integer, boolean, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { mcpListingsTable } from "./sponsors";

export const gatewayConfigsTable = pgTable(
  "gateway_configs",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    listingId: text("listing_id")
      .notNull()
      .references(() => mcpListingsTable.id, { onDelete: "cascade" }),
    enabled: boolean("enabled").notNull().default(false),
    pricePerCallUsdcMicros: integer("price_per_call_usdc_micros").notNull(),
    payoutWalletAddress: text("payout_wallet_address").notNull(),
    payoutNetwork: text("payout_network").notNull().default("solana"),
    upstreamMcpUrl: text("upstream_mcp_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    listingIdx: uniqueIndex("gw_configs_listing_idx").on(t.listingId),
    enabledIdx: index("gw_configs_enabled_idx").on(t.enabled),
  }),
);

export type GatewayConfig = typeof gatewayConfigsTable.$inferSelect;
export type InsertGatewayConfig = typeof gatewayConfigsTable.$inferInsert;
