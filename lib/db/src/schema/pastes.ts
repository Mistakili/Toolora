import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const pastesTable = pgTable("pastes", {
  id: varchar("id", { length: 12 }).primaryKey(),
  content: text("content").notNull(),
  title: text("title"),
  language: varchar("language", { length: 32 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export type Paste = typeof pastesTable.$inferSelect;
export type InsertPaste = typeof pastesTable.$inferInsert;
