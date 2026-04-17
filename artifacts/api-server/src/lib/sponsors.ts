import { db } from "@workspace/db";
import { sponsorsTable } from "@workspace/db/schema";
import { and, eq, or, isNull, gt } from "drizzle-orm";
import { logger } from "./logger";

export interface Sponsor {
  id: string;
  active: boolean;
  text: string;
  url?: string;
}

// Default house sponsors — used when DB is empty or unreachable.
// New paid sponsors are added via Polar webhook, no code edits needed.
export const HOUSE_SPONSORS: Sponsor[] = [
  {
    id: "house-pro",
    active: true,
    text: "Toolora Pro · Unlimited MCP for AI agents · $19/mo at toolora.dev/pricing",
  },
  {
    id: "house-private",
    active: true,
    text: "Toolora Private · Pay-per-call private tool execution on MagicBlock PER · toolora.dev/private",
  },
  {
    id: "house-mcp-hub",
    active: true,
    text: "Discover 35+ MCP tools at toolora.dev/mcp-hub · One config for Claude, Cursor, ChatGPT",
  },
  {
    id: "slot-available-1",
    active: true,
    text: "Sponsor slot available — reach 50,000+ AI agent impressions/mo · toolora.dev/sponsor",
  },
];

let _cache: { sponsors: Sponsor[]; expires: number; version: number } = { sponsors: [], expires: 0, version: 0 };
let _index = 0;
let _inFlight: Promise<Sponsor[]> | null = null;
const CACHE_MS = 60_000; // 1 minute

async function loadActiveSponsors(): Promise<Sponsor[]> {
  const now = Date.now();
  if (_cache.expires > now && _cache.sponsors.length > 0) return _cache.sponsors;
  // Coalesce concurrent loads so we don't fire N parallel queries.
  if (_inFlight) return _inFlight;
  const startedVersion = _cache.version;
  _inFlight = (async () => {
    try {
      const rows = await db
        .select({ id: sponsorsTable.id, text: sponsorsTable.text, url: sponsorsTable.url })
        .from(sponsorsTable)
        .where(
          and(
            eq(sponsorsTable.active, true),
            or(isNull(sponsorsTable.expiresAt), gt(sponsorsTable.expiresAt, new Date()))
          )
        );
      const paid = rows.map((r) => ({ id: r.id, active: true, text: r.text, url: r.url ?? undefined }));
      const merged = paid.length >= 4 ? paid : [...paid, ...HOUSE_SPONSORS];
      // Only commit if no invalidation arrived while we were in flight.
      if (_cache.version === startedVersion) {
        _cache = { sponsors: merged, expires: Date.now() + CACHE_MS, version: startedVersion };
      }
      return merged;
    } catch (err) {
      logger.warn({ err }, "[sponsors] DB unreachable, using house defaults");
      return HOUSE_SPONSORS;
    } finally {
      _inFlight = null;
    }
  })();
  return _inFlight;
}

// Sync version for the hot path — uses last known cache or house defaults,
// and refreshes in the background. Never blocks an MCP response.
export function getRotatingSponsorLine(): string {
  const list = _cache.sponsors.length > 0 ? _cache.sponsors : HOUSE_SPONSORS;
  if (Date.now() > _cache.expires) {
    void loadActiveSponsors().catch(() => {});
  }
  const sponsor = list[_index % list.length];
  _index = (_index + 1) % list.length;
  return sponsor.text;
}

// Warm cache on boot.
void loadActiveSponsors().catch(() => {});

// Forces a cache refresh — called by the Polar webhook so paid sponsors
// appear in the rotation within seconds, not minutes.
export function invalidateSponsorCache(): void {
  _cache = { sponsors: _cache.sponsors, expires: 0, version: _cache.version + 1 };
  void loadActiveSponsors().catch(() => {});
}
