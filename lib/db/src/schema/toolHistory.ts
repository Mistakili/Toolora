import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";

export const toolHistoryTable = pgTable("tool_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  toolSlug: text("tool_slug").notNull(),
  usedAt: timestamp("used_at").notNull().defaultNow(),
});

export const insertToolHistorySchema = createInsertSchema(toolHistoryTable).omit({ id: true, usedAt: true });
export type InsertToolHistory = z.infer<typeof insertToolHistorySchema>;
export type ToolHistory = typeof toolHistoryTable.$inferSelect;
