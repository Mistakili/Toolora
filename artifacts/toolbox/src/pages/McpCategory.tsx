import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { MCP_CATEGORIES, categorySlugToDb, mcpSlugify } from "@/lib/mcpSlug";
import NotFound from "./not-found";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

interface Listing {
  id: string;
  name: string;
  tagline: string;
  url: string;
  category: string;
  featured: boolean;
}

export default function McpCategory() {
  const [, params] = useRoute("/mcp-hub/category/:slug");
  const slug = params?.slug ?? "";
  const meta = MCP_CATEGORIES.find((c) => c.slug === slug);
  const dbCategory = categorySlugToDb(slug);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbCategory) return;
    fetch(API + "/api/directory/listings?category=" + encodeURIComponent(dbCategory))
      .then((r) => r.json())
      .then((data) => setListings(data.listings ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [dbCategory]);

  useSEO({
    title: meta ? `${meta.label} MCP servers — Browse the Toolora directory` : "MCP category",
    description: meta ? `${meta.blurb} Free to browse, list yours from 49 USDC.` : undefined,
    canonical: meta ? `https://toolora.dev/mcp-hub/category/${slug}` : undefined,
  });

  if (!meta || !dbCategory) return <NotFound />;

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/mcp-hub" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
        <ArrowLeft className="w-4 h-4" /> All MCP servers
      </Link>
      <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">{meta.label} MCP servers</h1>
      <p className="text-lg text-zinc-400 max-w-2xl mb-10">{meta.blurb}</p>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 h-32 animate-pulse" />)}
        </div>
      ) : listings.length === 0 ? (
        <p className="text-zinc-500">No servers in this category yet. <Link href="/submit-mcp" className="text-violet-400 hover:underline">Be the first to list one →</Link></p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/mcp-hub/server/${mcpSlugify(l.name)}`}
              className={"group block rounded-xl border p-5 transition-all hover:-translate-y-0.5 " + (l.featured ? "border-violet-500/50 bg-gradient-to-br from-violet-950/40 to-zinc-900/50" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700")}
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-zinc-100">{l.name}</h3>
                {l.featured && <Sparkles className="w-3.5 h-3.5 text-violet-400" />}
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600 ml-auto group-hover:text-violet-400" />
              </div>
              <p className="text-sm text-zinc-400 line-clamp-3">{l.tagline}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-16 grid md:grid-cols-2 gap-3">
        {MCP_CATEGORIES.filter((c) => c.slug !== slug).map((c) => (
          <Link key={c.slug} href={`/mcp-hub/category/${c.slug}`} className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition">
            <div className="font-medium text-zinc-100 text-sm mb-1">{c.label} MCP servers</div>
            <p className="text-xs text-zinc-400 line-clamp-2">{c.blurb}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
