import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import { db, apiKeysTable, apiUsageTable, tooloraUsersTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";

export const TIER_LIMITS: Record<string, number> = {
  free: 50,
  pro: 5000,
  team: 50000,
};

export function hashKey(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const bytes = crypto.randomBytes(32).toString("hex");
  const raw = `sk_toolora_${bytes}`;
  const prefix = raw.slice(0, 18);
  const hash = hashKey(raw);
  return { raw, hash, prefix };
}

export async function getMonthlyUsage(apiKeyId: string): Promise<number> {
  const monthYear = new Date().toISOString().slice(0, 7);
  const rows = await db
    .select({ total: sql<number>`COALESCE(SUM(${apiUsageTable.callCount}), 0)` })
    .from(apiUsageTable)
    .where(and(eq(apiUsageTable.apiKeyId, apiKeyId), eq(apiUsageTable.monthYear, monthYear)));
  return Number(rows[0]?.total ?? 0);
}

export async function incrementUsage(apiKeyId: string, userId: string, endpoint: string): Promise<void> {
  const monthYear = new Date().toISOString().slice(0, 7);
  await db.execute(
    sql`INSERT INTO api_usage (api_key_id, user_id, endpoint, month_year, call_count)
        VALUES (${apiKeyId}, ${userId}, ${endpoint}, ${monthYear}, 1)
        ON CONFLICT (api_key_id, endpoint, month_year)
        DO UPDATE SET call_count = api_usage.call_count + 1`
  );
  await db
    .update(apiKeysTable)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeysTable.id, apiKeyId));
}

declare global {
  namespace Express {
    interface Request {
      apiKey?: { id: string; userId: string; tier: string };
    }
  }
}

export async function requireApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers["authorization"];
  const rawKey = authHeader?.startsWith("Bearer sk_toolora_") ? authHeader.slice(7) : null;

  if (!rawKey) {
    res.status(401).json({
      error: "Missing API key. Add Authorization: Bearer sk_toolora_... header.",
      docs: "https://toolora.replit.app/api-keys",
    });
    return;
  }

  const hash = hashKey(rawKey);
  const [keyRow] = await db
    .select({
      id: apiKeysTable.id,
      userId: apiKeysTable.userId,
      revoked: apiKeysTable.revoked,
      tier: tooloraUsersTable.tier,
    })
    .from(apiKeysTable)
    .leftJoin(tooloraUsersTable, eq(apiKeysTable.userId, tooloraUsersTable.id))
    .where(eq(apiKeysTable.keyHash, hash));

  if (!keyRow || keyRow.revoked) {
    res.status(401).json({ error: "Invalid or revoked API key." });
    return;
  }

  const tier = keyRow.tier ?? "free";
  const limit = TIER_LIMITS[tier] ?? TIER_LIMITS.free;
  const used = await getMonthlyUsage(keyRow.id);

  if (used >= limit) {
    res.status(429).json({
      error: `Monthly limit reached (${used}/${limit} calls). Upgrade your plan.`,
      tier,
      used,
      limit,
      upgrade: "https://toolora.replit.app/pricing",
    });
    return;
  }

  req.apiKey = { id: keyRow.id, userId: keyRow.userId!, tier };
  next();
}

export async function logApiKeyUsage(req: Request, endpoint: string): Promise<void> {
  if (req.apiKey) {
    await incrementUsage(req.apiKey.id, req.apiKey.userId, endpoint).catch(() => {});
  }
}
