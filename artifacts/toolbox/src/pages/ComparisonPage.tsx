import { useParams, Link } from "wouter";
import { ChevronRight, CheckCircle2, XCircle, Shield, ArrowRight, Minus, BookOpen } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { getComparison } from "@/lib/comparisons";
import { getComparisonHowTos } from "@/lib/cross-links";
import { getHowToGuide } from "@/lib/tool-how-to";
import NotFound from "./not-found";
import { TOOLS } from "@/lib/tools-config";

export default function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = getComparison(slug);

  useSEO({
    title: entry?.metaTitle ?? "Comparison | Toolora",
    description: entry?.metaDescription ?? "",
    canonical: entry ? `https://toolora.dev/compare/${entry.slug}` : undefined,
    type: "article",
  });

  if (!entry) return <NotFound />;

  const howToSlugs = getComparisonHowTos(entry.slug);
  const howToGuides = howToSlugs.map(s => getHowToGuide(s)).filter(Boolean);

  const typeLabel =
    entry.type === "vs"
      ? "Tool Comparison"
      : entry.type === "alternative"
      ? "Alternative Guide"
      : "Best For Guide";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/tools/pdf" className="hover:text-foreground transition-colors">Tools</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate max-w-[200px]">{entry.headline}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
          {typeLabel}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{entry.headline}</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">{entry.subheadline}</p>
      </div>

      {/* Verdict */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 mb-10 flex gap-4">
        <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground mb-1">Quick Verdict</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{entry.verdict}</p>
        </div>
      </div>

      {/* Feature Table */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5">
          {entry.type === "vs" ? `Toolora vs ${entry.competitorName}` : "Feature Comparison"}
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] bg-muted/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Feature</span>
            <span className="text-center w-32">Toolora</span>
            <span className="text-center w-32">{entry.competitorName ?? "Others"}</span>
          </div>
          {entry.features.map((f, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_auto_auto] px-4 py-3.5 border-t border-border items-center ${i % 2 === 0 ? "" : "bg-muted/20"}`}
            >
              <span className="text-sm font-medium pr-4">{f.name}</span>
              <span className="w-32 text-center">
                {f.toolora === "✓" || f.toolora === true ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                ) : f.toolora === "✗" || f.toolora === false ? (
                  <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                ) : (
                  <span className={`text-xs font-medium ${f.toloraWins ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>{f.toolora}</span>
                )}
              </span>
              <span className="w-32 text-center">
                {f.them === "✓" || f.them === true ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                ) : f.them === "✗" || f.them === false ? (
                  <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                ) : f.them === undefined ? (
                  <Minus className="w-4 h-4 text-muted-foreground mx-auto" />
                ) : (
                  <span className="text-xs text-muted-foreground">{f.them}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Deep-dive sections */}
      {entry.sections.map((s, i) => (
        <section key={i} className="mb-8">
          <h2 className="text-xl font-bold mb-3">{s.heading}</h2>
          <p className="text-muted-foreground leading-relaxed">{s.body}</p>
        </section>
      ))}

      {/* Privacy callout */}
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5 mb-10 flex gap-4">
        <Shield className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground">100% Private — Nothing Leaves Your Browser</p>
          <p className="text-sm text-muted-foreground mt-1">
            Every Toolora browser tool runs entirely as client-side code. Files and data are never uploaded, stored, or logged on any server. Open DevTools → Network to verify.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-12 text-center">
        <h3 className="text-lg font-bold mb-2">Try Toolora — Free, No Account Needed</h3>
        <p className="text-muted-foreground text-sm mb-4">
          35 professional tools for text, PDF, image, and developer workflows — all running locally in your browser.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Explore All Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
          {entry.relatedTools[0] && (() => {
            const t = TOOLS.find(tool => tool.slug === entry.relatedTools[0]);
            if (!t) return null;
            return (
              <Link
                href={`/tools/${t.category}/${t.slug}`}
                className="inline-flex items-center gap-2 border border-primary/30 text-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/5 transition-colors"
              >
                {t.name} →
              </Link>
            );
          })()}
        </div>
      </div>

      {/* FAQ */}
      {entry.faq.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {entry.faq.map((item, i) => (
              <div key={i} className="border-b border-border pb-5 last:border-0">
                <p className="font-semibold text-foreground mb-2">{item.q}</p>
                <p className="text-muted-foreground text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related tools */}
      {entry.relatedTools.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Try These Tools Free</h2>
          <div className="flex flex-wrap gap-2">
            {entry.relatedTools.map((slug) => {
              const t = TOOLS.find(tool => tool.slug === slug);
              if (!t) return null;
              return (
                <Link
                  key={slug}
                  href={`/tools/${t.category}/${t.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm hover:border-primary/50 hover:bg-muted transition-colors"
                >
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  {t.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* How-to guides */}
      {howToGuides.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" /> Step-by-Step How-To Guides
          </h2>
          <div className="space-y-2">
            {howToGuides.map((g) => (
              <Link
                key={g!.slug}
                href={`/how-to/${g!.slug}`}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm hover:border-primary/50 hover:bg-muted transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                {g!.headline}
              </Link>
            ))}
          </div>
        </section>
      )}

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
