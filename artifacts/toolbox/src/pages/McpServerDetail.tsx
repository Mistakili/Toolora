import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ExternalLink, Sparkles, Plus, BarChart3, Code2, Check, Copy } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { mcpSlugify } from "@/lib/mcpSlug";
import { AddToClient } from "@/components/AddToClient";
import { NewsletterCapture } from "@/components/NewsletterCapture";
import NotFound from "./not-found";

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

export default function McpServerDetail() {
  const [, params] = useRoute("/mcp-hub/server/:slug");
  const slug = params?.slug ?? "";
  const [listing, setListing] = useState<Listing | null>(null);
  const [related, setRelated] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(API + "/api/directory/listings/" + encodeURIComponent(slug))
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setListing(data.listing);
        setRelated(data.related ?? []);
        // Fire-and-forget view event for owner analytics.
        fetch(API + "/api/directory/listings/" + encodeURIComponent(slug) + "/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "view" }),
          keepalive: true,
        }).catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const trackVisit = () => {
    if (!slug) return;
    fetch(API + "/api/directory/listings/" + encodeURIComponent(slug) + "/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "visit" }),
      keepalive: true,
    }).catch(() => {});
  };

  useSEO({
    title: listing
      ? `${listing.name} — MCP server for Claude, Cursor & ChatGPT`
      : "MCP server — Toolora MCP Hub",
    description: listing
      ? `${listing.tagline} Free to install. Browse 30+ MCP servers in the Toolora directory.`
      : "Loading MCP server details from the Toolora MCP Hub directory.",
    canonical: listing ? `https://toolora.dev/mcp-hub/server/${slug}` : undefined,
    jsonLd: listing
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: listing.name,
          applicationCategory: "DeveloperApplication",
          description: listing.tagline,
          operatingSystem: "Cross-platform",
          url: listing.url,
        }
      : undefined,
  });

  if (notFound) return <NotFound />;
  if (loading || !listing) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="h-8 w-2/3 bg-zinc-900 rounded mb-4 animate-pulse" />
        <div className="h-4 w-full bg-zinc-900 rounded mb-2 animate-pulse" />
        <div className="h-4 w-5/6 bg-zinc-900 rounded animate-pulse" />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/mcp-hub" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to MCP Hub
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className={"w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 " + (listing.featured ? "bg-violet-500/20 text-violet-300" : "bg-zinc-800 text-zinc-300")}>
          {listing.logoUrl ? <img src={listing.logoUrl} alt="" className="w-full h-full rounded-xl object-cover" /> : listing.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-3xl font-bold text-zinc-100">{listing.name}</h1>
            {listing.featured && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> FEATURED
              </span>
            )}
          </div>
          <Link href={`/mcp-hub/category/${listing.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-xs text-violet-400 hover:underline">{listing.category}</Link>
        </div>
      </div>

      <p className="text-lg text-zinc-300 mb-2 leading-relaxed">{listing.tagline}</p>
      {listing.description && listing.description !== listing.tagline && (
        <p className="text-zinc-400 mb-8 leading-relaxed">{listing.description}</p>
      )}

      <div className="flex flex-wrap gap-3 mb-10">
        <a onClick={trackVisit} href={listing.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-semibold">
          Visit project <ExternalLink className="w-3.5 h-3.5" />
        </a>
        {listing.configUrl && (
          <a onClick={trackVisit} href={listing.configUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-4 py-2 text-sm font-medium">
            Config / endpoint <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className="mb-10">
        <AddToClient
          slug={slug}
          serverName={listing.name}
          serverUrl={listing.url}
          configUrl={listing.configUrl}
        />
      </div>

      <BadgeAndOwnerSection slug={slug} name={listing.name} />

      <div className="mb-10">
        <NewsletterCapture source="mcp-weekly" category={listing.category} />
      </div>

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">More in {listing.category}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <Link key={r.id} href={`/mcp-hub/server/${mcpSlugify(r.name)}`} className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition">
                <div className="font-medium text-zinc-100 text-sm mb-1">{r.name}</div>
                <p className="text-xs text-zinc-400 line-clamp-2">{r.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-6 text-center">
        <Plus className="w-6 h-6 text-violet-400 mx-auto mb-2" />
        <h3 className="font-semibold text-zinc-100 mb-1">Run an MCP server?</h3>
        <p className="text-sm text-zinc-400 mb-4">List it in this directory from 49 USDC. Featured tier from 99 USDC/30 days. Get install analytics, an embed badge, and a feature slot in MCP Weekly.</p>
        <Link href="/submit-mcp" className="inline-flex rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-semibold">
          Submit your server →
        </Link>
      </section>
    </main>
  );
}

function BadgeAndOwnerSection({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState<"md" | "html" | "url" | null>(null);
  const badgeUrl = `https://toolora.dev/api/directory/badge/${slug}.svg`;
  const detailUrl = `https://toolora.dev/mcp-hub/server/${slug}`;
  const md = `[![Listed on toolora.dev](${badgeUrl})](${detailUrl})`;
  const html = `<a href="${detailUrl}"><img src="${badgeUrl}" alt="Listed on toolora.dev"></a>`;

  const copy = async (kind: "md" | "html" | "url", text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2 mb-1">
            <Code2 className="w-4 h-4 text-emerald-400" /> README badge
          </h2>
          <p className="text-xs text-zinc-400">Add this to your repo for backlink + social proof. Counts toward your install analytics.</p>
        </div>
        <Link href={`/mcp-hub/owner/${slug}`} className="inline-flex items-center gap-1.5 text-xs text-violet-300 hover:text-violet-200 border border-violet-500/30 bg-violet-500/10 rounded-md px-2.5 py-1.5">
          <BarChart3 className="w-3.5 h-3.5" /> Owner of {name}? See analytics
        </Link>
      </div>
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
        <img src={badgeUrl} alt="Listed on toolora.dev badge preview" className="h-5" />
        <span className="text-xs text-zinc-500">live preview</span>
      </div>
      <div className="space-y-2">
        {([
          { kind: "md" as const, label: "Markdown", value: md },
          { kind: "html" as const, label: "HTML", value: html },
        ]).map((row) => (
          <div key={row.kind} className="flex items-stretch gap-2">
            <div className="flex-1 min-w-0 rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-nowrap">{row.value}</div>
            <button onClick={() => copy(row.kind, row.value)} className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-3 py-2 text-xs font-medium">
              {copied === row.kind ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> {row.label}</>}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
