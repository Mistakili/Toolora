import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";

type Strategy = "paragraph" | "sentence" | "fixed";

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

function chunkText(text: string, strategy: Strategy, chunkSize: number, overlap: number): string[] {
  if (!text.trim()) return [];
  const ov = Math.max(0, Math.min(overlap, Math.floor(chunkSize / 2)));

  if (strategy === "fixed") {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize - ov) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks.filter(c => c.trim());
  }

  if (strategy === "sentence") {
    const sentences = text.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) ?? [text];
    const chunks: string[] = [];
    let current = "";
    for (const s of sentences) {
      if (current.length + s.length > chunkSize && current.length > 0) {
        chunks.push(current.trim());
        current = current.slice(-ov) + s;
      } else {
        current += s;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    if (current.length + p.length + 2 > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = current.slice(-ov) + "\n\n" + p;
    } else {
      current = current ? current + "\n\n" + p : p;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

const STRATEGIES: { value: Strategy; label: string; desc: string }[] = [
  { value: "paragraph", label: "Paragraph", desc: "Split on blank lines — best for articles, docs" },
  { value: "sentence", label: "Sentence", desc: "Split at sentence boundaries — best for prose" },
  { value: "fixed", label: "Fixed size", desc: "Hard character limit per chunk — best for code" },
];

export default function TextChunker() {
  const [input, setInput] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("paragraph");
  const [chunkSize, setChunkSize] = useState(1000);
  const [overlap, setOverlap] = useState(100);
  const [copied, setCopied] = useState<number | "all" | null>(null);

  const chunks = useMemo(() => chunkText(input, strategy, chunkSize, overlap), [input, strategy, chunkSize, overlap]);

  const handleCopy = (text: string, idx: number | "all") => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    const content = chunks.map((c, i) => `--- Chunk ${i + 1} ---\n${c}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chunks.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleDownloadJsonl = () => {
    const content = chunks.map(c => JSON.stringify({ text: c, tokens: estimateTokens(c) })).join("\n");
    const blob = new Blob([content], { type: "application/jsonl" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chunks.jsonl";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const totalTokens = useMemo(() => estimateTokens(input), [input]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Strategy</Label>
          <div className="space-y-1.5">
            {STRATEGIES.map(s => (
              <button
                key={s.value}
                onClick={() => setStrategy(s.value)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${strategy === s.value ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"}`}
              >
                <div className="font-medium">{s.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Chunk size</Label>
              <span className="text-sm font-mono text-foreground">{chunkSize} chars</span>
            </div>
            <input
              type="range" min={100} max={8000} step={100}
              value={chunkSize}
              onChange={e => setChunkSize(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100</span><span>~{Math.ceil(chunkSize / 4)} tokens</span><span>8,000</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Overlap</Label>
              <span className="text-sm font-mono text-foreground">{overlap} chars</span>
            </div>
            <input
              type="range" min={0} max={Math.min(500, Math.floor(chunkSize / 2))} step={10}
              value={overlap}
              onChange={e => setOverlap(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span><span>overlap between chunks</span><span>500</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Stats</Label>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Characters</span><span className="font-mono">{input.length.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Est. tokens</span><span className="font-mono">{totalTokens.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Chunks</span><span className="font-mono font-semibold text-primary">{chunks.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Avg chunk</span><span className="font-mono">{chunks.length ? Math.round(chunks.reduce((a, c) => a + c.length, 0) / chunks.length) : 0} chars</span></div>
          </div>
          {chunks.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleCopy(chunks.map((c, i) => `--- Chunk ${i + 1} ---\n${c}`).join("\n\n"), "all")}>
                {copied === "all" ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                Copy all
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleDownload}>
                <Download className="w-3.5 h-3.5 mr-1" /> Download .txt
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleDownloadJsonl}>
                <Download className="w-3.5 h-3.5 mr-1" /> Download .jsonl
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Input Text</Label>
        <Textarea
          placeholder="Paste your document, article, or long text here. It will be split into chunks ready for embedding or RAG pipelines..."
          className="min-h-[200px] resize-y font-mono text-sm bg-muted/20"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      {chunks.length > 0 && (
        <div className="space-y-3">
          <Label>
            {chunks.length} chunk{chunks.length !== 1 ? "s" : ""} — ready for embedding
          </Label>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {chunks.map((chunk, i) => (
              <div key={i} className="rounded-xl border border-border bg-muted/10 p-4 group relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Chunk {i + 1} · {chunk.length} chars · ~{estimateTokens(chunk)} tokens
                  </span>
                  <button
                    onClick={() => handleCopy(chunk, i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copied === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === i ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/80 leading-relaxed line-clamp-6">
                  {chunk}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {!input && (
        <div className="rounded-xl border-2 border-dashed border-border flex items-center justify-center h-40 text-muted-foreground text-sm">
          Paste text above to split it into chunks
        </div>
      )}
    </div>
  );
}
