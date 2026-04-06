import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";
import { getGlossaryEntry } from "../lib/glossary";

interface GlossaryPageProps {
  params: { slug: string };
}

export default function GlossaryPage({ params }: GlossaryPageProps) {
  const entry = getGlossaryEntry(params.slug);

  useEffect(() => {
    if (entry) document.title = entry.metaTitle;
  }, [entry]);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Term not found</h1>
          <Link href="/glossary" className="text-blue-400 hover:underline">
            Browse all terms
          </Link>
        </div>
      </div>
    );
  }

  const toolHref = entry.toolSlug ? `/tools/${entry.toolCategory}/${entry.toolSlug}` : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <BookOpen className="w-4 h-4" />
          <Link href="/glossary" className="hover:text-zinc-300 transition-colors">
            Glossary
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{entry.category}</span>
          <span>/</span>
          <span className="text-zinc-300">{entry.term}</span>
        </div>
        <h1 className="text-4xl font-bold text-white">What is {entry.term}?</h1>
        <p className="text-zinc-500 text-sm">{entry.shortDescription}</p>
      </div>

      <div className="bg-zinc-900 border-l-4 border-blue-500 rounded-r-xl p-6">
        <p className="text-zinc-200 text-lg leading-relaxed">{entry.definition}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">How It Works</h2>
        <p className="text-zinc-400 leading-relaxed">{entry.expandedExplanation}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Common Use Cases</h2>
        <ul className="space-y-2">
          {entry.useCases.map((use, i) => (
            <li key={i} className="flex gap-3 items-start text-zinc-300">
              <span className="text-blue-400 mt-1 flex-shrink-0">▸</span>
              <span>{use}</span>
            </li>
          ))}
        </ul>
      </div>

      {entry.example && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">Example — {entry.example.label}</h2>
          <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 overflow-x-auto text-sm text-green-300 leading-relaxed">
            <code>{entry.example.code}</code>
          </pre>
        </div>
      )}

      {toolHref && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold">Try it free — {entry.toolName}</p>
            <p className="text-zinc-400 text-sm">Browser-based, no upload, no account required</p>
          </div>
          <Link href={toolHref}>
            <button className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
              Open Tool <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )}

      {entry.relatedTerms.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Related Terms</h2>
          <div className="flex flex-wrap gap-3">
            {entry.relatedTerms.map((rel) => (
              <Link key={rel.slug} href={`/glossary/${rel.slug}`}>
                <span className="inline-block bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg border border-zinc-700 transition-colors cursor-pointer">
                  {rel.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-zinc-800">
        <Link href="/glossary" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          ← Back to all {entry.category} terms
        </Link>
      </div>
    </div>
  );
}
