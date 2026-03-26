import { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ImageIcon, Download } from "lucide-react";

type Format = "image/jpeg" | "image/png" | "image/webp";
const FORMATS: { label: string; mime: Format; ext: string }[] = [
  { label: "JPEG", mime: "image/jpeg", ext: "jpg" },
  { label: "PNG", mime: "image/png", ext: "png" },
  { label: "WebP", mime: "image/webp", ext: "webp" },
];

export default function ImageConvert() {
  const [original, setOriginal] = useState<{ file: File; url: string } | null>(null);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState<{ url: string; size: number; ext: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((files: File[]) => {
      if (!files[0]) return;
      const url = URL.createObjectURL(files[0]);
      setOriginal({ file: files[0], url });
      setResult(null);
    }, []),
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const convert = () => {
    if (!original || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const ext = FORMATS.find((f) => f.mime === format)!.ext;
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setResult({ url: URL.createObjectURL(blob), size: blob.size, ext });
        },
        format,
        format === "image/png" ? undefined : quality / 100
      );
    };
    img.src = original.url;
  };

  const download = () => {
    if (!result || !original) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `converted_${original.file.name.replace(/\.[^.]+$/, "")}.${result.ext}`;
    a.click();
  };

  const fmt = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`;

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
          <p className="text-sm text-muted-foreground/60 mt-1">PNG, JPG, WebP, GIF, BMP supported</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-6 items-start">
            <img src={original.url} alt="Original" className="h-32 w-auto rounded-xl border border-border object-cover" />
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{original.file.name}</p>
              <p>Size: {fmt(original.file.size)}</p>
              <Button variant="ghost" size="sm" onClick={() => { setOriginal(null); setResult(null); }} className="px-0 text-destructive hover:text-destructive">Remove</Button>
            </div>
          </div>

          <div className="bg-muted/30 rounded-2xl p-5 border border-border space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Convert to</label>
              <div className="flex gap-2">
                {FORMATS.map((f) => (
                  <Button
                    key={f.mime}
                    variant={format === f.mime ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setFormat(f.mime); setResult(null); }}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>

            {format !== "image/png" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-muted-foreground uppercase tracking-wider">Quality</label>
                  <span className="font-mono text-primary">{quality}%</span>
                </div>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-violet-500" />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={convert} className="flex-1">Convert Image</Button>
            {result && (
              <Button variant="outline" onClick={download}>
                <Download className="w-4 h-4 mr-2" />
                Download {result.ext.toUpperCase()} ({fmt(result.size)})
              </Button>
            )}
          </div>

          {result && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Converted preview:</p>
              <img src={result.url} alt="Converted" className="max-h-64 w-auto rounded-xl border border-primary/30" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
