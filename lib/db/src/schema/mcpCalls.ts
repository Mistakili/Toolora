import { pgTable, serial, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const mcpCallsTable = pgTable(
  "mcp_calls",
  {
    id: serial("id").primaryKey(),
    tool: text("tool").notNull(),
    durationMs: integer("duration_ms"),
    success: boolean("success").notNull().default(true),
    errorMsg: text("error_msg"),
    userAgent: text("user_agent"),
    clientId: text("client_id"),
    clientName: text("client_name"),
    clientVersion: text("client_version"),
    referrer: text("referrer"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("mcp_calls_created_at_idx").on(table.createdAt),
    clientNameIdx: index("mcp_calls_client_name_idx").on(table.clientName),
  }),
);

export type McpCall = typeof mcpCallsTable.$inferSelect;
export type InsertMcpCall = typeof mcpCallsTable.$inferInsert;
