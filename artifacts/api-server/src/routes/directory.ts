import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { mcpListingsTable, sponsorsTable } from "@workspace/db/schema";
import { and, desc, eq, isNull, gt, or } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * Public directory endpoints — explicitly whitelist columns to prevent leaking
 * buyer PII (email, customer name, Polar checkout IDs).
 */
router.get("/listings", async (_req: Request, res: Response): Promise<void> => {
  try {
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
      .where(eq(mcpListingsTable.approved, true))
      .orderBy(desc(mcpListingsTable.featured), desc(mcpListingsTable.createdAt));
    res.json({ listings: rows });
  } catch (err) {
    logger.error({ err }, "[directory] listings query failed");
    res.json({ listings: [] });
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
