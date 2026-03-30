import { pgTable, serial, varchar, timestamp, numeric } from "drizzle-orm/pg-core";

export const agentPaymentsTable = pgTable("agent_payments", {
  id: serial("id").primaryKey(),
  endpoint: varchar("endpoint", { length: 100 }).notNull(),
  txHash: varchar("tx_hash", { length: 100 }).notNull().unique(),
  fromAddress: varchar("from_address", { length: 60 }),
  amountXlm: numeric("amount_xlm", { precision: 18, scale: 7 }),
  network: varchar("network", { length: 30 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AgentPayment = typeof agentPaymentsTable.$inferSelect;
export type InsertAgentPayment = typeof agentPaymentsTable.$inferInsert;
