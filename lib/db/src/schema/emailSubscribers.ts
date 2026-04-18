import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const emailSubscribersTable = pgTable("email_subscribers", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("homepage"),
  unsubToken: text("unsub_token").notNull().default(sql`gen_random_uuid()`),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type EmailSubscriber = typeof emailSubscribersTable.$inferSelect;
export type InsertEmailSubscriber = typeof emailSubscribersTable.$inferInsert;
