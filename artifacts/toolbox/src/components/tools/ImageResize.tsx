import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, ImageIcon, Link } from "lucide-react";
import ApiUpgradeBanner from "@/components/shared/ApiUpgradeBanner";

interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
}

export default function ImageResize() {
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [targetW, setTargetW] = useState("");
  const [targetH, setTargetH] = useState("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [quality, setQuality] = useState(92);
  const [result, setResult] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImage = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginal({ file, url, width: img.naturalWidth, height: img.naturalHeight });
      setTargetW(String(img.naturalWidth));
      setTargetH(String(img.naturalHeight));
      setResult(null);
    };
    img.src = url;
  };

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) loadImage(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const onWidthChange = (v: string) => {
    setTargetW(v);
    if (keepAspect && original && v) {
      const ratio = original.height / original.width;
      setTargetH(String(Math.round(Number(v) * ratio)));
    }
  };

  const onHeightChange = (v: string) => {
    setTargetH(v);
    if (keepAspect && original && v) {
      const ratio = original.width / original.height;
      setTargetW(String(Math.round(Number(v) * ratio)));
    }
  };

  const resize = () => {
    if (!original || !canvasRef.current) return;
    const w = Math.max(1, Math.min(Number(targetW) || original.width, 8000));
    const h = Math.max(1, Math.min(Number(targetH) || original.height, 8000));
    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      const ext = original.file.name.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
      const dataUrl = canvas.toDataURL(ext, quality / 100);
      setResult(dataUrl);
      const bytes = Math.round((dataUrl.length * 3) / 4);
      setResultSize(bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`);
    };
    img.src = original.url;
  };

  const download = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = `resized_${original.file.name}`;
    a.click();
  };

  const formatSize = (bytes: number) =>
    bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;

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
          <p className="text-sm text-muted-foreground/60 mt-1">PNG, JPG, WebP, GIF supported</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preview row */}
          <div className="flex gap-6 items-start">
            <img src={original.url} alt="Original" className="h-32 w-auto rounded-xl border border-border object-cover" />
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{original.file.name}</p>
              <p>Original: {original.width} × {original.height}px</p>
              <p>Size: {formatSize(original.file.size)}</p>
              <Button variant="ghost" size="sm" onClick={() => { setOriginal(null); setResult(null); }} className="px-0 text-destructive hover:text-destructive">
                Remove
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-muted/30 rounded-2xl p-5 border border-border space-y-4">
            <div className="flex gap-4 items-end">
              <div className="space-y-1 flex-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Width (px)</label>
                <Input value={targetW} onChange={(e) => onWidthChange(e.target.value)} type="number" min={1} className="font-mono" />
              </div>
              <button onClick={() => setKeepAspect(!keepAspect)} className="mb-1 p-2 rounded-lg hover:bg-muted transition-colors" title="Lock aspect ratio">
                <Link className={`w-4 h-4 ${keepAspect ? "text-primary" : "text-muted-foreground"}`} />
              </button>
              <div className="space-y-1 flex-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Height (px)</label>
                <Input value={targetH} onChange={(e) => onHeightChange(e.target.value)} type="number" min={1} className="font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Quality: {quality}%</label>
              <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-violet-500" />
            </div>

            <div className="flex gap-2 flex-wrap">
              {[25, 50, 75, 100].map((pct) => (
                <Button key={pct} variant="outline" size="sm" onClick={() => {
                  const w = Math.round(original.width * pct / 100);
                  const h = Math.round(original.height * pct / 100);
                  setTargetW(String(w));
                  setTargetH(String(h));
                }}>{pct}%</Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => { setTargetW("1920"); onWidthChange("1920"); }}>1920px</Button>
              <Button variant="outline" size="sm" onClick={() => { setTargetW("1280"); onWidthChange("1280"); }}>1280px</Button>
              <Button variant="outline" size="sm" onClick={() => { setTargetW("800"); onWidthChange("800"); }}>800px</Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={resize} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Resize Image
            </Button>
            {result && (
              <Button variant="outline" onClick={download}>
                <Download className="w-4 h-4 mr-2" />
                Download ({resultSize})
              </Button>
            )}
          </div>

          {result && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Preview:</p>
              <img src={result} alt="Resized" className="max-h-64 w-auto rounded-xl border border-border" />
            </div>
          )}

          <ApiUpgradeBanner variant="image-resize" />
        </div>
      )}
    </div>
  );
}
