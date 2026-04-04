import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock, Mail, CheckCircle } from "lucide-react";
import { BLOG_POSTS, getPostImage } from "@/lib/blog-posts";
import { useSEO } from "@/hooks/useSEO";

function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch(`${BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog" }),
      });
      if (res.ok) setState("done");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-7 flex flex-col sm:flex-row items-center gap-5 my-10">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-primary" />
          New posts, straight to your inbox
        </p>
        <p className="text-xs text-muted-foreground">Privacy tools, MCP guides, and developer deep-dives. No spam. Unsubscribe anytime.</p>
      </div>
      {state === "done" ? (
        <div className="flex items-center gap-2 text-sm text-green-400 font-medium shrink-0">
          <CheckCircle className="w-4 h-4" /> You're in!
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2 w-full sm:w-auto shrink-0">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 sm:w-52 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 shrink-0"
          >
            {state === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}
      {state === "error" && <p className="text-xs text-red-400 mt-1">Something went wrong — try again.</p>}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const CATEGORY_COLORS: Record<string, string> = {
  "Privacy":         "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "Security":        "bg-red-500/15 text-red-300 border-red-500/30",
  "Developer":       "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "Developer Tools": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "AI Builders":     "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  "Tools":           "bg-green-500/15 text-green-300 border-green-500/30",
  "Productivity":    "bg-green-500/15 text-green-300 border-green-500/30",
  "Behind the Build":"bg-orange-500/15 text-orange-300 border-orange-500/30",
};

function CategoryBadge({ category }: { category: string }) {
  const cls = CATEGORY_COLORS[category] ?? "bg-zinc-500/15 text-zinc-300 border-zinc-500/30";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${cls}`}>
      {category}
    </span>
  );
}

export default function Blog() {
  const sorted = [...BLOG_POSTS].reverse();
  const categories = ["All", ...Array.from(new Set(sorted.map(p => p.category)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? sorted : sorted.filter(p => p.category === active);
  const [featured, ...rest] = filtered;

  useSEO({
    title: "Blog — Privacy, Security & Developer Tool Insights | Toolora",
    description: "Guides, tutorials, and deep dives on browser-based privacy tools, MCP servers, developer utilities, and secure document processing — from the Toolora team.",
    canonical: "https://toolora.dev/blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": "https://toolora.dev/blog",
          name: "Toolora Blog",
          url: "https://toolora.dev/blog",
          description: "Privacy, security, and developer tool articles from the Toolora team.",
          publisher: { "@type": "Organization", name: "Toolora", url: "https://toolora.dev" },
          hasPart: sorted.map(p => ({
            "@type": "Article",
            headline: p.title,
            url: `https://toolora.dev/blog/${p.slug}`,
            datePublished: p.date,
          })),
        },
      ],
    },
  });

  return (
    <div className="w-full">

      {/* ── Full-bleed hero ── */}
      <section className="relative h-[320px] overflow-hidden">
        <img
          src="/images/blog-hero.png"
          alt="Toolora Blog"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/95" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 gap-3">
          <p className="text-xs font-mono text-primary uppercase tracking-widest">Toolora Blog</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold drop-shadow-lg">Writing about privacy, AI tools,<br className="hidden md:block" /> and the open web.</h1>
          <p className="text-muted-foreground text-base max-w-xl">{sorted.length} articles · updated weekly</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Category tabs ── */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-border pb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-16">No posts in this category yet.</p>
        )}

        {/* ── Featured post ── */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block group mb-10">
            <article className="rounded-2xl border border-border hover:border-primary/40 overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-primary/10 grid md:grid-cols-2">
              <div className="relative h-56 md:h-auto overflow-hidden bg-muted">
                <img
                  src={getPostImage(featured.slug, featured.category)}
                  alt={featured.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="p-8 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={featured.category} />
                  <span className="text-xs text-muted-foreground">Featured</span>
                </div>
                <h2 className="text-2xl font-display font-bold leading-snug group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {featured.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(featured.date)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-1">
                  Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          </Link>
        )}

        {/* ── Newsletter ── */}
        <NewsletterStrip />

        {/* ── Post grid ── */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article className="rounded-2xl border border-border hover:border-primary/40 overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={getPostImage(post.slug, post.category)}
                      alt={post.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <CategoryBadge category={post.category} />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(post.date)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <h2 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 flex-1">
                      {post.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-auto pt-2">
                      Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
