import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const memoriesTable = pgTable("memories", {
  key: varchar("key", { length: 255 }).primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type Memory = typeof memoriesTable.$inferSelect;
export type InsertMemory = typeof memoriesTable.$inferInsert;
