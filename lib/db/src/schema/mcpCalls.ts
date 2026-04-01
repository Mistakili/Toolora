import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const mcpCallsTable = pgTable("mcp_calls", {
  id: serial("id").primaryKey(),
  tool: text("tool").notNull(),
  durationMs: integer("duration_ms"),
  success: boolean("success").notNull().default(true),
  errorMsg: text("error_msg"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type McpCall = typeof mcpCallsTable.$inferSelect;
export type InsertMcpCall = typeof mcpCallsTable.$inferInsert;
