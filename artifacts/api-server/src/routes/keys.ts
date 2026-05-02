import { Router, type IRouter, type Request, type Response } from "express";
import { db, apiKeysTable, apiUsageTable, tooloraUsersTable } from "@workspace/db";
import { eq, and, sql, desc } from "drizzle-orm";
import { generateApiKey, TIER_LIMITS } from "../middlewares/apiKey";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response): boolean {
  if (!req.isAuthenticated?.() || !req.user) {
    res.status(401).json({ error: "Sign in required." });
    return false;
  }
  return true;
}

async function upsertUser(email: string): Promise<string> {
  const existing = await db
    .select({ id: tooloraUsersTable.id })
    .from(tooloraUsersTable)
    .where(eq(tooloraUsersTable.email, email));

  if (existing[0]) return existing[0].id;

  const [row] = await db
    .insert(tooloraUsersTable)
    .values({ email, tier: "free" })
    .returning({ id: tooloraUsersTable.id });
  // id is the table's primary key with a `gen_random_uuid()` default — it can
  // never actually be null at runtime, but the inferred type from drizzle is
  // `string | null`, so assert.
  if (!row.id) throw new Error("upsertUser: returning() yielded no id");
  return row.id;
}

// GET /api/keys — list API keys for the signed-in user
router.get("/", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const email = req.user?.email;
  if (!email) { res.status(401).json({ error: "Authenticated session is missing email." }); return; }

  try {
    const userId = await upsertUser(email);
    const monthYear = new Date().toISOString().slice(0, 7);

    const keys = await db
      .select({
        id: apiKeysTable.id,
        prefix: apiKeysTable.keyPrefix,
        label: apiKeysTable.label,
        createdAt: apiKeysTable.createdAt,
        lastUsedAt: apiKeysTable.lastUsedAt,
        revoked: apiKeysTable.revoked,
      })
      .from(apiKeysTable)
      .where(and(eq(apiKeysTable.userId, userId), eq(apiKeysTable.revoked, false)))
      .orderBy(desc(apiKeysTable.createdAt));

    const usage = await db
      .select({
        apiKeyId: apiUsageTable.apiKeyId,
        total: sql<number>`SUM(${apiUsageTable.callCount})`,
      })
      .from(apiUsageTable)
      .where(eq(apiUsageTable.monthYear, monthYear))
      .groupBy(apiUsageTable.apiKeyId);

    const usageMap: Record<string, number> = Object.fromEntries(
      usage.map((u) => [u.apiKeyId, Number(u.total)]),
    );

    const [userRow] = await db
      .select({ tier: tooloraUsersTable.tier })
      .from(tooloraUsersTable)
      .where(eq(tooloraUsersTable.id, userId));

    const tier = userRow?.tier ?? "free";
    const limit = TIER_LIMITS[tier] ?? TIER_LIMITS.free;
    const totalUsed = Object.values(usageMap).reduce((a, b) => a + b, 0);

    res.json({
      keys: keys.map((k) => ({ ...k, monthlyUsage: usageMap[k.id] ?? 0 })),
      tier,
      limit,
      used: totalUsed,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch keys." });
  }
});

// POST /api/keys — generate a new API key
router.post("/", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const email = req.user?.email;
  if (!email) { res.status(401).json({ error: "Authenticated session is missing email." }); return; }
  const { label } = req.body as { label?: string };

  try {
    const userId = await upsertUser(email);

    const existing = await db
      .select({ id: apiKeysTable.id })
      .from(apiKeysTable)
      .where(and(eq(apiKeysTable.userId, userId), eq(apiKeysTable.revoked, false)));

    if (existing.length >= 5) {
      res.status(400).json({ error: "Maximum 5 active keys per account. Revoke one first." });
      return;
    }

    const { raw, hash, prefix } = generateApiKey();

    await db.insert(apiKeysTable).values({
      userId,
      keyHash: hash,
      keyPrefix: prefix,
      label: label ?? "Default",
    });

    res.json({ key: raw, prefix, label: label ?? "Default", message: "Save this key — it won't be shown again." });
  } catch (err) {
    res.status(500).json({ error: "Failed to create key." });
  }
});

// DELETE /api/keys/:id — revoke a key
router.delete("/:id", async (req: Request, res: Response) => {
  if (!requireAuth(req, res)) return;
  const email = req.user?.email;
  if (!email) { res.status(401).json({ error: "Authenticated session is missing email." }); return; }
  // Express 5 widens req.params[name] to `string | string[]` in its type
  // signature even though querystring values never bleed into req.params at
  // runtime. We still normalize defensively so drizzle's eq() always receives
  // a single string and so the ownership check below has a stable shape.
  const rawId = req.params.id;
  const id = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";
  if (!id) {
    res.status(400).json({ error: "Missing or invalid key id." });
    return;
  }

  try {
    const userId = await upsertUser(email);
    const [key] = await db
      .select({ userId: apiKeysTable.userId })
      .from(apiKeysTable)
      .where(eq(apiKeysTable.id, id));

    if (!key || key.userId !== userId) {
      res.status(404).json({ error: "Key not found." });
      return;
    }

    await db.update(apiKeysTable).set({ revoked: true }).where(eq(apiKeysTable.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to revoke key." });
  }
});

// GET /api/keys/tiers — public: show tier info (no auth required)
router.get("/tiers", (_req: Request, res: Response) => {
  res.json({
    tiers: [
      { id: "free", name: "Free", price: 0, callsPerMonth: TIER_LIMITS.free, features: ["7 MCP tools", "50 API calls/month", "All standard tools"] },
      { id: "pro", name: "Pro", price: 19, callsPerMonth: TIER_LIMITS.pro, features: ["Everything in Free", "5,000 API calls/month", "OCR, DOCX, Excel tools", "Priority support"] },
      { id: "team", name: "Team", price: 79, callsPerMonth: TIER_LIMITS.team, features: ["Everything in Pro", "50,000 API calls/month", "Team usage dashboard", "SLA support"] },
    ],
  });
});

export default router;
