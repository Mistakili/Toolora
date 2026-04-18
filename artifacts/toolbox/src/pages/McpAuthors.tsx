import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BadgeCheck, Github, Search, Trophy } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

interface AgentServer {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  featured: boolean;
  project_url: string;
  detail_url: string;
}

interface AuthorRow {
  handle: string;
  servers: AgentServer[];
  totalFeatured: number;
}

function ghOwnerOf(url: string): string | null {
  try {
    const u = new URL(url);
    if (!/github\.com$/i.test(u.hostname)) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[0] ?? null;
  } catch {
    return null;
  }
}

export default function McpAuthors() {
  const [servers, setServers] = useState<AgentServer[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useSEO({
    title: "MCP server authors — 340+ Model Context Protocol creators | Toolora Hall of Fame",
    description:
      "Every Model Context Protocol (MCP) server creator listed on toolora.dev, grouped by GitHub author and ranked by reach. Built one of these? Claim your listing free in 60 seconds — get install analytics, an embeddable README badge, and inclusion in the agent-readable feed.",
    canonical: "https://toolora.dev/mcp-hub/authors",
  });

  useEffect(() => {
    fetch(API + "/api/directory/agents.json")
      .then((r) => r.json())
      .then((d) => {
        setServers(d.servers ?? []);
      })
      .catch(() => setError("Could not load the directory. Try refreshing."))
      .finally(() => setBusy(false));
  }, []);

  const authors: AuthorRow[] = useMemo(() => {
    const map = new Map<string, AuthorRow>();
    for (const s of servers) {
      const handle = ghOwnerOf(s.project_url) ?? "(non-github)";
      if (!map.has(handle)) map.set(handle, { handle, servers: [], totalFeatured: 0 });
      const row = map.get(handle)!;
      row.servers.push(s);
      if (s.featured) row.totalFeatured++;
    }
    const rows = Array.from(map.values());
    rows.sort((a, b) => {
      if (b.totalFeatured !== a.totalFeatured) return b.totalFeatured - a.totalFeatured;
      if (b.servers.length !== a.servers.length) return b.servers.length - a.servers.length;
      return a.handle.localeCompare(b.handle);
    });
    return rows;
  }, [servers]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return authors;
    return authors.filter(
      (a) =>
        a.handle.toLowerCase().includes(term) ||
        a.servers.some((s) => s.name.toLowerCase().includes(term) || s.tagline.toLowerCase().includes(term)),
    );
  }, [authors, q]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/mcp-hub" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to MCP Hub
      </Link>

      <div className="flex items-center gap-2 mb-2 text-xs text-amber-400 uppercase tracking-widest font-semibold">
        <Trophy className="w-3.5 h-3.5" /> Hall of Fame
      </div>
      <h1 className="text-4xl font-bold text-zinc-100 mb-3">
        Every MCP author, in one place.
      </h1>
      <p className="text-zinc-400 max-w-3xl mb-8">
        {servers.length || "340+"} servers · {authors.length || "—"} authors · ranked by featured count and listing breadth.
        Built one of these? <strong className="text-zinc-200">Claim your listing in 60 seconds via GitHub bio verification</strong> —
        no email needed, no password — and get a free install dashboard plus an embeddable README badge.
      </p>

      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-5 mb-8 flex items-start gap-4">
        <BadgeCheck className="w-5 h-5 text-violet-300 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-zinc-100 font-semibold mb-1">How "Claim your listing" works</p>
          <ol className="text-xs text-zinc-400 space-y-1 list-decimal pl-4">
            <li>Find your server below and click <em>Claim</em>.</li>
            <li>Paste a one-line verification string into your GitHub profile bio.</li>
            <li>Click verify. Done — you control the listing, and you can remove the string from your bio after.</li>
          </ol>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by GitHub handle, server name, or tagline…"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
        />
      </div>

      {busy && <p className="text-sm text-zinc-500">Loading…</p>}
      {error && <p className="text-sm text-amber-400">{error}</p>}

      {!busy && !error && (
        <div className="space-y-4">
          {filtered.map((a) => (
            <AuthorCard key={a.handle} row={a} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-zinc-500">No authors match "{q}".</p>
          )}
        </div>
      )}
    </main>
  );
}

function AuthorCard({ row }: { row: AuthorRow }) {
  const isGithub = row.handle !== "(non-github)";
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-3">
          {isGithub ? (
            <a
              href={`https://github.com/${row.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-100 font-semibold hover:text-violet-300"
            >
              <Github className="w-4 h-4" /> @{row.handle}
            </a>
          ) : (
            <span className="text-zinc-300 font-semibold">{row.handle}</span>
          )}
          <span className="text-xs text-zinc-500">
            · {row.servers.length} server{row.servers.length === 1 ? "" : "s"}
            {row.totalFeatured > 0 && <span className="ml-2 text-amber-400">★ {row.totalFeatured} featured</span>}
          </span>
        </div>
      </div>
      <ul className="grid sm:grid-cols-2 gap-2">
        {row.servers.map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-950/40 px-3 py-2">
            <div className="min-w-0">
              <Link href={`/mcp-hub/server/${s.slug}`} className="text-sm text-zinc-100 hover:text-violet-300 truncate block">
                {s.name}
              </Link>
              <p className="text-[11px] text-zinc-500 truncate">{s.tagline}</p>
            </div>
            <Link
              href={`/mcp-hub/owner/${s.slug}`}
              className="ml-3 flex-shrink-0 text-[11px] font-semibold text-violet-300 hover:text-violet-200 border border-violet-500/30 hover:border-violet-400 rounded-md px-2 py-1"
            >
              Claim →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
