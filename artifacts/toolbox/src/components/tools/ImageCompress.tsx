import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ImageIcon, Download, ArrowRight } from "lucide-react";

export default function ImageCompress() {
  const [original, setOriginal] = useState<{ file: File; url: string } | null>(null);
  const [quality, setQuality] = useState(75);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginal({ file, url });
    setResult(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((files: File[]) => { if (files[0]) loadImage(files[0]); }, []),
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
  });

  const compress = () => {
    if (!original || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          setResult({ url, size: blob.size });
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.src = original.url;
  };

  const download = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `compressed_${original.file.name.replace(/\.[^.]+$/, ".jpg")}`;
    a.click();
  };

  const fmt = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;
  const savings = result && original
    ? Math.round((1 - result.size / original.file.size) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {!original ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground font-medium">Drop an image here or click to browse</p>
          <p className="text-sm text-muted-foreground/60 mt-1">JPG, PNG, WebP supported</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-6 items-start">
            <img src={original.url} alt="Original" className="h-32 w-auto rounded-xl border border-border object-cover" />
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{original.file.name}</p>
              <p>Original size: <strong className="text-foreground">{fmt(original.file.size)}</strong></p>
              {result && (
                <>
                  <p>Compressed: <strong className="text-green-400">{fmt(result.size)}</strong></p>
                  <p className="text-green-400 font-bold">{savings > 0 ? `↓ ${savings}% smaller` : "No reduction"}</p>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => { setOriginal(null); setResult(null); }} className="px-0 text-destructive hover:text-destructive">Remove</Button>
            </div>
          </div>

          <div className="bg-muted/30 rounded-2xl p-5 border border-border space-y-3">
            <div className="flex justify-between text-sm">
              <label className="text-muted-foreground uppercase tracking-wider text-xs">Quality</label>
              <span className="font-mono font-bold text-primary">{quality}%</span>
            </div>
            <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-violet-500" />
            <div className="flex gap-2 text-xs text-muted-foreground justify-between">
              <span>Smallest file</span>
              <span>Best quality</span>
            </div>
            <div className="flex gap-2 flex-wrap pt-1">
              {[{ label: "Maximum", val: 90 }, { label: "Balanced", val: 75 }, { label: "Small", val: 55 }, { label: "Tiny", val: 30 }].map(({ label, val }) => (
                <Button key={label} variant={quality === val ? "default" : "outline"} size="sm" onClick={() => setQuality(val)}>{label}</Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={compress} className="flex-1">
              <ArrowRight className="w-4 h-4 mr-2" />
              Compress Image
            </Button>
            {result && (
              <Button variant="outline" onClick={download}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>

          {result && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Original</p>
                <img src={original.url} alt="Original" className="w-full rounded-xl border border-border object-cover max-h-48" />
                <p className="text-xs text-center text-muted-foreground">{fmt(original.file.size)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Compressed</p>
                <img src={result.url} alt="Compressed" className="w-full rounded-xl border border-primary/30 object-cover max-h-48" />
                <p className="text-xs text-center text-green-400">{fmt(result.size)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
