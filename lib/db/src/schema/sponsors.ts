import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const sponsorsTable = pgTable("sponsors", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  kind: text("kind").notNull(),
  text: text("text").notNull(),
  url: text("url"),
  buyerEmail: text("buyer_email"),
  buyerName: text("buyer_name"),
  amountUsd: integer("amount_usd"),
  polarCheckoutId: text("polar_checkout_id").unique(),
  active: boolean("active").notNull().default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type Sponsor = typeof sponsorsTable.$inferSelect;
export type InsertSponsor = typeof sponsorsTable.$inferInsert;

export const mcpListingsTable = pgTable("mcp_listings", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  configUrl: text("config_url"),
  category: text("category").notNull().default("Other"),
  logoUrl: text("logo_url"),
  featured: boolean("featured").notNull().default(false),
  featuredUntil: timestamp("featured_until", { withTimezone: true }),
  buyerEmail: text("buyer_email"),
  polarCheckoutId: text("polar_checkout_id").unique(),
  approved: boolean("approved").notNull().default(true),
  verifiedGithubOwner: text("verified_github_owner"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type McpListing = typeof mcpListingsTable.$inferSelect;
export type InsertMcpListing = typeof mcpListingsTable.$inferInsert;
