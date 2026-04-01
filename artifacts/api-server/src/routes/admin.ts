import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { agentPaymentsTable, pageViewsTable, emailSubscribersTable, toolUsageTable } from "@workspace/db/schema";
import { desc, sum, count, sql, ne } from "drizzle-orm";
import { isAdminSession } from "../lib/auth";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized. Sign in to view admin data." });
    return false;
  }
  if (!req.sessionData || !isAdminSession(req.sessionData)) {
    res.status(403).json({ error: "Forbidden. Admin access only." });
    return false;
  }
  return true;
}

// ─── GET /api/admin/stats — agent API revenue ────────────────────────────────

router.get("/stats", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  try {
    const byEndpoint = await db
      .select({
        endpoint: agentPaymentsTable.endpoint,
        calls: count(),
        totalXlm: sum(agentPaymentsTable.amountXlm),
      })
      .from(agentPaymentsTable)
      .groupBy(agentPaymentsTable.endpoint)
      .orderBy(desc(count()));

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

    const payments = await db
      .select()
      .from(agentPaymentsTable)
      .orderBy(desc(agentPaymentsTable.createdAt))
      .limit(100);

    const [subscriberRow] = await db
      .select({ total: count() })
      .from(emailSubscribersTable);
    const totalSubscribers = Number(subscriberRow?.total ?? 0);

    const totalCalls = byEndpoint.reduce((a, r) => a + Number(r.calls), 0);
    const totalXlm = byEndpoint.reduce((a, r) => a + parseFloat(r.totalXlm ?? "0"), 0);

    res.json({
      summary: { totalCalls, totalXlmEarned: totalXlm.toFixed(7), totalSubscribers },
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

// ─── GET /api/admin/analytics — site traffic ─────────────────────────────────

router.get("/analytics", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  try {
    // Exclude bots from all human-facing metrics
    const humanFilter = sql`${pageViewsTable.deviceType} != 'bot'`;
    const thirtyDays = sql`${pageViewsTable.createdAt} >= NOW() - INTERVAL '30 days'`;
    const sevenDays = sql`${pageViewsTable.createdAt} >= NOW() - INTERVAL '7 days'`;

    // ── Summary ──────────────────────────────────────────────────────────────
    const [totalRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays}`);

    const [uniqueSessionRows] = await db
      .select({ unique: sql<number>`COUNT(DISTINCT ${pageViewsTable.sessionId})` })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays} AND ${pageViewsTable.sessionId} IS NOT NULL`);

    const [todayRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND DATE(${pageViewsTable.createdAt}) = CURRENT_DATE`);

    const [weekRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${sevenDays}`);

    const [botRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${pageViewsTable.deviceType} = 'bot' AND ${thirtyDays}`);

    // ── Top pages ─────────────────────────────────────────────────────────────
    const topPages = await db
      .select({ path: pageViewsTable.path, views: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays}`)
      .groupBy(pageViewsTable.path)
      .orderBy(desc(count()))
      .limit(20);

    // ── Devices ───────────────────────────────────────────────────────────────
    const byDevice = await db
      .select({ deviceType: pageViewsTable.deviceType, views: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays}`)
      .groupBy(pageViewsTable.deviceType)
      .orderBy(desc(count()));

    // ── Browsers ──────────────────────────────────────────────────────────────
    const byBrowser = await db
      .select({ browser: pageViewsTable.browser, views: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays}`)
      .groupBy(pageViewsTable.browser)
      .orderBy(desc(count()))
      .limit(8);

    // ── OS ────────────────────────────────────────────────────────────────────
    const byOS = await db
      .select({ os: pageViewsTable.os, views: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays}`)
      .groupBy(pageViewsTable.os)
      .orderBy(desc(count()))
      .limit(8);

    // ── Countries ─────────────────────────────────────────────────────────────
    const byCountry = await db
      .select({ country: pageViewsTable.country, views: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays} AND ${pageViewsTable.country} IS NOT NULL AND ${pageViewsTable.country} NOT IN ('Unknown', 'Local')`)
      .groupBy(pageViewsTable.country)
      .orderBy(desc(count()))
      .limit(15);

    // ── Cities ────────────────────────────────────────────────────────────────
    const byCities = await db
      .select({ city: pageViewsTable.city, country: pageViewsTable.country, views: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays} AND ${pageViewsTable.city} IS NOT NULL AND ${pageViewsTable.city} NOT IN ('Unknown', 'Dev')`)
      .groupBy(pageViewsTable.city, pageViewsTable.country)
      .orderBy(desc(count()))
      .limit(10);

    // ── Daily trend (last 30 days) ────────────────────────────────────────────
    const dailyTrend = await db
      .select({
        day: sql<string>`DATE(${pageViewsTable.createdAt})`.as("day"),
        views: count(),
        sessions: sql<number>`COUNT(DISTINCT ${pageViewsTable.sessionId})`,
      })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays}`)
      .groupBy(sql`DATE(${pageViewsTable.createdAt})`)
      .orderBy(sql`DATE(${pageViewsTable.createdAt})`);

    // ── Hourly distribution (all time) ────────────────────────────────────────
    const hourlyDist = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${pageViewsTable.createdAt})::int`.as("hour"),
        views: count(),
      })
      .from(pageViewsTable)
      .where(humanFilter)
      .groupBy(sql`EXTRACT(HOUR FROM ${pageViewsTable.createdAt})::int`)
      .orderBy(sql`EXTRACT(HOUR FROM ${pageViewsTable.createdAt})::int`);

    // ── Referrers ─────────────────────────────────────────────────────────────
    const byReferrer = await db
      .select({ referrer: pageViewsTable.referrer, views: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays} AND ${pageViewsTable.referrer} IS NOT NULL AND ${pageViewsTable.referrer} != ''`)
      .groupBy(pageViewsTable.referrer)
      .orderBy(desc(count()))
      .limit(10);

    res.json({
      summary: {
        totalViews30d: Number(totalRows?.total ?? 0),
        uniqueSessions30d: Number(uniqueSessionRows?.unique ?? 0),
        todayViews: Number(todayRows?.total ?? 0),
        weekViews: Number(weekRows?.total ?? 0),
        botViews30d: Number(botRows?.total ?? 0),
      },
      topPages: topPages.map((r) => ({ path: r.path, views: Number(r.views) })),
      byDevice: byDevice.map((r) => ({ deviceType: r.deviceType ?? "Unknown", views: Number(r.views) })),
      byBrowser: byBrowser.map((r) => ({ browser: r.browser ?? "Unknown", views: Number(r.views) })),
      byOS: byOS.map((r) => ({ os: r.os ?? "Unknown", views: Number(r.views) })),
      byCountry: byCountry.map((r) => ({ country: r.country ?? "Unknown", views: Number(r.views) })),
      byCities: byCities.map((r) => ({ city: r.city ?? "Unknown", country: r.country ?? "", views: Number(r.views) })),
      dailyTrend: dailyTrend.map((d) => ({ day: d.day, views: Number(d.views), sessions: Number(d.sessions) })),
      hourlyDist: hourlyDist.map((h) => ({ hour: Number(h.hour), views: Number(h.views) })),
      byReferrer: byReferrer.map((r) => ({ referrer: r.referrer ?? "", views: Number(r.views) })),
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Admin analytics query failed");
    res.status(500).json({ error: "Could not fetch analytics" });
  }
});

// ─── GET /api/admin/tools — tool usage breakdown ─────────────────────────────

router.get("/tools", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  try {
    const rows = await db
      .select()
      .from(toolUsageTable)
      .orderBy(desc(toolUsageTable.usageCount))
      .limit(30);

    const total = rows.reduce((sum, r) => sum + r.usageCount, 0);

    res.json({
      tools: rows.map((r) => ({
        slug: r.slug,
        usageCount: r.usageCount,
        pct: total > 0 ? Math.round((r.usageCount / total) * 100) : 0,
      })),
      total,
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Admin tools query failed");
    res.status(500).json({ error: "Could not fetch tool usage" });
  }
});

export default router;
