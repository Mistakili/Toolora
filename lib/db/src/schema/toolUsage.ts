import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const toolUsageTable = pgTable("tool_usage", {
  slug: text("slug").primaryKey(),
  usageCount: integer("usage_count").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertToolUsageSchema = createInsertSchema(toolUsageTable).omit({
  updatedAt: true,
});
export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;
export type ToolUsage = typeof toolUsageTable.$inferSelect;
