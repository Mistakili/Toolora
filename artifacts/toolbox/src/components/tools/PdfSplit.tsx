import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Loader2, X } from "lucide-react";

interface SplitResult {
  name: string;
  bytes: Uint8Array;
  pages: number;
}

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [mode, setMode] = useState<"all" | "range" | "every">("all");
  const [rangeInput, setRangeInput] = useState("1-3, 4-6");
  const [everyN, setEveryN] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SplitResult[]>([]);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(async (files: File[]) => {
      if (!files[0]) return;
      setFile(files[0]);
      setResults([]);
      setError("");
      try {
        const { PDFDocument } = await import("pdf-lib");
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        setTotalPages(doc.getPageCount());
      } catch {
        setError("Could not read this PDF. Please try another file.");
      }
    }, []),
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const parseRanges = (input: string, total: number): [number, number][] => {
    return input.split(",").map((s) => s.trim()).filter(Boolean).map((s) => {
      const [a, b] = s.split("-").map((x) => parseInt(x.trim(), 10));
      const start = Math.max(1, a || 1);
      const end = Math.min(total, b || start);
      return [start, end] as [number, number];
    }).filter(([a, b]) => a <= b && a >= 1 && b <= total);
  };

  const split = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const srcBytes = await file.arrayBuffer();
      const src = await PDFDocument.load(srcBytes);
      const total = src.getPageCount();
      const chunks: { pages: number[]; name: string }[] = [];

      if (mode === "all") {
        for (let i = 0; i < total; i++) chunks.push({ pages: [i], name: `page_${i + 1}` });
      } else if (mode === "range") {
        const ranges = parseRanges(rangeInput, total);
        if (!ranges.length) { setError("No valid ranges found."); setLoading(false); return; }
        ranges.forEach(([s, e], idx) => {
          const pages = Array.from({ length: e - s + 1 }, (_, i) => s - 1 + i);
          chunks.push({ pages, name: `part_${idx + 1}_pages_${s}-${e}` });
        });
      } else {
        for (let i = 0; i < total; i += everyN) {
          const pages = Array.from({ length: Math.min(everyN, total - i) }, (_, j) => i + j);
          chunks.push({ pages, name: `part_${Math.floor(i / everyN) + 1}` });
        }
      }

      const out: SplitResult[] = [];
      for (const chunk of chunks) {
        const doc = await PDFDocument.create();
        const copied = await doc.copyPages(src, chunk.pages);
        copied.forEach((p) => doc.addPage(p));
        const bytes = await doc.save();
        out.push({ name: chunk.name + ".pdf", bytes, pages: chunk.pages.length });
      }
      setResults(out);
    } catch (e: any) {
      setError("Failed to split: " + (e?.message ?? "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const downloadOne = (r: SplitResult) => {
    const blob = new Blob([r.bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = r.name; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => results.forEach(downloadOne);

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
        >
          <input {...getInputProps()} />
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground font-medium">Drop a PDF here or click to browse</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-4 border border-border">
          <FileText className="w-6 h-6 text-red-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{totalPages} pages · {(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setFile(null); setResults([]); setTotalPages(0); }}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {file && totalPages > 0 && (
        <div className="bg-muted/30 rounded-2xl p-5 border border-border space-y-4">
          <div className="flex gap-2">
            {[{ id: "all", label: "Every Page" }, { id: "range", label: "Page Ranges" }, { id: "every", label: "Every N Pages" }].map(({ id, label }) => (
              <Button key={id} variant={mode === id ? "default" : "outline"} size="sm" onClick={() => setMode(id as any)}>{label}</Button>
            ))}
          </div>

          {mode === "range" && (
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Ranges (e.g. 1-3, 4-7, 8)</label>
              <Input value={rangeInput} onChange={(e) => setRangeInput(e.target.value)} className="font-mono" placeholder="1-3, 4-6, 7-10" />
              <p className="text-xs text-muted-foreground">PDF has {totalPages} pages total</p>
            </div>
          )}
          {mode === "every" && (
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Split every N pages</label>
              <div className="flex gap-2 items-center">
                <Input type="number" min={1} max={totalPages} value={everyN} onChange={(e) => setEveryN(Math.max(1, Number(e.target.value)))} className="font-mono w-24" />
                <span className="text-sm text-muted-foreground">pages — will create {Math.ceil(totalPages / everyN)} file{Math.ceil(totalPages / everyN) !== 1 ? "s" : ""}</span>
              </div>
            </div>
          )}
          {mode === "all" && <p className="text-sm text-muted-foreground">Will extract each page as a separate PDF ({totalPages} files).</p>}
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {file && totalPages > 0 && (
        <Button onClick={split} disabled={loading} className="w-full">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {loading ? "Splitting..." : "Split PDF"}
        </Button>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-green-400">✓ {results.length} file{results.length !== 1 ? "s" : ""} created</p>
            {results.length > 1 && (
              <Button variant="outline" size="sm" onClick={downloadAll}>
                <Download className="w-3 h-3 mr-2" />Download All
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border border-border">
                <FileText className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-sm flex-1 truncate">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.pages}p · {(r.bytes.byteLength / 1024).toFixed(0)} KB</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => downloadOne(r)}>
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
