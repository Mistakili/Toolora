import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { agentPaymentsTable } from "@workspace/db/schema";
import { desc, sum, count, sql } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/admin/stats — requires authentication
router.get("/stats", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized. Sign in to view admin stats." });
    return;
  }

  try {
    // Per-endpoint aggregates
    const byEndpoint = await db
      .select({
        endpoint: agentPaymentsTable.endpoint,
        calls: count(),
        totalXlm: sum(agentPaymentsTable.amountXlm),
      })
      .from(agentPaymentsTable)
      .groupBy(agentPaymentsTable.endpoint)
      .orderBy(desc(count()));

    // Daily revenue for the last 30 days
    const daily = await db
      .select({
        day: sql<string>`DATE(${agentPaymentsTable.createdAt})`.as("day"),
        calls: count(),
        totalXlm: sum(agentPaymentsTable.amountXlm),
      })
      .from(agentPaymentsTable)
      .where(sql`${agentPaymentsTable.createdAt} >= NOW() - INTERVAL '30 days'`)
      .groupBy(sql`DATE(${agentPaymentsTable.createdAt})`)
      .orderBy(sql`DATE(${agentPaymentsTable.createdAt})`);

    // Full recent payments list
    const payments = await db
      .select()
      .from(agentPaymentsTable)
      .orderBy(desc(agentPaymentsTable.createdAt))
      .limit(100);

    const totalCalls = byEndpoint.reduce((a, r) => a + Number(r.calls), 0);
    const totalXlm = byEndpoint.reduce((a, r) => a + parseFloat(r.totalXlm ?? "0"), 0);

    res.json({
      summary: {
        totalCalls,
        totalXlmEarned: totalXlm.toFixed(7),
      },
      byEndpoint: byEndpoint.map((r) => ({
        endpoint: r.endpoint,
        calls: Number(r.calls),
        xlmEarned: parseFloat(r.totalXlm ?? "0").toFixed(7),
      })),
      daily: daily.map((d) => ({
        day: d.day,
        calls: Number(d.calls),
        xlmEarned: parseFloat(d.totalXlm ?? "0"),
      })),
      payments: payments.map((p) => ({
        id: p.id,
        endpoint: p.endpoint,
        txHash: p.txHash,
        fromAddress: p.fromAddress,
        amountXlm: p.amountXlm,
        network: p.network,
        createdAt: p.createdAt,
      })),
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Admin stats query failed");
    res.status(500).json({ error: "Could not fetch admin stats" });
  }
});

export default router;
