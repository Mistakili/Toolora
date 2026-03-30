import { pgTable, bigserial, text, integer } from "drizzle-orm/pg-core";
import { apiKeysTable } from "./apiKeys";
import { tooloraUsersTable } from "./tooloraUsers";

export const apiUsageTable = pgTable("api_usage", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  apiKeyId: text("api_key_id").references(() => apiKeysTable.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => tooloraUsersTable.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  monthYear: text("month_year").notNull(),
  callCount: integer("call_count").notNull().default(0),
});

export type ApiUsage = typeof apiUsageTable.$inferSelect;
export type InsertApiUsage = typeof apiUsageTable.$inferInsert;
