import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const mcpListingEventsTable = pgTable(
  "mcp_listing_events",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    listingId: text("listing_id").notNull(),
    kind: text("kind").notNull(),
    ipHash: text("ip_hash"),
    referer: text("referer"),
    ua: text("ua"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    byListing: index("mcp_listing_events_listing_idx").on(t.listingId),
    byCreated: index("mcp_listing_events_created_idx").on(t.createdAt),
  }),
);

export type McpListingEvent = typeof mcpListingEventsTable.$inferSelect;
export type InsertMcpListingEvent = typeof mcpListingEventsTable.$inferInsert;
