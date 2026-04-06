import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function toSlug(text: string, separator: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, separator);
}

export default function TextToSlug() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const { toast } = useToast();

  const slug = toSlug(input, separator);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    toast({ title: "Copied!", description: "Slug copied to clipboard." });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider block mb-2">Input Text</label>
        <Textarea
          className="font-mono text-sm min-h-[120px] resize-none"
          placeholder="My Blog Post Title — 2026 Edition!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Separator</span>
        <div className="flex gap-2">
          {["-", "_", "."].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={separator === s ? "default" : "outline"}
              className="font-mono w-10"
              onClick={() => setSeparator(s)}
            >
              {s}
            </Button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setInput("")} className="ml-auto">
          <RefreshCw className="w-4 h-4 mr-2" />Clear
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Slug Output</label>
          {slug && (
            <Button variant="ghost" size="sm" onClick={() => copy(slug)}>
              <Copy className="w-3 h-3 mr-2" />Copy
            </Button>
          )}
        </div>
        <Input
          readOnly
          className="font-mono text-sm bg-muted"
          value={slug}
          placeholder="your-slug-will-appear-here"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>

      {input && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
          <p className="font-medium text-foreground">Preview</p>
          <p className="text-muted-foreground break-all font-mono text-xs">
            https://example.com/blog/<span className="text-primary font-semibold">{slug || "…"}</span>
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground pt-1">
            <span>Length: <strong className="text-foreground">{slug.length}</strong></span>
            <span>Words: <strong className="text-foreground">{slug ? slug.split(separator).filter(Boolean).length : 0}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
