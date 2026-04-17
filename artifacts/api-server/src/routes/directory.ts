import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { mcpListingsTable, sponsorsTable } from "@workspace/db/schema";
import { and, desc, eq, isNull, gt, or, ilike, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * Public directory endpoints — explicitly whitelist columns to prevent leaking
 * buyer PII. Supports ?q= search and ?category= filter.
 */
router.get("/listings", async (req: Request, res: Response): Promise<void> => {
  try {
    const q = String(req.query.q ?? "").slice(0, 80).trim();
    const category = String(req.query.category ?? "").slice(0, 40).trim();

    const conds = [eq(mcpListingsTable.approved, true)];
    if (category && category !== "All") conds.push(eq(mcpListingsTable.category, category));
    if (q) {
      const pattern = "%" + q.replace(/[%_]/g, "\\$&") + "%";
      const search = or(
        ilike(mcpListingsTable.name, pattern),
        ilike(mcpListingsTable.tagline, pattern),
        ilike(mcpListingsTable.description, pattern),
      );
      if (search) conds.push(search);
    }

    const rows = await db
      .select({
        id: mcpListingsTable.id,
        name: mcpListingsTable.name,
        tagline: mcpListingsTable.tagline,
        description: mcpListingsTable.description,
        url: mcpListingsTable.url,
        configUrl: mcpListingsTable.configUrl,
        category: mcpListingsTable.category,
        logoUrl: mcpListingsTable.logoUrl,
        featured: mcpListingsTable.featured,
        createdAt: mcpListingsTable.createdAt,
      })
      .from(mcpListingsTable)
      .where(and(...conds))
      .orderBy(desc(mcpListingsTable.featured), desc(mcpListingsTable.createdAt))
      .limit(200);

    // Aggregate counts per category for filter chips (always over the whole approved set).
    const cats = await db
      .select({ category: mcpListingsTable.category, count: sql<number>`count(*)::int` })
      .from(mcpListingsTable)
      .where(eq(mcpListingsTable.approved, true))
      .groupBy(mcpListingsTable.category);

    res.json({ listings: rows, categories: cats, total: rows.length });
  } catch (err) {
    logger.error({ err }, "[directory] listings query failed");
    res.json({ listings: [], categories: [], total: 0 });
  }
});

router.get("/sponsors", async (_req: Request, res: Response): Promise<void> => {
  try {
    const rows = await db
      .select({
        id: sponsorsTable.id,
        kind: sponsorsTable.kind,
        text: sponsorsTable.text,
        url: sponsorsTable.url,
        startsAt: sponsorsTable.startsAt,
        expiresAt: sponsorsTable.expiresAt,
      })
      .from(sponsorsTable)
      .where(
        and(
          eq(sponsorsTable.active, true),
          or(isNull(sponsorsTable.expiresAt), gt(sponsorsTable.expiresAt, new Date()))
        )
      )
      .orderBy(desc(sponsorsTable.createdAt));
    res.json({ sponsors: rows });
  } catch (err) {
    logger.error({ err }, "[directory] sponsors query failed");
    res.json({ sponsors: [] });
  }
});

export default router;
