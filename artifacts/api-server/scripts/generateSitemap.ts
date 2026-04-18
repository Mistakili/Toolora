/**
 * Regenerates artifacts/toolbox/public/sitemap.xml from the live database.
 *
 * Why a script (not a dynamic route): sitemaps don't need to be real-time,
 * static is faster for crawlers, and toolora.dev/sitemap.xml is served by the
 * toolbox SPA's static `public/` dir — no proxy hop needed.
 *
 * Run before each deploy:
 *   cd artifacts/api-server && pnpm exec tsx scripts/generateSitemap.ts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "@workspace/db";
import { mcpListingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const ORIGIN = "https://toolora.dev";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface UrlEntry {
  loc: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
  lastmod?: string;
}

// ── Static, hand-curated entries ────────────────────────────────────────────
// Anything that exists as a route in App.tsx but isn't dynamic should be here.
const STATIC_URLS: UrlEntry[] = [
  { loc: "/", changefreq: "weekly", priority: 1.0 },
  { loc: "/private", changefreq: "weekly", priority: 0.9 },
  { loc: "/mcp", changefreq: "weekly", priority: 0.9 },
  { loc: "/mcp-hub", changefreq: "daily", priority: 0.95 },
  { loc: "/mcp-hub/authors", changefreq: "daily", priority: 0.9 },
  { loc: "/agents", changefreq: "weekly", priority: 0.9 },
  { loc: "/host", changefreq: "weekly", priority: 0.7 },
  { loc: "/x402", changefreq: "weekly", priority: 0.7 },
  { loc: "/submit-mcp", changefreq: "monthly", priority: 0.7 },
  { loc: "/pricing", changefreq: "monthly", priority: 0.8 },
  { loc: "/api-docs", changefreq: "monthly", priority: 0.7 },
  { loc: "/blog", changefreq: "weekly", priority: 0.8 },
  { loc: "/extension", changefreq: "monthly", priority: 0.7 },
  { loc: "/integrations", changefreq: "monthly", priority: 0.7 },
  { loc: "/enterprise", changefreq: "monthly", priority: 0.7 },
  { loc: "/gdpr", changefreq: "monthly", priority: 0.6 },
  { loc: "/hipaa-checklist", changefreq: "monthly", priority: 0.6 },
  { loc: "/privacy", changefreq: "yearly", priority: 0.4 },
  { loc: "/terms", changefreq: "yearly", priority: 0.4 },
  // Tool category landing pages
  { loc: "/tools/text", changefreq: "weekly", priority: 0.85 },
  { loc: "/tools/developer", changefreq: "weekly", priority: 0.85 },
  { loc: "/tools/productivity", changefreq: "weekly", priority: 0.85 },
  { loc: "/tools/image", changefreq: "weekly", priority: 0.85 },
  { loc: "/tools/pdf", changefreq: "weekly", priority: 0.85 },
];

// MCP listing categories (need to mirror the categories used in McpCategory routes)
const MCP_CATEGORIES = [
  "developer-tools",
  "ai-llm",
  "data-analytics",
  "productivity",
  "finance",
  "web-search",
  "communication",
  "design",
  "media",
  "security",
  "other",
];

function urlXml(u: UrlEntry): string {
  const parts = [`  <url>`, `    <loc>${ORIGIN}${u.loc}</loc>`];
  if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
  if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
  if (u.priority !== undefined) parts.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
  parts.push(`  </url>`);
  return parts.join("\n");
}

async function main() {
  // 1. Pull all approved listings
  const listings = await db
    .select({ name: mcpListingsTable.name, createdAt: mcpListingsTable.createdAt })
    .from(mcpListingsTable)
    .where(eq(mcpListingsTable.approved, true));

  console.log(`[sitemap] ${listings.length} approved listings`);

  // 2. Build URL set
  const urls: UrlEntry[] = [...STATIC_URLS];

  // Listing detail pages — high priority, daily changefreq (analytics tick fresh)
  for (const l of listings) {
    const slug = slugify(l.name);
    urls.push({
      loc: `/mcp-hub/server/${slug}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: l.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : undefined,
    });
  }

  // Category landing pages
  for (const cat of MCP_CATEGORIES) {
    urls.push({ loc: `/mcp-hub/category/${cat}`, changefreq: "weekly", priority: 0.7 });
  }

  // 3. Dedupe by loc (just in case)
  const seen = new Set<string>();
  const deduped = urls.filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  console.log(`[sitemap] writing ${deduped.length} URLs`);

  // 4. Render XML
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    deduped.map(urlXml).join("\n") +
    `\n</urlset>\n`;

  // 5. Write to toolbox/public so it's served at toolora.dev/sitemap.xml
  const here = path.dirname(fileURLToPath(import.meta.url));
  const outPath = path.resolve(here, "../../toolbox/public/sitemap.xml");
  await fs.writeFile(outPath, body, "utf8");
  console.log(`[sitemap] wrote ${outPath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[sitemap] fatal:", err);
  process.exit(1);
});
