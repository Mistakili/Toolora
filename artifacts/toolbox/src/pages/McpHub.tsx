import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, Sparkles, ExternalLink, Zap, Shield, ArrowRight, Plus, TrendingUp, Crown, ChevronRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { mcpSlugify } from "@/lib/mcpSlug";
import { NewsletterCapture } from "@/components/NewsletterCapture";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
const BASE = import.meta.env.BASE_URL;

interface Listing {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  configUrl: string | null;
  category: string;
  logoUrl: string | null;
  featured: boolean;
  createdAt: string;
}

interface CatCount { category: string; count: number }

const FEATURED_TOOLORA: Listing = {
  id: "toolora-featured",
  name: "Toolora MCP",
  tagline: "12 document & utility tools: PDF extraction, OCR, QR codes, CSV↔JSON, audio transcription. Free, no auth.",
  description: "",
  url: "https://toolora.dev/mcp",
  configUrl: "https://toolora.dev/api/mcp",
  category: "Productivity",
  logoUrl: null,
  featured: true,
  createdAt: new Date().toISOString(),
};

// Category accent — used only as a thin top border on cards so users can scan-recognize
const CATEGORY_ACCENT: Record<string, string> = {
  "Developer Tools": "border-cyan-400/60",
  "Data": "border-emerald-400/60",
  "AI/LLM": "border-violet-400/60",
  "Productivity": "border-amber-400/60",
  "Marketing": "border-pink-400/60",
  "Finance": "border-yellow-400/60",
  "Other": "border-zinc-400/60",
};

// Real AI-generated editorial photography — one per category
const CATEGORY_HERO_IMAGE: Record<string, string> = {
  "Developer Tools": BASE + "images/mcp-cat-developer-tools.png",
  "Data": BASE + "images/mcp-cat-data.png",
  "AI/LLM": BASE + "images/mcp-cat-ai-llm.png",
  "Productivity": BASE + "images/mcp-cat-productivity.png",
  "Marketing": BASE + "images/mcp-cat-marketing.png",
  "Finance": BASE + "images/mcp-cat-finance.png",
  "Other": BASE + "images/mcp-cat-other.png",
};

const CATEGORY_TAGLINE: Record<string, string> = {
  "Developer Tools": "Ship faster. Built for code.",
  "Data": "Pipelines, warehouses, and queries.",
  "AI/LLM": "Models, memory, and reasoning.",
  "Productivity": "Less busywork. More output.",
  "Marketing": "Reach. Measure. Iterate.",
  "Finance": "Move money. Read markets.",
  "Other": "Useful, just not in a box.",
};

const CATEGORY_BLURB: Record<string, string> = {
  "Developer Tools": "The servers your IDE has been waiting for. Code search, repo intelligence, deploys, and CI all hooked into your agent loop.",
  "Data": "Hand your agent a real query plan. Postgres, BigQuery, Snowflake, Parquet, dbt — all installable with one click.",
  "AI/LLM": "Memory, embeddings, vector search, and model routing. The infrastructure layer your prompts actually need.",
  "Productivity": "Calendars, docs, notes, email. The tools you live in, made readable and writable by the agent you live with.",
  "Marketing": "Audience data, campaign telemetry, and content workflows. Stop pasting between dashboards.",
  "Finance": "Markets, payments, ledgers. From price feeds to USDC settlement.",
  "Other": "The long tail of MCP. Niche, specialized, sometimes weird, often the answer to the exact thing you're trying to do.",
};

function imgFor(c: string) { return CATEGORY_HERO_IMAGE[c] ?? CATEGORY_HERO_IMAGE.Other; }
function accentFor(c: string) { return CATEGORY_ACCENT[c] ?? CATEGORY_ACCENT.Other; }

