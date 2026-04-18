import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { emailSubscribersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/unsubscribe", async (req: Request, res: Response) => {
  const token = String(req.query.t ?? "").slice(0, 128);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (!token) {
    res.status(400).send(unsubHtml("Missing unsubscribe token.", false));
    return;
  }
  try {
    const found = await db
      .select({ id: emailSubscribersTable.id, email: emailSubscribersTable.email, unsubscribedAt: emailSubscribersTable.unsubscribedAt })
      .from(emailSubscribersTable)
      .where(eq(emailSubscribersTable.unsubToken, token))
      .limit(1);
    if (found.length === 0) {
      res.status(404).send(unsubHtml("This unsubscribe link is no longer valid.", false));
      return;
    }
    if (!found[0].unsubscribedAt) {
      await db.update(emailSubscribersTable).set({ unsubscribedAt: new Date() }).where(eq(emailSubscribersTable.id, found[0].id));
    }
    res.status(200).send(unsubHtml(`You're unsubscribed. ${found[0].email} won't receive any more email from Toolora.`, true));
  } catch {
    res.status(500).send(unsubHtml("Something went wrong. Please email hello@toolora.dev to unsubscribe.", false));
  }
});

function unsubHtml(message: string, ok: boolean): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe — Toolora</title><style>body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#09090b;color:#e4e4e7;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}main{max-width:480px;text-align:center}h1{font-size:1.25rem;margin:0 0 12px;color:${ok ? "#10b981" : "#f59e0b"}}p{color:#a1a1aa;line-height:1.6;margin:0 0 24px}a{color:#a78bfa;text-decoration:none}a:hover{text-decoration:underline}</style></head><body><main><h1>${ok ? "Unsubscribed" : "Unsubscribe"}</h1><p>${message}</p><a href="https://toolora.dev">← Back to toolora.dev</a></main></body></html>`;
}

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
