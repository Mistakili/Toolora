import { Router, type IRouter, type Request, type Response } from "express";
import crypto from "node:crypto";
import { db } from "@workspace/db";
import { mcpListingsTable, mcpListingEventsTable } from "@workspace/db/schema";
import { and, eq, gte, sql, desc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { signOwnerToken, verifyOwnerToken, OWNER_SECRET } from "../lib/ownerToken";

const router: IRouter = Router();

const IP_SALT = process.env.IP_HASH_SALT ?? OWNER_SECRET;
const ALLOWED_KINDS = new Set([
  "view",
  "visit",
  "install_claude",
  "install_cursor",
  "install_chatgpt",
  "install_continue",
  "install_zed",
  "install_other",
  "badge_view",
]);

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hashIp(ip: string): string {
  return crypto.createHmac("sha256", IP_SALT).update(ip).digest("hex").slice(0, 16);
}

// Per-IP, per-(listing,kind) cooldown to prevent inflation of install/view counts.
// In-memory is fine for an MVP; replace with Redis when we scale beyond one instance.
const eventCooldown = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 min between identical events from same IP
const MAX_COOLDOWN_ENTRIES = 50_000;
function checkCooldown(key: string): boolean {
  const now = Date.now();
  const last = eventCooldown.get(key);
  if (last && now - last < COOLDOWN_MS) return false;
  if (eventCooldown.size > MAX_COOLDOWN_ENTRIES) {
    // Cheap eviction: drop everything older than the window.
    for (const [k, t] of eventCooldown) if (now - t > COOLDOWN_MS) eventCooldown.delete(k);
  }
  eventCooldown.set(key, now);
  return true;
}

async function findListingBySlug(slug: string) {
  // SQL-side filter (case + non-alnum normalized) so we don't fetch every approved row.
  const target = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const rows = await db
    .select({
      id: mcpListingsTable.id,
      name: mcpListingsTable.name,
      buyerEmail: mcpListingsTable.buyerEmail,
      featured: mcpListingsTable.featured,
      category: mcpListingsTable.category,
      createdAt: mcpListingsTable.createdAt,
    })
    .from(mcpListingsTable)
    .where(
      and(
        eq(mcpListingsTable.approved, true),
        sql`regexp_replace(regexp_replace(lower(${mcpListingsTable.name}), '[^a-z0-9]+', '-', 'g'), '(^-|-$)', '', 'g') = ${target}`,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

// ─── 1. Event tracking — POST /api/directory/listings/:slug/events ──────────
router.post("/listings/:slug/events", async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug ?? "").slice(0, 80).toLowerCase();
    const kind = String((req.body as { kind?: string })?.kind ?? "").slice(0, 32);
    if (!slug || !ALLOWED_KINDS.has(kind)) {
      res.status(400).json({ ok: false, error: "bad_request" });
      return;
    }
    const listing = await findListingBySlug(slug);
    if (!listing) {
      res.status(404).json({ ok: false, error: "not_found" });
      return;
    }
    const ip = (req.headers["x-forwarded-for"]?.toString().split(",")[0].trim()) || req.ip || "0.0.0.0";
    const ipHash = hashIp(ip);
    // 5-minute cooldown per (ip, listing, kind) to prevent inflation of install/view counts.
    if (!checkCooldown(`${ipHash}:${listing.id}:${kind}`)) {
      res.json({ ok: true, deduped: true });
      return;
    }
    await db.insert(mcpListingEventsTable).values({
      listingId: listing.id,
      kind,
      ipHash,
      referer: (req.headers.referer ?? req.headers.referrer ?? "").toString().slice(0, 200) || null,
      ua: (req.headers["user-agent"] ?? "").toString().slice(0, 200) || null,
    });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "[directoryEvents] insert failed");
    res.json({ ok: false });
  }
});

