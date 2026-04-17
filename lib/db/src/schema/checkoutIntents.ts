import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const checkoutIntentsTable = pgTable("checkout_intents", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  reference: text("reference").notNull().unique(),
  kind: text("kind").notNull(),
  amountUsd: integer("amount_usd").notNull(),
  metadata: jsonb("metadata").$type<Record<string, string>>().notNull().default({}),
  buyerEmail: text("buyer_email"),
  status: text("status").notNull().default("pending"),
  txSignature: text("tx_signature"),
  fulfilledRowId: text("fulfilled_row_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
});

export type CheckoutIntent = typeof checkoutIntentsTable.$inferSelect;
export type InsertCheckoutIntent = typeof checkoutIntentsTable.$inferInsert;
