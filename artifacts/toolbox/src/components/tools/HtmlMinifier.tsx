import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function minifyHtml(html: string, opts: { removeComments: boolean; collapseWhitespace: boolean; removeOptionalTags: boolean }): string {
  let out = html;

  if (opts.removeComments) {
    out = out.replace(/<!--(?!<!)[^\[>][\s\S]*?-->/g, "");
  }

  if (opts.collapseWhitespace) {
    out = out
      .replace(/\s*\n\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/>\s+</g, "><")
      .trim();
  }

  if (opts.removeOptionalTags) {
    out = out
      .replace(/<\/?(html|head|body|li|dt|dd|p|tr|td|th|thead|tbody|tfoot|option|optgroup|colgroup|col)[^>]*>/gi, "")
      .trim();
  }

  return out;
}

function fmtBytes(n: number): string {
  if (n < 1024) return n + " B";
  return (n / 1024).toFixed(1) + " KB";
}

export default function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [removeOptionalTags, setRemoveOptionalTags] = useState(false);
  const { toast } = useToast();

  const output = input.trim() ? minifyHtml(input, { removeComments, collapseWhitespace, removeOptionalTags }) : "";
  const originalBytes = new TextEncoder().encode(input).length;
  const minifiedBytes = new TextEncoder().encode(output).length;
  const saving = originalBytes > 0 ? Math.round((1 - minifiedBytes / originalBytes) * 100) : 0;

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Minified HTML copied to clipboard." });
  };

  const options = [
    { label: "Remove comments", value: removeComments, set: setRemoveComments },
    { label: "Collapse whitespace", value: collapseWhitespace, set: setCollapseWhitespace },
    { label: "Remove optional tags", value: removeOptionalTags, set: setRemoveOptionalTags },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        {options.map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={opt.value}
              onChange={(e) => opt.set(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider block mb-2">HTML Input</label>
        <Textarea
          className="font-mono text-xs min-h-[220px] resize-none"
          placeholder="Paste your HTML here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {originalBytes > 0 ? `Input: ${fmtBytes(originalBytes)}` : "Your HTML is processed entirely in the browser — nothing is uploaded."}
        </p>
      </div>

      {output && (
        <>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono">{fmtBytes(originalBytes)}</p>
              <p className="text-xs text-muted-foreground">Original</p>
            </div>
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-green-500">{fmtBytes(minifiedBytes)}</p>
              <p className="text-xs text-muted-foreground">Minified</p>
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
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Minified Output</label>
              <Button variant="ghost" size="sm" onClick={copy}>
                <Copy className="w-3 h-3 mr-2" />Copy
              </Button>
            </div>
            <Textarea
              readOnly
              className="font-mono text-xs min-h-[120px] resize-none bg-muted"
              value={output}
            />
          </div>
        </>
      )}
    </div>
  );
}
