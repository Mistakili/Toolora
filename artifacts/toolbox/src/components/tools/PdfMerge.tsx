import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileText, X, Download, MoveUp, MoveDown, Loader2 } from "lucide-react";
import ApiUpgradeBanner from "@/components/shared/ApiUpgradeBanner";

interface PdfFile {
  id: string;
  file: File;
  name: string;
}

export default function PdfMerge() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [error, setError] = useState("");

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = accepted.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      name: f.name,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const moveUp = (i: number) => {
    if (i === 0) return;
    setFiles((prev) => { const a = [...prev]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  };
  const moveDown = (i: number) => {
    setFiles((prev) => {
      if (i >= prev.length - 1) return prev;
      const a = [...prev]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a;
    });
  };

  const merge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const out = await merged.save();
      setResult(out);
    } catch (e: any) {
      setError("Failed to merge PDFs: " + (e?.message ?? "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground font-medium">Drop PDF files here or click to browse</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Add multiple PDFs — they'll be merged in the order shown below</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{files.length} file{files.length !== 1 ? "s" : ""} queued</p>
            <Button variant="ghost" size="sm" onClick={() => { setFiles([]); setResult(null); }} className="text-destructive hover:text-destructive">Clear all</Button>
          </div>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border border-border">
                <FileText className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-sm flex-1 truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{(f.file.size / 1024).toFixed(0)} KB</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveUp(i)} disabled={i === 0}>
                    <MoveUp className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDown(i)} disabled={i === files.length - 1}>
                    <MoveDown className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => remove(f.id)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={merge} disabled={files.length < 2 || loading} className="flex-1">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {loading ? "Merging..." : `Merge ${files.length} PDFs`}
        </Button>
        {result && (
          <Button variant="outline" onClick={download}>
            <Download className="w-4 h-4 mr-2" />
            Download Merged PDF
          </Button>
        )}
      </div>

      {result && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
          ✓ Merge complete! Your PDF ({(result.byteLength / 1024).toFixed(0)} KB) is ready to download.
        </div>
      )}

      {files.length < 2 && files.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">Add at least 2 PDFs to merge.</p>
      )}

      <ApiUpgradeBanner variant="pdf-merge" />
    </div>
  );
}
