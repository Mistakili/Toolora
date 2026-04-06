import { useEffect } from "react";
import { Link } from "wouter";
import { BookOpen } from "lucide-react";
import { TERMS } from "../lib/glossary";

const CATEGORIES = [...new Set(TERMS.map((t) => t.category))].sort();

export default function GlossaryIndex() {
  useEffect(() => {
    document.title = "Developer & Tech Glossary — Toolora";
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-sm">
          <BookOpen className="w-4 h-4" /> Developer Glossary
        </div>
        <h1 className="text-4xl font-bold text-white">Developer & Tech Glossary</h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Clear, practical explanations of {TERMS.length}+ terms every developer encounters. Each entry includes real examples and links to free tools.
        </p>
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat} className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">{cat}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TERMS.filter((t) => t.category === cat).map((term) => (
              <Link key={term.slug} href={`/glossary/${term.slug}`}>
                <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 cursor-pointer transition-colors group h-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors text-sm">{term.term}</h3>
                    <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">{term.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
