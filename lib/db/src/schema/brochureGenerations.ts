import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const brochureGenerationsTable = pgTable("brochure_generations", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token"),
  isFree: boolean("is_free").notNull().default(false),
  success: boolean("success").notNull().default(true),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type BrochureGeneration = typeof brochureGenerationsTable.$inferSelect;
export type InsertBrochureGeneration = typeof brochureGenerationsTable.$inferInsert;
