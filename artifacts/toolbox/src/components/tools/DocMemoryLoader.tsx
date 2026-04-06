import { useState, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Check, Upload, FileText, Brain, Sparkles, AlertCircle, X } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Status = "idle" | "loading" | "done" | "error";

interface Result {
  filename: string;
  prefix: string;
  chunkCount: number;
  totalChars: number;
  keys: string[];
  indexKey: string;
  expiresAt: string;
  tip: string;
}

function formatBytes(n: number) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocMemoryLoader() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [chunkSize, setChunkSize] = useState(1000);
  const [overlap, setOverlap] = useState(100);
  const [prefix, setPrefix] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = [".pdf", ".docx", ".txt", ".md"];

  const handleFile = (f: File) => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) {
      setError("Unsupported format. Upload a PDF, DOCX, TXT, or MD file.");
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
    setStatus("idle");
    if (!prefix) {
      const slug = f.name.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
      setPrefix(slug);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [prefix]);

  const handleLoad = async () => {
    if (!file) return;
    setStatus("loading");
    setError("");
    setResult(null);
    const form = new FormData();
    form.append("file", file);
    form.append("chunkSize", String(chunkSize));
    form.append("overlap", String(overlap));
    if (prefix) form.append("prefix", prefix);
    form.append("expiresInDays", "90");
    try {
      const res = await fetch(`${BASE}/api/doc-memory/load`, { method: "POST", body: form, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load document");
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const claudePrompt = result
    ? `Use list_memories with prefix "${result.prefix}" to load my document, then answer questions from it.`
    : "";

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 flex gap-3">
        <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">How it works: </span>
          Drop any document. It gets chunked and saved to Claude-accessible memory. Next time you open Claude with Toolora's MCP connected, your document is instantly available — just ask Claude to recall it.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragging ? "border-primary bg-primary/5" : file ? "border-green-500/50 bg-green-500/5" : "border-border hover:border-primary/40 hover:bg-muted/20"}`}
          >
            <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-green-500" />
                <div className="text-left">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setFile(null); setStatus("idle"); setResult(null); setPrefix(""); }} className="ml-2 p-1 rounded hover:bg-muted">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground opacity-40" />
                <p className="text-sm font-medium">Drop a file or click to browse</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT, MD · up to 20 MB</p>
              </div>
            )}
          </div>

          {/* Prefix */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">Memory prefix</Label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. contract-2024 or project-spec"
                value={prefix}
                onChange={e => setPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40))}
                className="flex-1 bg-muted/20 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <p className="text-xs text-muted-foreground">Chunks will be saved as <code className="font-mono text-primary">{prefix || "doc-name"}-chunk-001</code>, <code className="font-mono text-primary">{prefix || "doc-name"}-chunk-002</code>…</p>
          </div>

          <Button onClick={handleLoad} disabled={!file || status === "loading"} className="w-full h-12 text-base">
            {status === "loading" ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" /> Loading into memory…</>
            ) : (
              <><Brain className="w-5 h-5 mr-2" /> Load Document into Claude Memory</>
            )}
          </Button>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Chunking settings</Label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chunk size</span>
              <span className="font-mono">{chunkSize} chars</span>
            </div>
            <input type="range" min={200} max={4000} step={100} value={chunkSize} onChange={e => setChunkSize(Number(e.target.value))} className="w-full accent-primary" />
            <p className="text-xs text-muted-foreground">~{Math.ceil(chunkSize / 4)} tokens per chunk</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overlap</span>
              <span className="font-mono">{overlap} chars</span>
            </div>
            <input type="range" min={0} max={400} step={20} value={overlap} onChange={e => setOverlap(Number(e.target.value))} className="w-full accent-primary" />
            <p className="text-xs text-muted-foreground">Context shared between chunks</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Supported formats</p>
            <p>📄 PDF — text-based (not scanned images)</p>
            <p>📝 DOCX — Word documents</p>
            <p>🔤 TXT / MD — plain text &amp; Markdown</p>
            <p className="pt-1">Memories expire after 90 days</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {(status === "error" || error) && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4 flex gap-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Result */}
      {status === "done" && result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-500" />
              <p className="font-semibold text-green-600 dark:text-green-400">Document loaded into Claude memory</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-background/60 border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{result.chunkCount}</p>
                <p className="text-xs text-muted-foreground">chunks saved</p>
              </div>
              <div className="rounded-lg bg-background/60 border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{result.totalChars.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">characters</p>
              </div>
              <div className="rounded-lg bg-background/60 border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">90</p>
                <p className="text-xs text-muted-foreground">days to expiry</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Say this to Claude</p>
              <div className="flex items-start gap-2 rounded-lg bg-background/60 border border-border p-3">
                <p className="text-sm font-mono flex-1 text-foreground">{claudePrompt}</p>
                <button onClick={() => copy(claudePrompt, "prompt")} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                  {copiedKey === "prompt" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Saved memory keys ({result.keys.length + 1})</p>
              <div className="max-h-44 overflow-y-auto rounded-lg border border-border bg-background/40 p-2 space-y-1">
                <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-muted/30 group">
                  <span className="text-xs font-mono text-primary">{result.indexKey}</span>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0">index</span>
                </div>
                {result.keys.map(k => (
                  <div key={k} className="flex items-center justify-between px-2 py-1 rounded hover:bg-muted/30">
                    <span className="text-xs font-mono text-muted-foreground">{k}</span>
                    <button onClick={() => copy(k, k)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      {copiedKey === k ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