// ─── 2. Badge SVG — GET /api/directory/badge/:slug.svg ──────────────────────
router.get("/badge/:slug.svg", async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug ?? "").slice(0, 80).toLowerCase();
  const listing = await findListingBySlug(slug);

  // Fire-and-forget badge_view event for analytics — same cooldown logic.
  if (listing) {
    const ip = (req.headers["x-forwarded-for"]?.toString().split(",")[0].trim()) || req.ip || "0.0.0.0";
    const ipHash = hashIp(ip);
    if (checkCooldown(`${ipHash}:${listing.id}:badge_view`)) {
      db.insert(mcpListingEventsTable).values({
        listingId: listing.id,
        kind: "badge_view",
        ipHash,
        referer: (req.headers.referer ?? "").toString().slice(0, 200) || null,
        ua: (req.headers["user-agent"] ?? "").toString().slice(0, 200) || null,
      }).catch(() => {});
    }
  }

  const label = "Listed on";
  const message = "toolora.dev";
  const labelW = label.length * 6.5 + 14;
  const msgW = message.length * 7 + 14;
  const totalW = labelW + msgW;
  const accent = listing?.featured ? "#7c3aed" : "#10b981";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="20" role="img" aria-label="${label}: ${message}">
  <linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".15"/><stop offset=".5" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></linearGradient>
  <clipPath id="r"><rect width="${totalW}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelW}" height="20" fill="#18181b"/>
    <rect x="${labelW}" width="${msgW}" height="20" fill="${accent}"/>
    <rect width="${totalW}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,Geneva,sans-serif" font-size="11">
    <text x="${labelW / 2}" y="14">${label}</text>
    <text x="${labelW + msgW / 2}" y="14">${message}</text>
  </g>
</svg>`;
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Allow embedding in GitHub READMEs and other cross-origin pages — overrides helmet's default same-origin CORP.
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.send(svg);
});

// ─── 3. Agent-friendly machine-readable feed — GET /api/directory/agents.json
router.get("/agents.json", async (req: Request, res: Response): Promise<void> => {
  try {
    const sort = String(req.query.sort ?? "quality"); // quality | recent
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const installCounts = await db
      .select({
        listingId: mcpListingEventsTable.listingId,
        installs: sql<number>`count(*) filter (where kind like 'install_%')::int`,
      })
      .from(mcpListingEventsTable)
      .where(gte(mcpListingEventsTable.createdAt, since))
      .groupBy(mcpListingEventsTable.listingId);
    const installMap = new Map(installCounts.map((r) => [r.listingId, r.installs]));

    const rows = await db
      .select({
        id: mcpListingsTable.id,
        name: mcpListingsTable.name,
        slug: mcpListingsTable.name,
        tagline: mcpListingsTable.tagline,
        description: mcpListingsTable.description,
        url: mcpListingsTable.url,
        configUrl: mcpListingsTable.configUrl,
        category: mcpListingsTable.category,
        featured: mcpListingsTable.featured,
        createdAt: mcpListingsTable.createdAt,
      })
      .from(mcpListingsTable)
      .where(eq(mcpListingsTable.approved, true));

    const enriched = rows.map((r) => ({
      id: r.id,
      slug: slugify(r.name),
      name: r.name,
      tagline: r.tagline,
      description: r.description,
      category: r.category,
      featured: r.featured,
      project_url: r.url,
      config_url: r.configUrl,
      detail_url: `https://toolora.dev/mcp-hub/server/${slugify(r.name)}`,
      install_url: `https://toolora.dev/mcp-hub/server/${slugify(r.name)}#install`,
      installs_30d: installMap.get(r.id) ?? 0,
      listed_at: r.createdAt,
    }));

    enriched.sort((a, b) => {
      if (sort === "recent") return new Date(b.listed_at ?? 0).getTime() - new Date(a.listed_at ?? 0).getTime();
      // quality: featured first, then install count, then recency
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (b.installs_30d !== a.installs_30d) return b.installs_30d - a.installs_30d;
      return new Date(b.listed_at ?? 0).getTime() - new Date(a.listed_at ?? 0).getTime();
    });

    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      $schema: "https://toolora.dev/schemas/mcp-directory-v1.json",
      version: "1.0",
      generated_at: new Date().toISOString(),
      total: enriched.length,
      sort,
      docs: "https://toolora.dev/agents",
      servers: enriched,
    });
  } catch (err) {
    logger.error({ err }, "[directoryEvents] agents.json failed");
    res.status(500).json({ error: "server_error" });
  }
});

