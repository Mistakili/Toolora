import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const openapiMcpSpecsTable = pgTable(
  "openapi_mcp_specs",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    specUrl: text("spec_url").notNull(),
    baseUrl: text("base_url").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    parsedSpecJson: jsonb("parsed_spec_json").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    specUrlIdx: index("openapi_specs_url_idx").on(t.specUrl),
  }),
);

export type OpenapiMcpSpec = typeof openapiMcpSpecsTable.$inferSelect;
export type InsertOpenapiMcpSpec = typeof openapiMcpSpecsTable.$inferInsert;
