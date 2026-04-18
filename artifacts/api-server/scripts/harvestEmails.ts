/**
 * Email harvester for MCP listings.
 *
 * For each approved listing whose `url` points to GitHub:
 *   1. Try npm registry: any package whose repository.url matches → author.email
 *   2. Try PyPI: same lookup if repo is python-shaped
 *   3. Try GitHub user public email (api.github.com/users/{owner})
 *   4. Try latest commit author email (filter @users.noreply.github.com)
 *
 * Outputs CSV at .local/harvested-emails.csv with columns:
 *   slug, name, github_owner, github_repo, source, email, stars, suggested_subject, suggested_body
 *
 * No emails are sent. This is read-only. Use the CSV in your personal Gmail.
 *
 * Run:  pnpm tsx scripts/harvestEmails.ts
 *       (or: pnpm --filter @workspace/api-server exec tsx ../../scripts/harvestEmails.ts)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { db } from "@workspace/db";
import { mcpListingsTable } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";

const NOREPLY_RE = /(@users\.noreply\.github\.com|@noreply\.|^noreply@)/i;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const ghHeaders: Record<string, string> = {
  "User-Agent": "toolora-harvester/1.0 (hello@toolora.dev)",
  Accept: "application/vnd.github+json",
};
if (GITHUB_TOKEN) ghHeaders.Authorization = `Bearer ${GITHUB_TOKEN}`;

interface Row {
  slug: string;
  name: string;
  github_owner: string;
  github_repo: string;
  source: string;
  email: string;
  stars: number;
  suggested_subject: string;
  suggested_body: string;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseGithub(url: string): { owner: string; repo: string } | null {
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

function isValidEmail(e: string | null | undefined): e is string {
  if (!e) return false;
  if (NOREPLY_RE.test(e)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<unknown | null> {
  try {
    const r = await fetch(url, { headers });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function tryNpm(owner: string, repo: string): Promise<string | null> {
  // The npm registry doesn't index by repo URL, so try common package names: repo, owner-repo, @owner/repo
  const candidates = [repo, `${owner}-${repo}`, `@${owner}/${repo}`];
  for (const name of candidates) {
    const data = (await fetchJson(`https://registry.npmjs.org/${encodeURIComponent(name)}`)) as
      | { author?: { email?: string } | string; maintainers?: Array<{ email?: string }>; repository?: { url?: string } }
      | null;
    if (!data) continue;
    // Sanity check repo matches if available
    const rep = typeof data.repository === "object" ? data.repository?.url ?? "" : "";
    if (rep && !rep.toLowerCase().includes(`${owner.toLowerCase()}/${repo.toLowerCase()}`)) continue;
    const authorEmail = typeof data.author === "object" ? data.author?.email : null;
    if (isValidEmail(authorEmail)) return authorEmail;
    for (const m of data.maintainers ?? []) if (isValidEmail(m?.email)) return m!.email!;
  }
  return null;
}

async function tryGithubProfile(owner: string): Promise<string | null> {
  const data = (await fetchJson(`https://api.github.com/users/${encodeURIComponent(owner)}`, ghHeaders)) as
    | { email?: string | null }
    | null;
  if (data && isValidEmail(data.email)) return data.email!;
  return null;
}

async function tryGithubCommits(owner: string, repo: string): Promise<string | null> {
  const data = (await fetchJson(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=10`,
    ghHeaders,
  )) as Array<{ commit?: { author?: { email?: string; name?: string } } }> | null;
  if (!Array.isArray(data)) return null;
  for (const c of data) {
    const e = c.commit?.author?.email;
    if (isValidEmail(e)) return e!;
  }
  return null;
}

async function tryGithubStars(owner: string, repo: string): Promise<number> {
  const data = (await fetchJson(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    ghHeaders,
  )) as { stargazers_count?: number } | null;
  return data?.stargazers_count ?? 0;
}

async function findEmail(owner: string, repo: string): Promise<{ email: string; source: string } | null> {
  const npm = await tryNpm(owner, repo);
  if (npm) return { email: npm, source: "npm" };
  const profile = await tryGithubProfile(owner);
  if (profile) return { email: profile, source: "github_profile" };
  const commit = await tryGithubCommits(owner, repo);
  if (commit) return { email: commit, source: "github_commits" };
  return null;
}

function buildPersonalNote(name: string, slug: string): { subject: string; body: string } {
  return {
    subject: `Auto-listed your MCP server "${name}" on toolora.dev — your free analytics dashboard`,
    body:
      `Hey,\n\n` +
      `Quick heads-up: I run toolora.dev/mcp-hub, an MCP server directory (~340 servers, agent-readable JSON feed at /agents). ` +
      `I auto-listed "${name}" because it kept coming up in searches.\n\n` +
      `Two things you might find useful:\n\n` +
      `1. Free analytics dashboard for your listing — installs by client (Claude/Cursor/etc), views, top referrers:\n` +
      `   https://toolora.dev/mcp-hub/owner/${slug}\n` +
      `   (Claim it via your GitHub profile, no password.)\n\n` +
      `2. Embeddable README badge that counts as a backlink:\n` +
      `   https://toolora.dev/api/directory/badge/${slug}.svg\n\n` +
      `If you'd rather not be listed at all, reply REMOVE and I'll delist within 24h. No hard feelings.\n\n` +
      `— Yusuf, toolora.dev (built and run from Lagos)\n`,
  };
}

async function main() {
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : undefined;

  const baseQuery = db
    .select({ id: mcpListingsTable.id, name: mcpListingsTable.name, url: mcpListingsTable.url, buyerEmail: mcpListingsTable.buyerEmail })
    .from(mcpListingsTable)
    .where(and(eq(mcpListingsTable.approved, true), sql`${mcpListingsTable.url} ILIKE '%github.com%'`));
  const listings = limit ? await baseQuery.limit(limit) : await baseQuery;

  console.log(`[harvester] processing ${listings.length} GitHub-hosted listings… (GITHUB_TOKEN ${GITHUB_TOKEN ? "set" : "NOT set — will hit 60/hour rate limit"})`);

  const out: Row[] = [];
  let i = 0;
  for (const l of listings) {
    i++;
    if (l.buyerEmail && l.buyerEmail.includes("@")) continue; // already have one
    const gh = parseGithub(l.url);
    if (!gh) continue;
    process.stdout.write(`\r[${i}/${listings.length}] ${gh.owner}/${gh.repo}                    `);
    try {
      const found = await findEmail(gh.owner, gh.repo);
      if (!found) continue;
      const stars = await tryGithubStars(gh.owner, gh.repo);
      const slug = slugify(l.name);
      const note = buildPersonalNote(l.name, slug);
      out.push({
        slug,
        name: l.name,
        github_owner: gh.owner,
        github_repo: gh.repo,
        source: found.source,
        email: found.email,
        stars,
        suggested_subject: note.subject,
        suggested_body: note.body,
      });
    } catch (err) {
      console.error(`\n[harvester] error on ${gh.owner}/${gh.repo}:`, err);
    }
  }
  console.log("");
  console.log(`[harvester] found ${out.length} contactable emails`);

  // Sort by stars desc so highest-leverage outreach is at top
  out.sort((a, b) => b.stars - a.stars);

  const outDir = path.resolve(".local");
  await fs.mkdir(outDir, { recursive: true });
  const csvPath = path.join(outDir, "harvested-emails.csv");
  const escape = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
  const lines = [
    ["slug", "name", "github_owner", "github_repo", "source", "email", "stars", "suggested_subject", "suggested_body"]
      .map(escape)
      .join(","),
    ...out.map((r) =>
      [r.slug, r.name, r.github_owner, r.github_repo, r.source, r.email, String(r.stars), r.suggested_subject, r.suggested_body]
        .map(escape)
        .join(","),
    ),
  ];
  await fs.writeFile(csvPath, lines.join("\n"), "utf8");
  console.log(`[harvester] wrote ${csvPath}`);

  // Quick summary by source
  const bySource: Record<string, number> = {};
  for (const r of out) bySource[r.source] = (bySource[r.source] ?? 0) + 1;
  console.log(`[harvester] by source:`, bySource);
  console.log(`[harvester] top 10 by stars:`);
  for (const r of out.slice(0, 10)) {
    console.log(`  ★ ${String(r.stars).padStart(6)}  ${r.email.padEnd(40)}  ${r.github_owner}/${r.github_repo}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("[harvester] fatal:", err);
  process.exit(1);
});