// ─── 4. MCP Weekly preview — GET /api/directory/weekly-preview ──────────────
router.get("/weekly-preview", async (_req: Request, res: Response): Promise<void> => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newest = await db
      .select({
        id: mcpListingsTable.id,
        name: mcpListingsTable.name,
        tagline: mcpListingsTable.tagline,
        category: mcpListingsTable.category,
        url: mcpListingsTable.url,
      })
      .from(mcpListingsTable)
      .where(and(eq(mcpListingsTable.approved, true), gte(mcpListingsTable.createdAt, sevenDaysAgo)))
      .orderBy(desc(mcpListingsTable.createdAt))
      .limit(3);

    const installs = await db
      .select({
        listingId: mcpListingEventsTable.listingId,
        installs: sql<number>`count(*) filter (where kind like 'install_%')::int`,
      })
      .from(mcpListingEventsTable)
      .where(gte(mcpListingEventsTable.createdAt, sevenDaysAgo))
      .groupBy(mcpListingEventsTable.listingId)
      .orderBy(sql`count(*) filter (where kind like 'install_%') desc`)
      .limit(1);

    let hiddenGem: { id: string; name: string; tagline: string; category: string; url: string } | null = null;
    if (installs.length > 0) {
      const r = await db
        .select({
          id: mcpListingsTable.id,
          name: mcpListingsTable.name,
          tagline: mcpListingsTable.tagline,
          category: mcpListingsTable.category,
          url: mcpListingsTable.url,
        })
        .from(mcpListingsTable)
        .where(eq(mcpListingsTable.id, installs[0].listingId))
        .limit(1);
      if (r.length > 0) hiddenGem = r[0];
    }

    res.json({
      issueDate: new Date().toISOString().slice(0, 10),
      newServers: newest.map((r) => ({ ...r, slug: slugify(r.name) })),
      hiddenGem: hiddenGem ? { ...hiddenGem, slug: slugify(hiddenGem.name) } : null,
    });
  } catch (err) {
    logger.error({ err }, "[directoryEvents] weekly-preview failed");
    res.json({ issueDate: new Date().toISOString().slice(0, 10), newServers: [], hiddenGem: null });
  }
});

// ─── 5. Owner auth + analytics ──────────────────────────────────────────────
// signOwnerToken / verifyOwnerToken now live in ../lib/ownerToken so the
// Gateway billing routes can share the same HMAC scheme. Re-exported above.

// ── GitHub-based ownership verification ────────────────────────────────────
// Listings without a buyer_email (the 340 imported ones) can be claimed by
// proving control of the GitHub account whose repo is in the listing's `url`.
// Flow:
//   POST /owner/claim-github/start  { slug } → { verifyToken, githubOwner, instructions }
//   POST /owner/claim-github/verify { slug, verifyToken } → fetches the GitHub
//     user's public bio; if it contains the verifyToken string, marks
//     verified_github_owner on the listing and returns an owner token.
// We tie the verifyToken to (listingId, githubOwner) via HMAC so a token
// minted for repo A can't be replayed against repo B.

function parseGithubFromUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    if (!/github\.com$/i.test(u.hostname)) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

function signVerifyToken(listingId: string, githubOwner: string): string {
  // Short-lived (24h) HMAC-derived token presented to the user as a string to
  // paste into their GitHub bio. Deterministic for a given (listing, owner)
  // within a 24-hour window so the user can refresh the page.
  const window = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  const payload = `${listingId}.${githubOwner.toLowerCase()}.${window}`;
  const sig = crypto.createHmac("sha256", OWNER_SECRET).update(payload).digest("hex").slice(0, 16);
  return `toolora-verify-${sig}`;
}

