import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { agentPaymentsTable, pageViewsTable, emailSubscribersTable, toolUsageTable, mcpCallsTable, tooloraUsersTable, mcpListingsTable } from "@workspace/db/schema";
import { desc, sum, count, sql, ne, avg } from "drizzle-orm";
import { isAdminSession } from "../lib/auth";
import { getUncachableStripeClient } from "../stripeClient";
import { randomUUID, timingSafeEqual } from "crypto";
import mcpSeedData from "../data/mcpSeed.json" with { type: "json" };

type SeedRow = {
  name: string; tagline: string; description: string; url: string;
  config_url: string | null; category: string; logo_url: string | null;
  featured: boolean; polar_checkout_id: string;
};
const mcpSeed = mcpSeedData as SeedRow[];

const router: IRouter = Router();

// ─── POST /api/admin/seed-mcp — one-shot directory seeding (token-guarded) ───
router.post("/seed-mcp", async (req: Request, res: Response) => {
  const expected = process.env.MCP_SEED_TOKEN ?? "";
  const provided = String(req.headers["x-seed-token"] ?? "");
  if (!expected || provided.length !== expected.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(provided))) {
    res.status(403).json({ error: "forbidden" });
    return;
  }
  try {
    const rows = mcpSeed.map((l) => ({
      id: randomUUID(),
      name: l.name,
      tagline: l.tagline,
      description: l.description,
      url: l.url,
      configUrl: l.config_url,
      category: l.category,
      logoUrl: l.logo_url,
      featured: l.featured,
      polarCheckoutId: l.polar_checkout_id,
      approved: true,
    }));
    const result = await db
      .insert(mcpListingsTable)
      .values(rows)
      .onConflictDoUpdate({
        target: mcpListingsTable.polarCheckoutId,
        set: {
          name: sql`excluded.name`,
          tagline: sql`excluded.tagline`,
          description: sql`excluded.description`,
          url: sql`excluded.url`,
          configUrl: sql`excluded.config_url`,
          category: sql`excluded.category`,
          featured: sql`excluded.featured`,
          approved: sql`true`,
        },
      })
      .returning({ id: mcpListingsTable.id });
    res.json({ ok: true, upserted: result.length });
  } catch (err) {
    res.status(500).json({ error: "seed_failed", detail: err instanceof Error ? err.message : "unknown" });
  }
});

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
    // Exclude bots AND Replit dev environment (country='Local') from real traffic metrics
    const humanFilter = sql`${pageViewsTable.deviceType} != 'bot'`;
    const externalFilter = sql`${pageViewsTable.deviceType} != 'bot' AND ${pageViewsTable.country} != 'Local'`;
    const thirtyDays = sql`${pageViewsTable.createdAt} >= NOW() - INTERVAL '30 days'`;
    const sevenDays = sql`${pageViewsTable.createdAt} >= NOW() - INTERVAL '7 days'`;

    // ── Summary ──────────────────────────────────────────────────────────────
    const [totalRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays}`);

    const [uniqueSessionRows] = await db
      .select({ unique: sql<number>`COUNT(DISTINCT ${pageViewsTable.sessionId})` })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays} AND ${pageViewsTable.sessionId} IS NOT NULL`);

    const [todayRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND DATE(${pageViewsTable.createdAt}) = CURRENT_DATE`);

    const [weekRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${sevenDays}`);

    const [botRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${pageViewsTable.deviceType} = 'bot' AND ${thirtyDays}`);

    // Dev browsing (Replit preview sessions) — shown separately so you know what's internal
    const [devRows] = await db
      .select({ total: count() })
      .from(pageViewsTable)
      .where(sql`${humanFilter} AND ${thirtyDays} AND ${pageViewsTable.country} = 'Local'`);

    // ── Top pages ─────────────────────────────────────────────────────────────
    const topPages = await db
      .select({ path: pageViewsTable.path, views: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays}`)
      .groupBy(pageViewsTable.path)
      .orderBy(desc(count()))
      .limit(20);

    // ── Devices ───────────────────────────────────────────────────────────────
    const byDevice = await db
      .select({ deviceType: pageViewsTable.deviceType, views: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays}`)
      .groupBy(pageViewsTable.deviceType)
      .orderBy(desc(count()));

    // ── Browsers ──────────────────────────────────────────────────────────────
    const byBrowser = await db
      .select({ browser: pageViewsTable.browser, views: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays}`)
      .groupBy(pageViewsTable.browser)
      .orderBy(desc(count()))
      .limit(8);

    // ── OS ────────────────────────────────────────────────────────────────────
    const byOS = await db
      .select({ os: pageViewsTable.os, views: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays}`)
      .groupBy(pageViewsTable.os)
      .orderBy(desc(count()))
      .limit(8);

    // ── Countries ─────────────────────────────────────────────────────────────
    const byCountry = await db
      .select({ country: pageViewsTable.country, views: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays} AND ${pageViewsTable.country} IS NOT NULL AND ${pageViewsTable.country} NOT IN ('Unknown', 'Local')`)
      .groupBy(pageViewsTable.country)
      .orderBy(desc(count()))
      .limit(15);

    // ── Cities ────────────────────────────────────────────────────────────────
    const byCities = await db
      .select({ city: pageViewsTable.city, country: pageViewsTable.country, views: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays} AND ${pageViewsTable.city} IS NOT NULL AND ${pageViewsTable.city} NOT IN ('Unknown', 'Dev')`)
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
      .where(sql`${externalFilter} AND ${thirtyDays}`)
      .groupBy(sql`DATE(${pageViewsTable.createdAt})`)
      .orderBy(sql`DATE(${pageViewsTable.createdAt})`);

    // ── Hourly distribution (all time) ────────────────────────────────────────
    const hourlyDist = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${pageViewsTable.createdAt})::int`.as("hour"),
        views: count(),
      })
      .from(pageViewsTable)
      .where(externalFilter)
      .groupBy(sql`EXTRACT(HOUR FROM ${pageViewsTable.createdAt})::int`)
      .orderBy(sql`EXTRACT(HOUR FROM ${pageViewsTable.createdAt})::int`);

    // ── Referrers ─────────────────────────────────────────────────────────────
    const byReferrer = await db
      .select({ referrer: pageViewsTable.referrer, views: count() })
      .from(pageViewsTable)
      .where(sql`${externalFilter} AND ${thirtyDays} AND ${pageViewsTable.referrer} IS NOT NULL AND ${pageViewsTable.referrer} != ''`)
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
        devViews30d: Number(devRows?.total ?? 0),
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

