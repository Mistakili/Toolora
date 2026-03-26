import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { toolUsageTable, toolHistoryTable } from "@workspace/db/schema";
import { TrackToolUsageParams, TrackToolUsageResponse, GetPopularToolsResponse } from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/popular", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(toolUsageTable)
      .orderBy(desc(toolUsageTable.usageCount))
      .limit(10);

    const data = GetPopularToolsResponse.parse({
      tools: rows.map((r) => ({ slug: r.slug, usageCount: r.usageCount })),
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch popular tools");
    res.status(500).json({ error: "Internal server error" });
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
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
