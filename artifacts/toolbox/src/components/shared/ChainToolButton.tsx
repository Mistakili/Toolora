import { useState } from "react";
import { ArrowRight, Link2, X, Search } from "lucide-react";
import { useLocation } from "wouter";
import { TOOLS, type ToolDef } from "@/lib/tools-config";

const CHAINABLE_TEXT_TOOLS: string[] = [
  "word-counter", "case-converter", "lorem-ipsum", "markdown-preview",
  "text-diff", "json-formatter", "base64", "url-encoder",
  "hash-generator", "uuid-generator",
];

interface ChainToolButtonProps {
  currentSlug: string;
  outputText: string;
}

export function ChainToolButton({ currentSlug, outputText }: ChainToolButtonProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const targets = TOOLS.filter(
    t => CHAINABLE_TEXT_TOOLS.includes(t.slug) && t.slug !== currentSlug
  ).filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendTo = (tool: ToolDef) => {
    const encoded = encodeURIComponent(outputText.slice(0, 4000));
    setLocation(`/tools/${tool.category}/${tool.slug}?input=${encoded}`);
    setOpen(false);
  };

  if (!outputText.trim()) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
      >
        <Link2 className="w-3.5 h-3.5" />
        Use output in another tool
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="font-semibold">Chain to another tool</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Your output will be pre-filled as the input</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search tools..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg border-0 outline-none focus:ring-1 ring-primary"
                />
              </div>
            </div>
            <div className="p-2 max-h-72 overflow-y-auto">
              {targets.map(tool => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.slug}
                    onClick={() => sendTo(tool)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{tool.description}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
