import { useEffect } from "react";
import { Link } from "wouter";
import { BookOpen } from "lucide-react";

const TERMS = [
  { slug: "base64", term: "Base64", category: "Encoding", description: "Binary-to-text encoding for APIs, email, and data URIs." },
  { slug: "jwt", term: "JWT", category: "Authentication", description: "Compact signed token for stateless authentication." },
  { slug: "url-encoding", term: "URL Encoding", category: "Web", description: "Percent-encoding special characters for safe URL use." },
  { slug: "json", term: "JSON", category: "Data Formats", description: "Lightweight text-based data interchange format." },
  { slug: "hash", term: "Hash / Cryptographic Hash", category: "Security", description: "One-way function mapping data to a fixed-size fingerprint." },
  { slug: "qr-code", term: "QR Code", category: "Encoding", description: "2D barcode for storing text, URLs, and structured data." },
  { slug: "regex", term: "Regex", category: "Programming", description: "Pattern syntax for searching and matching text strings." },
  { slug: "unicode", term: "Unicode", category: "Encoding", description: "Universal standard assigning numbers to every character." },
  { slug: "ascii", term: "ASCII", category: "Encoding", description: "7-bit character encoding for 128 printable and control characters." },
  { slug: "pdf", term: "PDF", category: "File Formats", description: "Fixed-layout document format independent of software or OS." },
];

const CATEGORIES = [...new Set(TERMS.map((t) => t.category))];

export default function GlossaryIndex() {
  useEffect(() => { document.title = "Developer & Tech Glossary — Toolora"; }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-sm">
          <BookOpen className="w-4 h-4" /> Developer Glossary
        </div>
        <h1 className="text-4xl font-bold text-white">Developer & Tech Glossary</h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Clear, practical explanations of the terms every developer encounters. Each entry includes real examples and links to free tools.
        </p>
      </div>

      {CATEGORIES.map((cat) => (
        <div key={cat} className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">{cat}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {TERMS.filter((t) => t.category === cat).map((term) => (
              <Link key={term.slug} href={`/glossary/${term.slug}`}>
                <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 cursor-pointer transition-colors group">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">{term.term}</h3>
                    <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-lg">→</span>
                  </div>
                  <p className="text-zinc-500 text-sm">{term.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
