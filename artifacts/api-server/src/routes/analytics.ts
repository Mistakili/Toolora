import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { pageViewsTable } from "@workspace/db/schema";

const router: IRouter = Router();

// ─── UA Detection ─────────────────────────────────────────────────────────────

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" | "bot" {
  const u = ua.toLowerCase();
  if (/bot|crawler|spider|facebookexternalhit|slurp|bingbot|googlebot|yahoo|semrush|ahref/i.test(u)) return "bot";
  if (/tablet|ipad|kindle|silk|playbook/i.test(u)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|windows phone|opera mini|iemobile/i.test(u)) return "mobile";
  return "desktop";
}

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua)) return "Opera";
  if (/chrome\//i.test(ua) && !/chromium/i.test(ua)) return "Chrome";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/safari\//i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/msie|trident/i.test(ua)) return "IE";
  if (/chromium/i.test(ua)) return "Chromium";
  return "Other";
}

function detectOS(ua: string): string {
  if (/windows nt/i.test(ua)) return "Windows";
  if (/macintosh|mac os x/i.test(ua)) return "macOS";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/linux/i.test(ua)) return "Linux";
  if (/cros/i.test(ua)) return "ChromeOS";
  return "Other";
}

// ─── IP Geolocation ───────────────────────────────────────────────────────────

const geoCache = new Map<string, { country: string; city: string; ts: number }>();
const GEO_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function geolocate(ip: string): Promise<{ country: string; city: string }> {
  if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return { country: "Local", city: "Dev" };
  }

  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.ts < GEO_TTL_MS) {
    return { country: cached.country, city: cached.city };
  }

  try {
    const res = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`ipwho.is ${res.status}`);
    const data = await res.json() as Record<string, unknown>;
    const country = (data.country as string) || "Unknown";
    const city = (data.city as string) || "Unknown";
    geoCache.set(ip, { country, city, ts: Date.now() });
    return { country, city };
  } catch {
    return { country: "Unknown", city: "Unknown" };
  }
}

function getRealIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return first.trim();
  }
  return req.socket?.remoteAddress ?? req.ip ?? "";
}

// ─── POST /api/analytics/track ───────────────────────────────────────────────

router.post("/track", async (req: Request, res: Response) => {
  const { path, referrer, sessionId } = req.body as {
    path?: string;
    referrer?: string;
    sessionId?: string;
  };

  if (!path || typeof path !== "string") {
    res.status(400).json({ error: "path required" });
    return;
  }

  const ua = req.headers["user-agent"] ?? "";
  const ip = getRealIp(req);

  // Fire-and-forget — don't block the response
  res.status(204).end();

  try {
    const [deviceType, browser, os, geo] = await Promise.all([
      Promise.resolve(detectDevice(ua)),
      Promise.resolve(detectBrowser(ua)),
      Promise.resolve(detectOS(ua)),
      geolocate(ip),
    ]);

    await db.insert(pageViewsTable).values({
      sessionId: sessionId ?? null,
      path: path.slice(0, 500),
      referrer: referrer ? referrer.slice(0, 500) : null,
      country: geo.country,
      city: geo.city,
      deviceType,
      browser,
      os,
      userAgent: ua.slice(0, 1000),
    });
  } catch {
    // Silently ignore tracking errors — never crash the client
  }
});

export default router;
