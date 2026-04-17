import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Crown, Plus } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { MCP_BEST_OF, mcpSlugify } from "@/lib/mcpSlug";
import NotFound from "./not-found";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

interface Listing { id: string; name: string; url: string; tagline: string; category: string }

export default function McpBestOf() {
  const [, params] = useRoute("/mcp-hub/best/:slug");
  const slug = params?.slug ?? "";
  const guide = MCP_BEST_OF.find((g) => g.slug === slug);
  const [byName, setByName] = useState<Record<string, Listing>>({});

  useEffect(() => {
    if (!guide) return;
    fetch(API + "/api/directory/listings")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, Listing> = {};
        for (const l of (data.listings ?? []) as Listing[]) map[l.name.toLowerCase()] = l;
        setByName(map);
      })
      .catch(() => {});
  }, [guide]);

  useSEO({
    title: guide ? `${guide.title} — Toolora MCP Hub` : "Best MCP servers",
    description: guide ? guide.intro : undefined,
    canonical: guide ? `https://toolora.dev/mcp-hub/best/${slug}` : undefined,
    jsonLd: guide
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: guide.title,
          itemListElement: guide.picks.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            description: p.why,
          })),
        }
      : undefined,
  });

  if (!guide) return <NotFound />;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/mcp-hub" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
        <ArrowLeft className="w-4 h-4" /> All MCP servers
      </Link>
      <div className="flex items-center gap-2 text-violet-400 text-xs uppercase tracking-widest mb-3">
        <Crown className="w-3.5 h-3.5" /> Curated guide
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 leading-tight">{guide.title}</h1>
      <p className="text-lg text-zinc-400 mb-10 leading-relaxed">{guide.intro}</p>

      <ol className="space-y-5 mb-12">
        {guide.picks.map((p, i) => {
          const listing = byName[p.name.toLowerCase()];
          const slugified = mcpSlugify(p.name);
          return (
            <li key={p.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex gap-4">
              <div className="w-9 h-9 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-semibold text-zinc-100">{p.name}</h2>
                  {listing && (
                    <Link href={`/mcp-hub/server/${slugified}`} className="text-xs text-violet-400 hover:underline">View details →</Link>
                  )}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.why}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 mb-8">
        <h2 className="font-semibold text-zinc-100 mb-3 text-sm">More guides</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {MCP_BEST_OF.filter((g) => g.slug !== slug).map((g) => (
            <Link key={g.slug} href={`/mcp-hub/best/${g.slug}`} className="block rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 hover:border-zinc-700 transition">
              <div className="text-sm font-medium text-zinc-100 line-clamp-2">{g.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-6 text-center">
        <Plus className="w-6 h-6 text-violet-400 mx-auto mb-2" />
        <h3 className="font-semibold text-zinc-100 mb-1">Should your server be on this list?</h3>
        <p className="text-sm text-zinc-400 mb-4">List it in the directory from 49 USDC. Featured tier from 99 USDC/30 days.</p>
        <Link href="/submit-mcp" className="inline-flex rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-semibold">
          Submit your server →
        </Link>
      </section>
    </main>
  );
}
