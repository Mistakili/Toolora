import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, Sparkles, ExternalLink, Zap, Shield, ArrowRight, Plus } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

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

function ListingCard({ listing }: { listing: Listing }) {
  const isFeatured = listing.featured;
  return (
    <a
      href={listing.url}
      target="_blank"
      rel="noopener noreferrer"
      className={"group block rounded-xl border p-5 transition-all hover:-translate-y-0.5 " + (isFeatured ? "border-violet-500/50 bg-gradient-to-br from-violet-950/40 to-zinc-900/50 hover:border-violet-400" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700")}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={"w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-base font-bold " + (isFeatured ? "bg-violet-500/20 text-violet-300" : "bg-zinc-800 text-zinc-400")}>
          {listing.logoUrl ? <img src={listing.logoUrl} alt="" className="w-full h-full rounded-lg object-cover" /> : listing.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-zinc-100 truncate">{listing.name}</h3>
            {isFeatured && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> FEATURED
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-500">{listing.category}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 shrink-0" />
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{listing.tagline}</p>
    </a>
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
      .then(async (r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
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
  const isHomepage = activeCategory === "All" && !q.trim();
  const featured = useMemo(() => listings.filter((l) => l.featured), [listings]);
  const standard = useMemo(() => listings.filter((l) => !l.featured), [listings]);

  // Inject Toolora as featured at top of homepage view only.
  const featuredWithToolora = featured.some((l) => l.name.toLowerCase().includes("toolora"))
    ? featured
    : [FEATURED_TOOLORA, ...featured];

  const allCategories = ["All", ...categories.map((c) => c.category).sort()];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Toolora MCP Hub</p>
        <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 mb-4">
          The App Store for <span className="text-violet-400">MCP servers</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-6">
          Browse {totalAll || "30+"} Model Context Protocol servers. Plug them into Claude, Cursor,
          ChatGPT, or any AI agent. Free to browse — list yours from 49 USDC.
        </p>
        <Link
          href="/submit-mcp"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 text-sm font-semibold transition"
        >
          <Plus className="w-4 h-4" /> List your MCP server
        </Link>
      </div>

      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur py-4 -mx-4 px-4 mb-8 border-b border-zinc-900">
        <div className="relative mb-4 max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search MCP servers — Postgres, GitHub, browser automation…"
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500 outline-none"
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
                className={"shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition border " + (active ? "bg-violet-500/20 border-violet-500/40 text-violet-200" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700")}
              >
                {c} <span className="text-zinc-500 ml-1">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="text-center py-16">
          <p className="text-zinc-300 mb-3">{error}</p>
          <button onClick={() => { setQ(q); setActiveCategory(activeCategory); }} className="rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-semibold">Retry</button>
        </div>
      ) : loading && listings.length === 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          No servers match {q ? `"${q}"` : "this filter"}. <button onClick={() => { setQ(""); setActiveCategory("All"); }} className="text-violet-400 hover:underline">Clear filters</button>
        </div>
      ) : (
        <>
          {isHomepage && featuredWithToolora.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" /> Featured
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {featuredWithToolora.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            </section>
          )}

          <section>
            {isHomepage && standard.length > 0 && (
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">All servers</h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* When filtering/searching, show ALL matching results (featured + standard) inline so featured items aren't hidden. */}
              {(isHomepage ? standard : listings).map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </section>
        </>
      )}

      <div className="mt-16 grid md:grid-cols-3 gap-4">
        <Link href="/submit-mcp" className="group rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-6 hover:border-violet-400/50 transition">
          <Plus className="w-6 h-6 text-violet-400 mb-3" />
          <h3 className="font-semibold text-zinc-100 mb-1.5">List your MCP server</h3>
          <p className="text-sm text-zinc-400 mb-3">Reach 1,400+ AI agent developers. Auto-published the moment payment confirms.</p>
          <span className="text-xs text-violet-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">From 49 USDC <ArrowRight className="w-3 h-3" /></span>
        </Link>
        <Link href="/sponsor" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
          <Sparkles className="w-6 h-6 text-violet-400 mb-3" />
          <h3 className="font-semibold text-zinc-100 mb-1.5">Sponsor the directory</h3>
          <p className="text-sm text-zinc-400 mb-3">Featured slot, footer rotation, or newsletter. Pay in USDC.</p>
          <span className="text-xs text-violet-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">View slots <ArrowRight className="w-3 h-3" /></span>
        </Link>
        <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
          <Shield className="w-6 h-6 text-violet-400 mb-3" />
          <h3 className="font-semibold text-zinc-100 mb-1.5">New to MCP?</h3>
          <p className="text-sm text-zinc-400 mb-3">Read the official spec and learn how to connect any server to your AI client.</p>
          <span className="text-xs text-violet-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">Open spec <ArrowRight className="w-3 h-3" /></span>
        </a>
      </div>

      <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center">
        <Zap className="w-6 h-6 text-violet-400 mx-auto mb-2" />
        <h3 className="font-semibold text-zinc-100 mb-2">Already running an MCP server?</h3>
        <p className="text-sm text-zinc-400 mb-4">List it permanently from 49 USDC. Featured tier from 99 USDC/30 days.</p>
        <Link href="/submit-mcp" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-semibold">
          Submit your server →
        </Link>
      </div>
    </main>
  );
}
