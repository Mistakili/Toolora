import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { pageViewsTable } from "@workspace/db/schema";

const router: IRouter = Router();

// ─── UA Detection ─────────────────────────────────────────────────────────────

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" | "bot" {
  const u = ua.toLowerCase();
  if (/bot|crawler|spider|facebookexternalhit|slurp|bingbot|googlebot|yahoo|semrush|ahref|headlesschrome|headless|phantom|prerender|wget|curl|python-requests|go-http-client|java\/|okhttp/i.test(u)) return "bot";
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

function isPrivateIp(ip: string): boolean {
  return !ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("10.") ||
    ip.startsWith("192.168.") || ip.startsWith("172.16.") || ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") || ip.startsWith("172.19.") || ip.startsWith("172.2") ||
    ip.startsWith("172.30.") || ip.startsWith("172.31.") || ip === "::ffff:127.0.0.1";
}

async function geolocate(ip: string, cfCountry?: string): Promise<{ country: string; city: string }> {
  if (isPrivateIp(ip)) {
    return { country: "Local", city: "Dev" };
  }

  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.ts < GEO_TTL_MS) {
    return { country: cached.country, city: cached.city };
  }

  // 1. Try ip-api.com (most reliable free API, 45 req/min)
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json() as Record<string, unknown>;
      if (data.status === "success") {
        const country = (data.country as string) || cfCountry || "Unknown";
        const city = (data.city as string) || "Unknown";
        geoCache.set(ip, { country, city, ts: Date.now() });
        return { country, city };
      }
    }
  } catch { /* fall through */ }

  // 2. Try ipwho.is as fallback
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json() as Record<string, unknown>;
      if (data.success === true || data.ip) {
        const country = (data.country as string) || cfCountry || "Unknown";
        const city = (data.city as string) || "Unknown";
        geoCache.set(ip, { country, city, ts: Date.now() });
        return { country, city };
      }
    }
  } catch { /* fall through */ }

  // 3. If Cloudflare gave us a country code, use that with Unknown city
  if (cfCountry && cfCountry !== "XX") {
    const result = { country: cfCountry, city: "Unknown" };
    geoCache.set(ip, { ...result, ts: Date.now() });
    return result;
  }

  return { country: "Unknown", city: "Unknown" };
}

function getRealIp(req: Request): string {
  // Replit/Cloudflare puts the real client IP in x-forwarded-for
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ips = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
      .split(",")
      .map(s => s.trim())
      .filter(s => s && !isPrivateIp(s));
    if (ips.length > 0) return ips[0];
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
  // Cloudflare injects this header with the 2-letter country code (e.g. "US", "NG")
  const cfCountry = (req.headers["cf-ipcountry"] as string | undefined) ?? undefined;

  // Fire-and-forget — don't block the response
  res.status(204).end();

  try {
    const [deviceType, browser, os, geo] = await Promise.all([
      Promise.resolve(detectDevice(ua)),
      Promise.resolve(detectBrowser(ua)),
      Promise.resolve(detectOS(ua)),
      geolocate(ip, cfCountry),
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
