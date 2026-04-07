import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { toolUsageTable, toolHistoryTable } from "@workspace/db/schema";
import { TrackToolUsageParams, TrackToolUsageResponse, GetPopularToolsResponse } from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

let popularCache: { data: unknown; expiresAt: number } | null = null;
const POPULAR_CACHE_TTL_MS = 5 * 60 * 1000;

router.get("/popular", async (req, res) => {
  try {
    const now = Date.now();
    if (popularCache && now < popularCache.expiresAt) {
      res.setHeader("X-Cache", "HIT");
      res.json(popularCache.data);
      return;
    }

    const rows = await db
      .select()
      .from(toolUsageTable)
      .orderBy(desc(toolUsageTable.usageCount))
      .limit(10);

    const data = GetPopularToolsResponse.parse({
      tools: rows.map((r) => ({ slug: r.slug, usageCount: r.usageCount })),
    });

    popularCache = { data, expiresAt: now + POPULAR_CACHE_TTL_MS };
    res.setHeader("X-Cache", "MISS");
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch popular tools");
    // Return empty list instead of 500 so the frontend keeps working
    const fallback = GetPopularToolsResponse.parse({ tools: [] });
    res.setHeader("X-Cache", "FALLBACK");
    res.json(fallback);
  }
});

router.post("/:slug/use", async (req, res) => {
  const { slug } = TrackToolUsageParams.parse(req.params);

  try {
    const existing = await db
      .select()
      .from(toolUsageTable)
      .where(eq(toolUsageTable.slug, slug))
      .limit(1);

    let usageCount: number;

    if (existing.length === 0) {
      const inserted = await db
        .insert(toolUsageTable)
        .values({ slug, usageCount: 1 })
        .returning();
      usageCount = inserted[0].usageCount;
    } else {
      const updated = await db
        .update(toolUsageTable)
        .set({
          usageCount: existing[0].usageCount + 1,
          updatedAt: new Date(),
        })
        .where(eq(toolUsageTable.slug, slug))
        .returning();
      usageCount = updated[0].usageCount;
    }

    // Record per-user history if authenticated
    if (req.isAuthenticated()) {
      await db.insert(toolHistoryTable).values({
        userId: req.user.id,
        toolSlug: slug,
      });
    }

    const data = TrackToolUsageResponse.parse({ success: true, usageCount });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to track tool usage");
    // Non-critical — return success anyway so the tool still works
    const fallback = TrackToolUsageResponse.parse({ success: true, usageCount: 0 });
    res.json(fallback);
  }
});

export default router;
