import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function optimizeSvg(svg: string, opts: {
  removeComments: boolean;
  removeMetadata: boolean;
  removeEmptyGroups: boolean;
  collapseWhitespace: boolean;
  removeDefaultAttrs: boolean;
}): string {
  let out = svg.trim();

  if (opts.removeComments) {
    out = out.replace(/<!--[\s\S]*?-->/g, "");
  }

  if (opts.removeMetadata) {
    out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
    out = out.replace(/<title>[\s\S]*?<\/title>/gi, "");
    out = out.replace(/<desc>[\s\S]*?<\/desc>/gi, "");
    out = out.replace(/\s*inkscape:[a-z-]+="[^"]*"/gi, "");
    out = out.replace(/\s*sodipodi:[a-z-]+="[^"]*"/gi, "");
    out = out.replace(/\s*xmlns:inkscape="[^"]*"/gi, "");
    out = out.replace(/\s*xmlns:sodipodi="[^"]*"/gi, "");
    out = out.replace(/\s*xmlns:dc="[^"]*"/gi, "");
    out = out.replace(/\s*xmlns:cc="[^"]*"/gi, "");
    out = out.replace(/\s*xmlns:rdf="[^"]*"/gi, "");
  }

  if (opts.removeDefaultAttrs) {
    out = out.replace(/\s*fill-rule="nonzero"/gi, "");
    out = out.replace(/\s*stroke="none"/gi, "");
    out = out.replace(/\s*stroke-width="1"/gi, "");
    out = out.replace(/\s*fill-opacity="1"/gi, "");
    out = out.replace(/\s*stroke-opacity="1"/gi, "");
    out = out.replace(/\s*display="inline"/gi, "");
    out = out.replace(/\s*overflow="visible"/gi, "");
  }

  if (opts.removeEmptyGroups) {
    out = out.replace(/<g[^>]*>\s*<\/g>/gi, "");
    out = out.replace(/<g>\s*<\/g>/gi, "");
  }

  if (opts.collapseWhitespace) {
    out = out
      .replace(/\s*\n\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/>\s+</g, "><")
      .trim();
  }

  return out;
}

function fmtBytes(n: number): string {
  if (n < 1024) return n + " B";
  return (n / 1024).toFixed(1) + " KB";
}

export default function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [removeComments, setRemoveComments] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [removeEmptyGroups, setRemoveEmptyGroups] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [removeDefaultAttrs, setRemoveDefaultAttrs] = useState(true);
  const { toast } = useToast();

  const output = input.trim() ? optimizeSvg(input, { removeComments, removeMetadata, removeEmptyGroups, collapseWhitespace, removeDefaultAttrs }) : "";
  const origBytes = new TextEncoder().encode(input).length;
  const optBytes = new TextEncoder().encode(output).length;
  const saving = origBytes > 0 ? Math.round((1 - optBytes / origBytes) * 100) : 0;

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Optimized SVG copied to clipboard." });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (ev) => setInput(ev.target?.result as string);
      reader.readAsText(file);
    }
  }, []);

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setInput(ev.target?.result as string);
    reader.readAsText(file);
  };

  const options = [
    { label: "Remove comments", value: removeComments, set: setRemoveComments },
    { label: "Remove metadata & editor junk", value: removeMetadata, set: setRemoveMetadata },
    { label: "Remove empty groups", value: removeEmptyGroups, set: setRemoveEmptyGroups },
    { label: "Remove default attributes", value: removeDefaultAttrs, set: setRemoveDefaultAttrs },
    { label: "Collapse whitespace", value: collapseWhitespace, set: setCollapseWhitespace },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={opt.value} onChange={(e) => opt.set(e.target.checked)} className="w-4 h-4 accent-primary" />
            {opt.label}
          </label>
        ))}
      </div>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border border-dashed border-border rounded-lg p-3 text-center hover:border-primary/50 transition-colors"
      >
        <label className="cursor-pointer flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Upload className="w-4 h-4" />
          <span>Drop an SVG file here or <span className="underline text-primary">click to upload</span></span>
          <input type="file" accept=".svg,image/svg+xml" onChange={uploadFile} className="hidden" />
        </label>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider block mb-2">SVG Input</label>
        <Textarea
          className="font-mono text-xs min-h-[180px] resize-none"
          placeholder="Paste SVG code here or upload a file above..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {origBytes > 0 ? `Input: ${fmtBytes(origBytes)}` : "SVG is optimized entirely in your browser — nothing is uploaded."}
        </p>
      </div>

      {output && (
        <>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono">{fmtBytes(origBytes)}</p>
              <p className="text-xs text-muted-foreground">Original</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-green-500">{fmtBytes(optBytes)}</p>
              <p className="text-xs text-muted-foreground">Optimized</p>
            </div>
            {saving > 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold font-mono text-primary">-{saving}%</p>
                <p className="text-xs text-muted-foreground">Saved</p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Optimized SVG</label>
              <Button variant="ghost" size="sm" onClick={copy}>
                <Copy className="w-3 h-3 mr-2" />Copy
              </Button>
            </div>
            <Textarea readOnly className="font-mono text-xs min-h-[120px] resize-none bg-muted" value={output} />
          </div>

          {output.startsWith("<svg") && (
            <div className="rounded-lg border border-border p-4 bg-checkerboard">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Preview</p>
              <div
                className="max-w-full overflow-hidden"
                dangerouslySetInnerHTML={{ __html: output }}
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