// ─── GET /api/admin/mcp — MCP call stats ─────────────────────────────────────

router.get("/mcp", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  try {
    const sevenDays = sql`${mcpCallsTable.createdAt} >= NOW() - INTERVAL '7 days'`;

    const isRealTool = sql`${mcpCallsTable.tool} NOT IN ('_connect', '_list')`;

    const [totalRow] = await db
      .select({
        total: count(),
        successes: sql<number>`SUM(CASE WHEN ${mcpCallsTable.success} THEN 1 ELSE 0 END)`,
        connections: sql<number>`SUM(CASE WHEN ${mcpCallsTable.tool} = '_connect' THEN 1 ELSE 0 END)`,
        discoveries: sql<number>`SUM(CASE WHEN ${mcpCallsTable.tool} = '_list' THEN 1 ELSE 0 END)`,
        toolCalls: sql<number>`SUM(CASE WHEN ${mcpCallsTable.tool} NOT IN ('_connect','_list') THEN 1 ELSE 0 END)`,
      })
      .from(mcpCallsTable);

    const byTool = await db
      .select({
        tool: mcpCallsTable.tool,
        calls: count(),
        errors: sql<number>`SUM(CASE WHEN NOT ${mcpCallsTable.success} THEN 1 ELSE 0 END)`,
        avgMs: avg(mcpCallsTable.durationMs),
      })
      .from(mcpCallsTable)
      .where(isRealTool)
      .groupBy(mcpCallsTable.tool)
      .orderBy(desc(count()));

    const daily = await db
      .select({
        day: sql<string>`DATE(${mcpCallsTable.createdAt})`.as("day"),
        connections: sql<number>`SUM(CASE WHEN ${mcpCallsTable.tool} = '_connect' THEN 1 ELSE 0 END)`,
        toolCalls: sql<number>`SUM(CASE WHEN ${mcpCallsTable.tool} NOT IN ('_connect','_list') THEN 1 ELSE 0 END)`,
      })
      .from(mcpCallsTable)
      .where(sevenDays)
      .groupBy(sql`DATE(${mcpCallsTable.createdAt})`)
      .orderBy(sql`DATE(${mcpCallsTable.createdAt})`);

    // Only surface errors from the last 24 hours so stale validation/QA noise
    // ages out automatically and the panel reflects what's actually broken now.
    const recentErrors = await db
      .select({
        tool: mcpCallsTable.tool,
        errorMsg: mcpCallsTable.errorMsg,
        createdAt: mcpCallsTable.createdAt,
      })
      .from(mcpCallsTable)
      .where(sql`NOT ${mcpCallsTable.success} AND ${isRealTool} AND ${mcpCallsTable.createdAt} >= NOW() - INTERVAL '24 hours'`)
      .orderBy(desc(mcpCallsTable.createdAt))
      .limit(10);

    res.json({
      summary: {
        totalCalls: Number(totalRow?.toolCalls ?? 0),
        successCalls: Number(totalRow?.successes ?? 0) - Number(totalRow?.connections ?? 0) - Number(totalRow?.discoveries ?? 0),
        errorCalls: 0,
        connections: Number(totalRow?.connections ?? 0),
        discoveries: Number(totalRow?.discoveries ?? 0),
      },
      byTool: byTool.map((r) => ({
        tool: r.tool,
        calls: Number(r.calls),
        errors: Number(r.errors ?? 0),
        avgMs: r.avgMs ? Math.round(Number(r.avgMs)) : null,
      })),
      daily: daily.map((d) => ({ day: d.day, connections: Number(d.connections ?? 0), toolCalls: Number(d.toolCalls ?? 0) })),
      recentErrors: recentErrors.map((e) => ({
        tool: e.tool,
        errorMsg: e.errorMsg,
        createdAt: e.createdAt,
      })),
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Admin MCP query failed");
    res.status(500).json({ error: "Could not fetch MCP stats" });
  }
});

// ─── GET /api/admin/stripe — revenue & subscription stats ────────────────────

router.get("/stripe", async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  try {
    const tierRows = await db
      .select({ tier: tooloraUsersTable.tier, count: count() })
      .from(tooloraUsersTable)
      .groupBy(tooloraUsersTable.tier);

    const [creditsRow] = await db
      .select({
        totalCredits: sum(tooloraUsersTable.creditsBalance),
        usersWithCredits: sql<number>`SUM(CASE WHEN ${tooloraUsersTable.creditsBalance} > 0 THEN 1 ELSE 0 END)`,
      })
      .from(tooloraUsersTable);

    const [totalUsersRow] = await db.select({ total: count() }).from(tooloraUsersTable);

    let recentPayments: { id: string; amount: number; currency: string; status: string; description: string | null; created: number }[] = [];
    let totalRevenueCents = 0;
    let stripeAvailable = false;

    try {
      const stripe = await getUncachableStripeClient();
      const charges = await stripe.charges.list({ limit: 50 });
      recentPayments = charges.data.map((c) => ({
        id: c.id,
        amount: c.amount,
        currency: c.currency,
        status: c.status,
        description: c.description,
        created: c.created,
      }));
      totalRevenueCents = charges.data
        .filter((c) => c.status === "succeeded")
        .reduce((acc, c) => acc + c.amount, 0);
      stripeAvailable = true;
    } catch {
      stripeAvailable = false;
    }

    res.json({
      users: {
        total: Number(totalUsersRow?.total ?? 0),
        byTier: tierRows.map((r) => ({ tier: r.tier, count: Number(r.count) })),
        totalCreditsOutstanding: Number(creditsRow?.totalCredits ?? 0),
        usersWithCredits: Number(creditsRow?.usersWithCredits ?? 0),
      },
      stripe: {
        available: stripeAvailable,
        totalRevenueCents,
        recentPayments,
      },
    });
  } catch (err: unknown) {
    req.log.error({ err }, "Admin stripe query failed");
    res.status(500).json({ error: "Could not fetch Stripe stats" });
  }
});

export default router;
