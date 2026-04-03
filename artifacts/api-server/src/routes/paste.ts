import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { pastesTable } from "@workspace/db/schema";
import { eq, and, gt } from "drizzle-orm";

const router: IRouter = Router();

router.post("/", async (req: Request, res: Response) => {
  const { content, title, language, expiresInHours } = req.body as {
    content?: string;
    title?: string;
    language?: string;
    expiresInHours?: number;
  };

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  if (content.length > 500_000) {
    res.status(400).json({ error: "content too large (max 500KB)" });
    return;
  }

  const id = Array.from(crypto.getRandomValues(new Uint8Array(9)))
    .map((b) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[b % 62])
    .join("");

  const hours = typeof expiresInHours === "number" && expiresInHours > 0 ? expiresInHours : 24 * 7;
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

  await db.insert(pastesTable).values({
    id,
    content: content.trim(),
    title: title?.trim() || null,
    language: language?.trim() || null,
    expiresAt,
  });

  res.status(201).json({
    id,
    url: `https://toolora.dev/p/${id}`,
    expiresAt: expiresAt.toISOString(),
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !/^[A-Za-z0-9]{6,12}$/.test(id)) {
    res.status(400).json({ error: "invalid paste id" });
    return;
  }

  const rows = await db
    .select()
    .from(pastesTable)
    .where(
      and(
        eq(pastesTable.id, id),
        gt(pastesTable.expiresAt, new Date())
      )
    )
    .limit(1);

  if (rows.length === 0) {
    res.status(404).json({ error: "paste not found or expired" });
    return;
  }

  res.json(rows[0]);
});

export default router;
