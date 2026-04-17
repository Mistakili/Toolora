import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, Sparkles, ExternalLink, Zap, Shield, ArrowRight, Plus, TrendingUp, Boxes, Crown } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { mcpSlugify } from "@/lib/mcpSlug";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

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

// Stable color per category for visual identity.
const CATEGORY_GRADIENTS: Record<string, string> = {
  "Developer Tools": "from-blue-500/30 to-cyan-500/20",
  "Data": "from-emerald-500/30 to-teal-500/20",
  "AI/LLM": "from-violet-500/30 to-fuchsia-500/20",
  "Productivity": "from-amber-500/30 to-orange-500/20",
  "Marketing": "from-pink-500/30 to-rose-500/20",
  "Finance": "from-yellow-500/30 to-amber-500/20",
  "Other": "from-zinc-500/30 to-zinc-700/20",
};

function gradientFor(category: string): string {
  return CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.Other;
}

function ListingCard({ listing }: { listing: Listing }) {
  const isFeatured = listing.featured;
  const slug = mcpSlugify(listing.name);
  const grad = gradientFor(listing.category);

  return (
    <Link
      href={`/mcp-hub/server/${slug}`}
      className={
        "group relative block rounded-2xl border p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 " +
        (isFeatured
          ? "border-violet-500/40 bg-zinc-900/60 hover:border-violet-400/70 shadow-[0_0_0_1px_rgba(139,92,246,0.1)] hover:shadow-[0_8px_40px_-4px_rgba(139,92,246,0.45)]"
          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]")
      }
    >
      {/* Animated gradient blob — hover reveals */}
      <div className={"pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br " + grad + " blur-2xl -z-0"} />

      {/* Featured shimmer */}
      {isFeatured && (
        <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-2xl">
          <div className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent,rgba(139,92,246,0.15),transparent_30%)] animate-[spin_8s_linear_infinite]" />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <div className={"w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-base font-bold bg-gradient-to-br " + grad + " text-white shadow-lg"}>
            {listing.logoUrl
              ? <img src={listing.logoUrl} alt="" className="w-full h-full rounded-xl object-cover" />
              : <span className="drop-shadow">{listing.name.charAt(0)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-zinc-100 truncate group-hover:text-white">{listing.name}</h3>
              {isFeatured && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-200 border border-violet-500/40 font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> FEATURED
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-500">{listing.category}</span>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 group-hover:text-zinc-300">{listing.tagline}</p>
      </div>
    </Link>
  );
}

function StatPill({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-zinc-900/70 backdrop-blur border border-zinc-800 px-3.5 py-1.5">
      <Icon className="w-3.5 h-3.5 text-violet-400" />
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-xs font-semibold text-zinc-100">{value}</span>
    </div>
  );
}

export default function McpHub() {
  useSEO({
    title: "MCP Server Directory — Browse 30+ Servers for Claude, Cursor, ChatGPT",
    description: "The open directory of Model Context Protocol servers. Search by category, find tools for your AI agent. List your own MCP server starting at 49 USDC.",
    canonical: "https://toolora.dev/mcp-hub",
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<CatCount[]>([]);
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
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
  }, [q, activeCategory]);

  const totalAll = useMemo(() => categories.reduce((s, c) => s + c.count, 0), [categories]);
  const featuredCount = useMemo(() => listings.filter((l) => l.featured).length, [listings]);
  const isHomepage = activeCategory === "All" && !q.trim();
  const featured = useMemo(() => listings.filter((l) => l.featured), [listings]);
  const standard = useMemo(() => listings.filter((l) => !l.featured), [listings]);

  const featuredWithToolora = featured.some((l) => l.name.toLowerCase().includes("toolora"))
    ? featured
    : [FEATURED_TOOLORA, ...featured];

  const allCategories = ["All", ...categories.map((c) => c.category).sort()];

  return (
    <main className="relative">
      {/* ─── Animated background ───────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Aurora orbs */}
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/15 blur-[100px] animate-[pulse_10s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] rounded-full bg-blue-600/15 blur-[140px] animate-[pulse_12s_ease-in-out_infinite_2s]" />
        {/* Grid mask */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* ─── Hero ─────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">Toolora MCP Hub · Live on mainnet</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5 bg-gradient-to-br from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-[1.05]">
            The App Store for<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">MCP servers</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-7 leading-relaxed">
            Browse {totalAll || "30+"} Model Context Protocol servers. Plug them into Claude, Cursor,
            ChatGPT, or any AI agent. <span className="text-zinc-200">Free to browse — list yours from 49 USDC.</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
            <StatPill icon={Boxes} label="Servers" value={String(totalAll || 36)} />
            <StatPill icon={Crown} label="Featured" value={String(featuredCount || 2)} />
            <StatPill icon={TrendingUp} label="Listing fee" value="49 USDC" />
          </div>

          <Link
            href="/submit-mcp"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            List your MCP server
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ─── Marquee of category badges ──────────────────── */}
        {categories.length > 0 && (
          <div className="relative overflow-hidden mb-12 mask-fade-x">
            <div className="flex gap-3 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
              {[...categories, ...categories, ...categories].map((c, i) => (
                <Link
                  key={i}
                  href={`/mcp-hub/category/${mcpSlugify(c.category)}`}
                  className={"shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border bg-gradient-to-br " + gradientFor(c.category) + " border-white/10 text-white/90 hover:scale-105 transition"}
                >
                  {c.category}
                  <span className="text-white/60">{c.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ─── Sticky search + filter bar ──────────────────── */}
        <div className="sticky top-0 z-20 -mx-4 px-4 mb-10 py-4 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-900/80">
          <div className="relative mb-4 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search MCP servers — Postgres, GitHub, browser automation…"
              className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 pl-11 pr-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 outline-none transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {allCategories.map((c) => {
              const count = c === "All" ? totalAll : categories.find((x) => x.category === c)?.count ?? 0;
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={"shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition border " + (active ? "bg-violet-500/25 border-violet-500/50 text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200")}
                >
                  {c} <span className="text-zinc-500 ml-1">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Listings ────────────────────────────────────── */}
        {error ? (
          <div className="text-center py-16">
            <p className="text-zinc-300 mb-3">{error}</p>
            <button onClick={() => { setQ(q); setActiveCategory(activeCategory); }} className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-semibold">Retry</button>
          </div>
        ) : loading && listings.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            No servers match {q ? `"${q}"` : "this filter"}. <button onClick={() => { setQ(""); setActiveCategory("All"); }} className="text-violet-400 hover:underline">Clear filters</button>
          </div>
        ) : (
          <>
            {isHomepage && featuredWithToolora.length > 0 && (
              <section className="mb-12">
                <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-violet-400" /> Featured
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {featuredWithToolora.map((l) => <ListingCard key={l.id} listing={l} />)}
                </div>
              </section>
            )}

            <section>
              {isHomepage && standard.length > 0 && (
                <h2 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">All servers</h2>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(isHomepage ? standard : listings).map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            </section>
          </>
        )}

        {/* ─── CTAs ────────────────────────────────────────── */}
        <div className="mt-20 grid md:grid-cols-3 gap-4">
          <Link href="/submit-mcp" className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/60 to-zinc-900/60 p-6 hover:border-violet-400/60 transition shadow-lg hover:shadow-violet-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-fuchsia-600/0 group-hover:from-violet-600/10 group-hover:to-fuchsia-600/10 transition-all" />
            <Plus className="relative w-7 h-7 text-violet-400 mb-3 group-hover:rotate-90 transition-transform duration-300" />
            <h3 className="relative font-semibold text-zinc-100 mb-1.5">List your MCP server</h3>
            <p className="relative text-sm text-zinc-400 mb-3">Reach 1,400+ AI agent developers. Auto-published the moment payment confirms.</p>
            <span className="relative text-xs text-violet-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">From 49 USDC <ArrowRight className="w-3 h-3" /></span>
          </Link>
          <Link href="/sponsor" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 hover:bg-zinc-900/60 transition">
            <Sparkles className="w-7 h-7 text-violet-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-zinc-100 mb-1.5">Sponsor the directory</h3>
            <p className="text-sm text-zinc-400 mb-3">Featured slot, footer rotation, or newsletter. Pay in USDC.</p>
            <span className="text-xs text-violet-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">View slots <ArrowRight className="w-3 h-3" /></span>
          </Link>
          <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 hover:bg-zinc-900/60 transition">
            <Shield className="w-7 h-7 text-violet-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-zinc-100 mb-1.5">New to MCP?</h3>
            <p className="text-sm text-zinc-400 mb-3">Read the official spec and learn how to connect any server to your AI client.</p>
            <span className="text-xs text-violet-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Open spec <ArrowRight className="w-3 h-3" /></span>
          </a>
        </div>

        <div className="mt-12 relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-950/60 p-8 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.15),transparent_60%)]" />
          <Zap className="relative w-7 h-7 text-violet-400 mx-auto mb-3" />
          <h3 className="relative font-semibold text-zinc-100 mb-2 text-lg">Already running an MCP server?</h3>
          <p className="relative text-sm text-zinc-400 mb-5">List it permanently from 49 USDC. Featured tier from 99 USDC/30 days.</p>
          <Link href="/submit-mcp" className="relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/30">
            Submit your server <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