router.post("/owner/claim-github/start", async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.body as { slug?: string };
    if (!slug) { res.status(400).json({ ok: false, error: "bad_request" }); return; }
    const listing = await findListingBySlugWithUrl(String(slug).toLowerCase().slice(0, 80));
    if (!listing) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    const gh = parseGithubFromUrl(listing.url);
    if (!gh) {
      res.status(400).json({ ok: false, error: "not_github", hint: "This listing's project URL is not a GitHub repo, so GitHub verification isn't available. Email hello@toolora.dev to claim." });
      return;
    }
    const verifyToken = signVerifyToken(listing.id, gh.owner);
    res.json({
      ok: true,
      verifyToken,
      githubOwner: gh.owner,
      githubRepo: gh.repo,
      instructions:
        `1. Open https://github.com/settings/profile  2. Paste this string anywhere in your "Bio" field: ${verifyToken}  3. Save, then click "Verify" below. You can remove it from your bio after verification.`,
    });
  } catch (err) {
    logger.error({ err }, "[directoryEvents] claim-github/start failed");
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.post("/owner/claim-github/verify", async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.body as { slug?: string };
    if (!slug) { res.status(400).json({ ok: false, error: "bad_request" }); return; }
    const listing = await findListingBySlugWithUrl(String(slug).toLowerCase().slice(0, 80));
    if (!listing) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    const gh = parseGithubFromUrl(listing.url);
    if (!gh) { res.status(400).json({ ok: false, error: "not_github" }); return; }

    const expected = signVerifyToken(listing.id, gh.owner);
    // Fetch the user's public bio from GitHub
    const ghHeaders: Record<string, string> = {
      "User-Agent": "toolora-verify/1.0 (hello@toolora.dev)",
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) ghHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const r = await fetch(`https://api.github.com/users/${encodeURIComponent(gh.owner)}`, { headers: ghHeaders });
    if (!r.ok) {
      res.status(502).json({ ok: false, error: "github_unreachable", hint: "Could not reach GitHub. Try again in a moment." });
      return;
    }
    const profile = (await r.json()) as { bio?: string | null; email?: string | null; login?: string };
    const bio = (profile.bio ?? "").toString();
    if (!bio.includes(expected)) {
      res.status(401).json({
        ok: false,
        error: "verification_string_not_found",
        hint: `We checked github.com/${gh.owner}'s bio and didn't find the verification string. Make sure you saved your profile and try again. (We re-fetch live; no GitHub caching delay.)`,
      });
      return;
    }
    // Success: persist + issue owner token
    await db
      .update(mcpListingsTable)
      .set({ verifiedGithubOwner: gh.owner.toLowerCase() })
      .where(eq(mcpListingsTable.id, listing.id));
    const token = signOwnerToken(listing.id, `gh:${gh.owner.toLowerCase()}`);
    res.json({ ok: true, token, listingId: listing.id, githubOwner: gh.owner });
  } catch (err) {
    logger.error({ err }, "[directoryEvents] claim-github/verify failed");
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

// findListingBySlug variant that also returns `url` for GitHub parsing
async function findListingBySlugWithUrl(slug: string) {
  const target = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const rows = await db
    .select({
      id: mcpListingsTable.id,
      name: mcpListingsTable.name,
      buyerEmail: mcpListingsTable.buyerEmail,
      url: mcpListingsTable.url,
      verifiedGithubOwner: mcpListingsTable.verifiedGithubOwner,
    })
    .from(mcpListingsTable)
    .where(
      and(
        eq(mcpListingsTable.approved, true),
        sql`regexp_replace(regexp_replace(lower(${mcpListingsTable.name}), '[^a-z0-9]+', '-', 'g'), '(^-|-$)', '', 'g') = ${target}`,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

// POST /api/directory/owner/claim — { slug, email } → { token } if buyerEmail matches
router.post("/owner/claim", async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug, email } = req.body as { slug?: string; email?: string };
    if (!slug || !email) { res.status(400).json({ ok: false, error: "bad_request" }); return; }
    const listing = await findListingBySlug(String(slug).toLowerCase().slice(0, 80));
    if (!listing) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    const submitted = String(email).trim().toLowerCase();
    const onFile = (listing.buyerEmail ?? "").trim().toLowerCase();
    if (!onFile || onFile !== submitted) {
      res.status(401).json({ ok: false, error: "email_mismatch", hint: "Use the email you submitted with this listing." });
      return;
    }
    const token = signOwnerToken(listing.id, submitted);
    res.json({ ok: true, token, listingId: listing.id });
  } catch (err) {
    logger.error({ err }, "[directoryEvents] owner/claim failed");
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

// GET /api/directory/owner/:slug/stats — token-protected analytics
router.get("/owner/:slug/stats", async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug ?? "").slice(0, 80).toLowerCase();
    const token = String(req.query.token ?? req.headers["x-owner-token"] ?? "");
    const listing = await findListingBySlug(slug);
    if (!listing) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    if (!verifyOwnerToken(token, listing.id)) {
      res.status(401).json({ ok: false, error: "unauthorized" });
      return;
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const byKind7d = await db
      .select({
        kind: mcpListingEventsTable.kind,
        count: sql<number>`count(*)::int`,
      })
      .from(mcpListingEventsTable)
      .where(and(eq(mcpListingEventsTable.listingId, listing.id), gte(mcpListingEventsTable.createdAt, sevenDaysAgo)))
      .groupBy(mcpListingEventsTable.kind);

    const byKindPrev = await db
      .select({
        kind: mcpListingEventsTable.kind,
        count: sql<number>`count(*)::int`,
      })
      .from(mcpListingEventsTable)
      .where(
        and(
          eq(mcpListingEventsTable.listingId, listing.id),
          gte(mcpListingEventsTable.createdAt, fourteenDaysAgo),
          sql`created_at < ${sevenDaysAgo}`,
        ),
      )
      .groupBy(mcpListingEventsTable.kind);

    const allTime = await db
      .select({
        kind: mcpListingEventsTable.kind,
        count: sql<number>`count(*)::int`,
      })
      .from(mcpListingEventsTable)
      .where(eq(mcpListingEventsTable.listingId, listing.id))
      .groupBy(mcpListingEventsTable.kind);

    const dailyRows = await db
      .select({
        day: sql<string>`to_char(date_trunc('day', created_at), 'YYYY-MM-DD')`,
        kind: mcpListingEventsTable.kind,
        count: sql<number>`count(*)::int`,
      })
      .from(mcpListingEventsTable)
      .where(and(eq(mcpListingEventsTable.listingId, listing.id), gte(mcpListingEventsTable.createdAt, sevenDaysAgo)))
      .groupBy(sql`date_trunc('day', created_at)`, mcpListingEventsTable.kind)
      .orderBy(sql`date_trunc('day', created_at)`);

    const refRows = await db
      .select({
        referer: mcpListingEventsTable.referer,
        count: sql<number>`count(*)::int`,
      })
      .from(mcpListingEventsTable)
      .where(and(eq(mcpListingEventsTable.listingId, listing.id), gte(mcpListingEventsTable.createdAt, sevenDaysAgo)))
      .groupBy(mcpListingEventsTable.referer)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    const sumKind = (rows: Array<{ kind: string; count: number }>, prefix: string) =>
      rows.filter((r) => r.kind.startsWith(prefix)).reduce((s, r) => s + r.count, 0);

    const installs7d = sumKind(byKind7d, "install_");
    const installsPrev = sumKind(byKindPrev, "install_");
    const installsAll = sumKind(allTime, "install_");
    const views7d = sumKind(byKind7d, "view") + sumKind(byKind7d, "visit");
    const viewsPrev = sumKind(byKindPrev, "view") + sumKind(byKindPrev, "visit");
    const viewsAll = sumKind(allTime, "view") + sumKind(allTime, "visit");
    const badge7d = sumKind(byKind7d, "badge_view");
    const badgeAll = sumKind(allTime, "badge_view");

    res.json({
      ok: true,
      listing: { id: listing.id, name: listing.name, category: listing.category, featured: listing.featured },
      summary: {
        installs_7d: installs7d,
        installs_prev_7d: installsPrev,
        installs_change_pct: installsPrev > 0 ? Math.round(((installs7d - installsPrev) / installsPrev) * 100) : null,
        installs_all_time: installsAll,
        views_7d: views7d,
        views_prev_7d: viewsPrev,
        views_change_pct: viewsPrev > 0 ? Math.round(((views7d - viewsPrev) / viewsPrev) * 100) : null,
        views_all_time: viewsAll,
        badge_views_7d: badge7d,
        badge_views_all_time: badgeAll,
      },
      byKind: byKind7d,
      daily: dailyRows,
      topReferers: refRows.filter((r) => r.referer),
    });
  } catch (err) {
    logger.error({ err }, "[directoryEvents] owner stats failed");
    res.status(500).json({ ok: false, error: "server_error" });
  }
});

export default router;
