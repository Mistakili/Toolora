import { Router, type IRouter } from "express";
import { db, toolHistoryTable, toolUsageTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/history", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select()
    .from(toolHistoryTable)
    .where(eq(toolHistoryTable.userId, req.user.id))
    .orderBy(desc(toolHistoryTable.usedAt))
    .limit(50);

  res.json({
    history: rows.map((r) => ({
      toolSlug: r.toolSlug,
      usedAt: r.usedAt.toISOString(),
    })),
  });
});

export default router;