// ─── Big "Today" spotlight hero ─────────────────────────────
function SpotlightHero({ listing }: { listing: Listing }) {
  const slug = mcpSlugify(listing.name);
  const heroImg = imgFor(listing.category);
  return (
    <Link
      href={`/mcp-hub/server/${slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/40 hover:shadow-black/60 transition-shadow duration-500"
    >
      <div className="absolute inset-0">
        <img src={heroImg} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-[1.03] transition-all duration-700" />
        {/* Single dark overlay for text legibility — no color gradient */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>
      <div className="relative p-6 md:p-10 min-h-[340px] md:min-h-[460px] flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white bg-white/15 backdrop-blur border border-white/30 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Spotlight
          </span>
          <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-white/70">{listing.category}</span>
        </div>
        <div className="flex items-end gap-4 md:gap-5">
          <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[22%] flex items-center justify-center text-2xl md:text-3xl font-bold bg-zinc-950/80 backdrop-blur text-white shadow-xl ring-1 ring-white/20">
            {listing.logoUrl
              ? <img src={listing.logoUrl} alt={listing.name + " logo"} loading="eager" decoding="async" className="w-full h-full rounded-[22%] object-cover" />
              : <span className="drop-shadow">{listing.name.charAt(0)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-1 truncate">{listing.name}</h2>
            <p className="text-sm md:text-base text-white/85 line-clamp-2 leading-snug">{listing.tagline}</p>
          </div>
          <div className="hidden md:flex shrink-0 items-center gap-2 rounded-full bg-white text-zinc-950 px-5 py-2.5 text-sm font-semibold shadow-lg group-hover:scale-105 transition-transform">
            Get <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── App-Store style large card for rails ───────────────────
function RailCard({ listing }: { listing: Listing }) {
  const slug = mcpSlugify(listing.name);
  const heroImg = imgFor(listing.category);
  const accent = accentFor(listing.category);
  return (
    <Link
      href={`/mcp-hub/server/${slug}`}
      className="group snap-start shrink-0 w-[260px] md:w-[300px] block"
    >
      <div className={"relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 shadow-lg ring-1 ring-white/5 group-hover:ring-white/20 group-hover:scale-[1.02] transition-all duration-300 border-t-2 " + accent}>
        <img src={heroImg} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-80 transition-opacity duration-500" />
        {/* Single dark overlay for text legibility — no color gradient */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
        {/* Logo chip */}
        <div className="absolute top-3 left-3">
          <div className="w-12 h-12 rounded-[22%] bg-zinc-950/80 backdrop-blur flex items-center justify-center text-base font-bold text-white ring-1 ring-white/20 shadow-xl">
            {listing.logoUrl
              ? <img src={listing.logoUrl} alt={listing.name + " logo"} loading="lazy" decoding="async" className="w-full h-full rounded-[22%] object-cover" />
              : listing.name.charAt(0)}
          </div>
        </div>
        {listing.featured && (
          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur px-2 py-0.5 rounded-full ring-1 ring-white/30 inline-flex items-center gap-1">
            <Crown className="w-2.5 h-2.5" /> Featured
          </span>
        )}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-white/70 mb-0.5">{listing.category}</div>
          <div className="text-base font-semibold text-white leading-tight truncate">{listing.name}</div>
        </div>
      </div>
      <p className="mt-3 px-1 text-sm text-zinc-400 leading-snug line-clamp-2 group-hover:text-zinc-200 transition-colors">{listing.tagline}</p>
    </Link>
  );
}

// ─── Compact list row (for filtered/grid view) ──────────────
function ListRow({ listing }: { listing: Listing }) {
  const slug = mcpSlugify(listing.name);
  const accent = accentFor(listing.category);
  return (
    <Link
      href={`/mcp-hub/server/${slug}`}
      className={"group flex items-center gap-3 p-3 rounded-xl border-l-2 " + accent + " bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700 transition active:scale-[0.99] border-y border-r border-y-zinc-800 border-r-zinc-800"}
    >
      <div className="shrink-0 w-12 h-12 rounded-[22%] flex items-center justify-center text-base font-bold bg-zinc-800 text-white shadow ring-1 ring-white/10 overflow-hidden">
        {listing.logoUrl
          ? <img src={listing.logoUrl} alt={listing.name + " logo"} loading="lazy" decoding="async" className="w-full h-full rounded-[22%] object-cover" />
          : listing.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-zinc-100 text-sm truncate group-hover:text-white">{listing.name}</h3>
          {listing.featured && <Crown className="w-3 h-3 text-violet-400 shrink-0" />}
        </div>
        <p className="text-xs text-zinc-500 truncate">{listing.tagline}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition shrink-0" />
    </Link>
  );
}

// ─── Horizontal-scroll category rail ─────────────────────────
function CategoryRail({ title, items, viewAllHref, badge }: { title: string; items: Listing[]; viewAllHref?: string; badge?: string }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-3 px-1">
        <div>
          {badge && <p className="text-[11px] font-mono text-violet-400 uppercase tracking-widest mb-0.5">{badge}</p>}
          <h2 className="text-xl md:text-2xl font-bold text-zinc-50 tracking-tight">{title}</h2>
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-violet-400 hover:text-violet-300 inline-flex items-center gap-0.5 shrink-0">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="-mx-4 px-4 overflow-x-auto snap-x snap-mandatory scrollbar-thin scroll-pl-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex gap-4 pb-3">
          {items.map((l) => <RailCard key={l.id} listing={l} />)}
          {viewAllHref && (
            <Link href={viewAllHref} className="snap-start shrink-0 w-[200px] aspect-[4/3] rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-600 flex flex-col items-center justify-center gap-2 transition group">
              <ChevronRight className="w-6 h-6 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition" />
              <span className="text-xs text-zinc-500 group-hover:text-zinc-300">See all</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default function McpHub() {
  useSEO({
    title: "MCP Server Directory — Browse 300+ Servers for Claude, Cursor, ChatGPT",
    description: "The open directory of Model Context Protocol servers. Search by category, find tools for your AI agent. List your own MCP server starting at 49 USDC.",
    canonical: "https://toolora.dev/mcp-hub",
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<CatCount[]>([]);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  // Debounce search input — 250ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // Filtered query — runs when debounced query, category, or refetch token changes
  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams();
    if (debouncedQ) params.set("q", debouncedQ);
    if (activeCategory !== "All") params.set("category", activeCategory);
    setLoading(true);
    setError(null);
    fetch(API + "/api/directory/listings?" + params.toString(), { signal: ctrl.signal })
      .then(async (r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((data) => {
        setListings(data.listings ?? []);
        if (data.categories) setCategories(data.categories);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError("Couldn't load the directory. Check your connection and try again.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [debouncedQ, activeCategory, refetchKey]);

  // Cache the full unfiltered set once for per-category rails on the homepage view
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(API + "/api/directory/listings?limit=400", { signal: ctrl.signal })
      .then(async (r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((data) => setAllListings(data.listings ?? []))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const isHomepage = activeCategory === "All" && !q.trim();
  const totalAll = useMemo(() => categories.reduce((s, c) => s + c.count, 0), [categories]);

  // Featured (with Toolora pinned first)
  const featured = useMemo(() => {
    const src = (allListings.length ? allListings : listings).filter((l) => l.featured);
    return src.some((l) => l.name.toLowerCase().includes("toolora")) ? src : [FEATURED_TOOLORA, ...src];
  }, [allListings, listings]);

  const spotlight = featured[0] ?? FEATURED_TOOLORA;
  const featuredRail = featured.slice(1);

  // Per-category rails — top 6 per category, sorted by featured first then alphabetic
  const categoryRails = useMemo(() => {
    if (!isHomepage || allListings.length === 0) return [] as { category: string; items: Listing[] }[];
    const order = categories
      .slice()
      .sort((a, b) => b.count - a.count)
      .map((c) => c.category);
    return order
      .map((cat) => {
        const items = allListings
          .filter((l) => l.category === cat && !l.featured)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 8);
        return { category: cat, items };
      })
      .filter((r) => r.items.length >= 3);
  }, [isHomepage, allListings, categories]);

  const allCategoriesList = ["All", ...categories.map((c) => c.category).sort()];

  return (
    <main className="relative">
      {/* Neutral dark background — fine grain noise via radial dots, no color */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-zinc-950">
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_center,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* ─── Editorial masthead ─────────────────────────── */}
        <header className="mb-10 md:mb-14 px-1 md:px-0">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[11px] font-mono text-violet-400 uppercase tracking-widest">MCP Hub</p>
            <span className="h-px flex-1 bg-zinc-700 max-w-[120px]" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 tracking-tight leading-[1.05] mb-4">
                The servers your agents wish they had.{" "}
                <span className="text-zinc-500">From a place you can trust.</span>
              </h1>
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                An open directory of Model Context Protocol servers — every entry installable in one click into Claude, Cursor, Windsurf, VS Code, and Continue. No telemetry on browse. No paywall on install. Built by independent makers, ranked by what people actually use.
              </p>
            </div>
            <Link
              href="/submit-mcp"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              List your server
            </Link>
          </div>
        </header>

        {/* ─── Spotlight hero ─────────────────────────────── */}
        <div className="mb-10">
          <SpotlightHero listing={spotlight} />
        </div>

        {/* ─── Big-number social proof slab ─────────────── */}
        <section aria-label="Directory at a glance" className="mb-12 md:mb-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-900/80 rounded-3xl overflow-hidden border border-zinc-900">
          {[
            { n: totalAll || 341, label: "MCP servers", sub: "Curated, browsable" },
            { n: 288, label: "Independent makers", sub: "Real GitHub authors" },
            { n: 5, label: "Editors supported", sub: "Claude, Cursor, Windsurf, VS Code, Continue" },
            { n: "1‑click", label: "Install", sub: "No CLI. No copy‑paste configs.", isString: true },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-950 p-6 md:p-8 flex flex-col justify-between min-h-[140px]">
              <div className="text-3xl md:text-5xl font-bold text-zinc-50 tracking-tight tabular-nums">
                {typeof stat.n === "number" && stat.n >= 100 ? `Over ${stat.n.toLocaleString()}` : stat.n}
              </div>
              <div className="mt-2">
                <div className="text-sm font-semibold text-zinc-200">{stat.label}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{stat.sub}</div>
              </div>
            </div>
          ))}
        </section>

        {/* ─── Search + filter bar (sticky) ──────────────── */}
        <div className="sticky top-0 z-20 -mx-4 px-4 mb-6 py-3 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-900/80">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" aria-hidden="true" />
            <label htmlFor="mcp-search" className="sr-only">Search MCP servers</label>
            <input
              id="mcp-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search MCP servers — Postgres, GitHub, browser automation…"
              aria-label="Search MCP servers"
              className="w-full rounded-full bg-zinc-900/80 border border-zinc-800 pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 outline-none transition"
            />
          </div>
          <div role="tablist" aria-label="Filter by category" className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-1 px-1">
            {allCategoriesList.map((c) => {
              const count = c === "All" ? totalAll : categories.find((x) => x.category === c)?.count ?? 0;
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-pressed={active}
                  aria-selected={active}
                  onClick={() => setActiveCategory(c)}
                  className={"shrink-0 rounded-full px-4 min-h-[36px] text-xs font-semibold transition border whitespace-nowrap active:scale-95 " + (active ? "bg-violet-500/25 border-violet-500/60 text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200")}
                >
                  {c} <span className="text-zinc-500 ml-1 font-normal">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Content ────────────────────────────────────── */}
        {error ? (
          <div className="text-center py-16">
            <p className="text-zinc-300 mb-3">{error}</p>
            <button onClick={() => setRefetchKey((k) => k + 1)} className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-semibold">Retry</button>
          </div>
        ) : loading && listings.length === 0 ? (
          <div className="space-y-8">
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shrink-0 w-[280px] aspect-[4/3] rounded-2xl bg-zinc-900/60 animate-pulse" />
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-zinc-900/60 animate-pulse" />
              ))}
            </div>
          </div>
        ) : isHomepage ? (
          <>
            {/* Featured rail */}
            {featuredRail.length > 0 && (
              <CategoryRail
                title="Featured"
                badge="Editor's Pick"
                items={featuredRail}
              />
            )}

            {/* Per-category rails */}
            {categoryRails.map(({ category, items }) => (
              <CategoryRail
                key={category}
                title={"Top in " + category}
                badge={CATEGORY_TAGLINE[category] ?? "Browse the category"}
                items={items}
                viewAllHref={`/mcp-hub/category/${mcpSlugify(category)}`}
              />
            ))}
          </>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            No servers match {q ? `"${q}"` : "this filter"}. <button onClick={() => { setQ(""); setActiveCategory("All"); }} className="text-violet-400 hover:underline">Clear filters</button>
          </div>
        ) : (
          <section>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider px-1">
              {listings.length} result{listings.length === 1 ? "" : "s"}
              {q && <span className="text-zinc-500"> for "{q}"</span>}
              {activeCategory !== "All" && <span className="text-zinc-500"> in {activeCategory}</span>}
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {listings.map((l) => <ListRow key={l.id} listing={l} />)}
            </div>
          </section>
        )}

        {/* ─── Editorial slab: Privacy & openness — light section with photo ─── */}
        <section className="mt-16 md:mt-24 rounded-3xl overflow-hidden relative bg-zinc-100 text-zinc-950">
          <div className="grid md:grid-cols-5">
            {/* Left: real photograph */}
            <div className="md:col-span-2 relative min-h-[260px] md:min-h-0">
              <img src={BASE + "images/mcp-privacy-light.png"} alt="Soft daylight through tall window blinds onto a clean concrete floor" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            {/* Right: editorial copy */}
            <div className="md:col-span-3 p-8 md:p-14">
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-4">Privacy &amp; openness</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
                Browse without being watched. Install without being locked in.
              </h2>
              <p className="text-base md:text-lg text-zinc-700 leading-relaxed mb-3">
                The directory runs on a privacy-by-default analytics model — installs are counted, you aren't. No cookies set on browse. No third-party trackers. No newsletter wall before you can see a server's name.
              </p>
              <p className="text-base md:text-lg text-zinc-700 leading-relaxed mb-8">
                Every listing links to its real source — the GitHub repo, the npm package, the maker's homepage. We don't middleman the install. We don't proxy the auth. The server in your client is the same server the maker shipped.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-5 border border-zinc-200 shadow-sm">
                  <div className="text-3xl md:text-4xl font-bold tracking-tight">0</div>
                  <div className="text-xs font-semibold mt-1">Trackers on /mcp-hub</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">No GA, no Hotjar, no FB pixel</div>
                </div>
                <div className="rounded-2xl bg-white p-5 border border-zinc-200 shadow-sm">
                  <div className="text-3xl md:text-4xl font-bold tracking-tight">100%</div>
                  <div className="text-xs font-semibold mt-1">Open source servers</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">Every link is the real source</div>
                </div>
                <div className="rounded-2xl bg-white p-5 border border-zinc-200 shadow-sm">
                  <div className="text-3xl md:text-4xl font-bold tracking-tight">CC‑BY</div>
                  <div className="text-xs font-semibold mt-1">Directory is free</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">agents.json is portable</div>
                </div>
                <div className="rounded-2xl bg-white p-5 border border-zinc-200 shadow-sm">
                  <div className="text-3xl md:text-4xl font-bold tracking-tight">USDC</div>
                  <div className="text-xs font-semibold mt-1">Crypto-first listing fee</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">No Stripe gate, works worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Trust strip ─────────────────────────────────── */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-center">
          <div className="rounded-full bg-zinc-900/60 border border-zinc-800 px-3.5 py-1.5 inline-flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-zinc-400">{totalAll} servers</span>
          </div>
          <div className="rounded-full bg-zinc-900/60 border border-zinc-800 px-3.5 py-1.5 inline-flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-zinc-400">{featured.length} featured</span>
          </div>
          <div className="rounded-full bg-zinc-900/60 border border-zinc-800 px-3.5 py-1.5 inline-flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-zinc-400">Listing fee 49 USDC</span>
          </div>
        </div>

        {/* ─── Author / agent shortcuts ──────────────────── */}
        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          <Link href="/mcp-hub/authors" className="group rounded-xl border border-amber-500/30 bg-zinc-900/40 hover:border-amber-400/60 p-4 flex items-center justify-between transition">
            <div>
              <p className="text-sm font-semibold text-zinc-100">Built one of these? Claim your listing</p>
              <p className="text-xs text-zinc-400 mt-0.5">Free analytics dashboard + README badge. 60-second GitHub bio verification, no email needed.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/agents" className="group rounded-xl border border-cyan-500/30 bg-zinc-900/40 hover:border-cyan-400/60 p-4 flex items-center justify-between transition">
            <div>
              <p className="text-sm font-semibold text-zinc-100">Building an agent? Read agents.json</p>
              <p className="text-xs text-zinc-400 mt-0.5">340+ MCP servers as a single CORS-enabled JSON feed, sorted by quality.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ─── Wedge promos — photo-backed editorial cards ─────── */}
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          <Link href="/host" className="group relative overflow-hidden rounded-2xl ring-1 ring-white/5 hover:ring-emerald-400/40 transition-all duration-500 shadow-lg min-h-[280px] flex flex-col justify-end">
            <img src={BASE + "images/mcp-host-bg.png"} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-700" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="relative p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 backdrop-blur px-2.5 py-0.5 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Coming Q2 2026</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-2xl md:text-3xl tracking-tight">Vercel for MCP servers</h3>
              <p className="text-sm md:text-base text-white/80 mb-4 max-w-md leading-snug">
                Skip the laptop. Host any open-source MCP server with a public URL, auth gate, and per-IP rate limits. Free for the first 1,000 calls a month — pay USDC after that.
              </p>
              <span className="text-xs font-semibold text-emerald-300 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Join the waitlist <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          <Link href="/x402" className="group relative overflow-hidden rounded-2xl ring-1 ring-white/5 hover:ring-yellow-400/40 transition-all duration-500 shadow-lg min-h-[280px] flex flex-col justify-end">
            <img src={BASE + "images/mcp-x402-bg.png"} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-700" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="relative p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-500/15 backdrop-blur px-2.5 py-0.5 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-200">Building now</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-2xl md:text-3xl tracking-tight">x402 pay-per-call marketplace</h3>
              <p className="text-sm md:text-base text-white/80 mb-4 max-w-md leading-snug">
                Charge agents per API call. USDC settlement straight to your wallet. The toll booth for the agent economy — built on the open x402 standard, no Stripe, no chargebacks.
              </p>
              <span className="text-xs font-semibold text-yellow-300 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Get early access <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        </div>

        {/* ─── Newsletter ─────────────────────────────────── */}
        <div className="mt-12">
          <NewsletterCapture source="mcp-weekly" />
        </div>

        {/* ─── Closing editorial: who & why ───────────────── */}
        <section className="mt-16 md:mt-20 px-1">
          <p className="text-[11px] font-mono text-violet-400 uppercase tracking-widest mb-3">Why this exists</p>
          <h2 className="text-2xl md:text-4xl font-bold text-zinc-50 tracking-tight leading-tight mb-4 max-w-3xl">
            Built for the makers who actually ship — and the agents that actually have to use what gets shipped.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 uppercase tracking-wider">For makers</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                A 49 USDC listing fee. No revenue share, no exclusivity, no committee approval. Your README badge updates every five minutes. You own your audience — not us, not a platform.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 uppercase tracking-wider">For agent builders</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Every server in this directory is in <Link href="/agents" className="text-violet-400 hover:text-violet-300 underline decoration-dotted underline-offset-4">agents.json</Link> — a single CORS-enabled JSON feed with quality signals and install metadata. Your agent can browse the catalog without a human in the loop.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 uppercase tracking-wider">For everyone else</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                A clean, honest browse. No login required. No tracking on the catalog. Find the server you came for, copy the install command, get back to whatever you were actually trying to do.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Submit CTA ────────────────────────────────── */}
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          <Link href="/submit-mcp" className="group relative overflow-hidden rounded-2xl ring-1 ring-violet-500/30 hover:ring-violet-400/60 transition shadow-lg min-h-[200px] flex flex-col justify-end">
            <img src={BASE + "images/mcp-cat-ai-llm.png"} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="relative p-6 md:p-8">
              <Plus className="w-7 h-7 text-violet-300 mb-3 group-hover:rotate-90 transition-transform duration-300" />
              <h3 className="font-bold text-white mb-2 text-xl tracking-tight">List your MCP server</h3>
              <p className="text-sm text-white/80 mb-3 max-w-sm leading-snug">Reach AI-agent developers worldwide. Auto-published the moment payment confirms. From 49 USDC. No revenue share, no exclusivity.</p>
              <span className="text-xs font-semibold text-violet-300 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Submit your server <ArrowRight className="w-3 h-3" /></span>
            </div>
          </Link>
          <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl ring-1 ring-zinc-800 hover:ring-zinc-600 transition shadow-lg min-h-[200px] flex flex-col justify-end">
            <img src={BASE + "images/mcp-cat-developer-tools.png"} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
            <div className="relative p-6 md:p-8">
              <Shield className="w-7 h-7 text-cyan-300 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-2 text-xl tracking-tight">New to MCP?</h3>
              <p className="text-sm text-white/80 mb-3 max-w-sm leading-snug">Read the official Model Context Protocol spec and learn how to connect any server to your AI client. The protocol is open, the spec is short, the examples actually work.</p>
              <span className="text-xs font-semibold text-cyan-300 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Open spec <ArrowRight className="w-3 h-3" /></span>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
