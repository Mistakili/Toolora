import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { emailSubscribersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/subscribe", async (req: Request, res: Response) => {
  const { email, source = "homepage" } = req.body as { email?: string; source?: string };

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email is required." });
    return;
  }

  const normalized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  try {
    const existing = await db
      .select({ id: emailSubscribersTable.id })
      .from(emailSubscribersTable)
      .where(eq(emailSubscribersTable.email, normalized))
      .limit(1);

    if (existing.length > 0) {
      res.status(200).json({ ok: true, alreadySubscribed: true });
      return;
    }

    await db.insert(emailSubscribersTable).values({ email: normalized, source });
    res.status(201).json({ ok: true, alreadySubscribed: false });
  } catch {
    res.status(500).json({ error: "Failed to subscribe. Please try again." });
  }
});

export default router;
