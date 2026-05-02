import { useParams, Link } from "wouter";
import { useEffect, useMemo } from "react";
import { ChevronRight, CheckCircle2, ArrowRight, ShieldCheck, Zap, Globe, BookOpen, BarChart2, FileText } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { getHowToGuide } from "@/lib/tool-how-to";
import { getToolBySlug } from "@/lib/tools-config";
import { getToolGlossary, getToolComparisons } from "@/lib/cross-links";
import { getGlossaryEntry } from "@/lib/glossary";
import { getComparison } from "@/lib/comparisons";
import { BLOG_POSTS } from "@/lib/blog-posts";
import NotFound from "./not-found";

// Match up to 3 blog posts whose title or slug contains any of the tool's
// signal keywords (the tool's slug parts + name words). Pure heuristic — keeps
// the cross-link surface high without wiring a manual mapping for every tool.
function findRelatedBlogPosts(toolSlug: string, toolName: string, limit = 3) {
  const stop = new Set(["the","a","an","and","or","of","to","for","in","on","tool","online","free"]);
  const tokens = new Set(
    [...toolSlug.toLowerCase().split(/[-_]/), ...toolName.toLowerCase().split(/\s+/)]
      .map((t) => t.replace(/[^a-z0-9]/g, ""))
      .filter((t) => t.length >= 3 && !stop.has(t)),
  );
  if (tokens.size === 0) return [];
  const scored: Array<{ post: typeof BLOG_POSTS[number]; score: number }> = [];
  for (const post of BLOG_POSTS) {
    const haystack = `${post.slug} ${post.title} ${post.description}`.toLowerCase();
    let score = 0;
    for (const t of tokens) if (haystack.includes(t)) score++;
    if (score > 0) scored.push({ post, score });
  }
  scored.sort((a, b) => b.score - a.score || (b.post.date.localeCompare(a.post.date)));
  return scored.slice(0, limit).map((s) => s.post);
}

export default function ToolHowToPage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = getHowToGuide(slug);
  const tool = guide ? getToolBySlug(guide.toolSlug) : undefined;

  useSEO({
    title: guide?.metaTitle ?? "How-To Guide | Toolora",
    description: guide?.metaDescription ?? "",
    canonical: guide ? `https://toolora.dev/how-to/${guide.slug}` : undefined,
    type: "article",
  });

  useEffect(() => {
    if (!guide) return;
    const id = "how-to-jsonld";
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": guide.faq.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": { "@type": "Answer", "text": item.a },
      })),
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": guide.headline,
      "description": guide.intro,
      "step": guide.steps.map((step, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": step.title,
        "text": step.description,
      })),
    };

    const el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    el.textContent = JSON.stringify([faqSchema, howToSchema]);
    document.head.appendChild(el);

    return () => { document.getElementById(id)?.remove(); };
  }, [guide]);

  if (!guide || !tool) return <NotFound />;

  const toolUrl = `/tools/${tool.category}/${tool.slug}`;

  const glossarySlugs = getToolGlossary(guide.toolSlug);
  const glossaryEntries = glossarySlugs.map(s => getGlossaryEntry(s)).filter(Boolean);

  const comparisonSlugs = getToolComparisons(guide.toolSlug);
  const comparisonEntries = comparisonSlugs.map(s => getComparison(s)).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/blog" className="hover:text-foreground transition-colors">Guides</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{guide.toolName}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
          How-To Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{guide.headline}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{guide.intro}</p>
        <div className="mt-6">
          <Link
            href={toolUrl}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Open {guide.toolName} Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Steps */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">Step-by-Step: How to Use {guide.toolName}</h2>
        <div className="space-y-4">
          {guide.steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <div className="pt-1">
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy callout */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 mb-12 flex gap-4">
        <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground">100% Private — Nothing Leaves Your Browser</p>
          <p className="text-sm text-muted-foreground mt-1">
            All Toolora tools run entirely as client-side code. Your data is never uploaded to any server, stored, or logged.
            This makes Toolora safe for sensitive documents, credentials, and confidential content.
          </p>
        </div>
      </div>

      {/* Use cases */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">When to Use the {guide.toolName}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guide.useCases.map((uc, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="flex items-start gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="font-semibold text-sm">{uc.title}</p>
              </div>
              <p className="text-muted-foreground text-sm pl-6">{uc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-12 text-center">
        <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-2">Ready to try it?</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {guide.toolName} is free, instant, and requires no sign-up. Open it now and get your result in seconds.
        </p>
        <Link
          href={toolUrl}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Open {guide.toolName} — Free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {guide.faq.map((item, i) => (
            <div key={i} className="border-b border-border pb-5 last:border-0">
              <p className="font-semibold text-foreground mb-2">{item.q}</p>
              <p className="text-muted-foreground text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related tools */}
      {guide.relatedSlugs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Related Tools</h2>
          <div className="flex flex-wrap gap-2">
            {guide.relatedSlugs.map((relSlug) => {
              const relTool = getToolBySlug(relSlug);
              if (!relTool) return null;
              return (
                <Link
                  key={relSlug}
                  href={`/how-to/${relSlug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm hover:border-primary/50 hover:bg-muted transition-colors"
                >
                  <Globe className="w-3 h-3 text-muted-foreground" />
                  {relTool.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Key concepts — Glossary */}
      {glossaryEntries.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" /> Key Concepts
          </h2>
          <div className="flex flex-wrap gap-2">
            {glossaryEntries.map((g) => (
              <Link
                key={g!.slug}
                href={`/glossary/${g!.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm hover:border-primary/50 hover:bg-muted transition-colors"
              >
                {g!.term}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Comparison links */}
      {comparisonEntries.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-muted-foreground" /> See How We Compare
          </h2>
          <div className="flex flex-wrap gap-2">
            {comparisonEntries.map((c) => (
              <Link
                key={c!.slug}
                href={`/compare/${c!.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm hover:border-primary/50 hover:bg-muted transition-colors"
              >
                {c!.headline}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related reading — pulls 3 blog posts that match the tool by keyword.
          This is the one cross-link that points OUT to the blog, deliberately.
          The blog has 108 posts and very little inbound traffic; tool pages
          have orders of magnitude more views, so every how-to page that links
          a related post is a free traffic flywheel. */}
      <RelatedBlogPosts toolSlug={tool.slug} toolName={tool.name} />

      {/* Footer note */}
      <div className="pt-8 border-t border-border text-center text-xs text-muted-foreground">
        <p>
          All tools on{" "}
          <Link href="/" className="text-primary hover:underline">Toolora</Link>{" "}
          are free, browser-based, and privacy-first. No account required.
        </p>
      </div>
    </div>
  );
}

function RelatedBlogPosts({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const posts = useMemo(() => findRelatedBlogPosts(toolSlug, toolName, 3), [toolSlug, toolName]);
  if (posts.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4 text-muted-foreground" /> Related Reading
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:bg-muted/30 transition-colors flex flex-col"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
              {p.category}
            </span>
            <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {p.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 flex-1">{p.description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Read article <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
