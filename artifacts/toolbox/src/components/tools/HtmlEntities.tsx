import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, ArrowDownUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ENCODE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

const NAMED_REFS: [RegExp, string][] = [
  [/&amp;/g, "&"],
  [/&lt;/g, "<"],
  [/&gt;/g, ">"],
  [/&quot;/g, '"'],
  [/&#39;/g, "'"],
  [/&#x2F;/g, "/"],
  [/&#x60;/g, "`"],
  [/&#x3D;/g, "="],
  [/&nbsp;/g, "\u00A0"],
  [/&copy;/g, "©"],
  [/&reg;/g, "®"],
  [/&trade;/g, "™"],
  [/&mdash;/g, "—"],
  [/&ndash;/g, "–"],
  [/&laquo;/g, "«"],
  [/&raquo;/g, "»"],
  [/&hellip;/g, "…"],
  [/&bull;/g, "•"],
];

function encode(text: string): string {
  return text.replace(/[&<>"'`=/]/g, (c) => ENCODE_MAP[c] ?? c);
}

function decode(html: string): string {
  let result = html;
  for (const [re, char] of NAMED_REFS) result = result.replace(re, char);
  result = result.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  return result;
}

const COMMON_ENTITIES = [
  { char: "&", entity: "&amp;", desc: "Ampersand" },
  { char: "<", entity: "&lt;", desc: "Less than" },
  { char: ">", entity: "&gt;", desc: "Greater than" },
  { char: '"', entity: "&quot;", desc: "Double quote" },
  { char: "'", entity: "&#39;", desc: "Single quote" },
  { char: "©", entity: "&copy;", desc: "Copyright" },
  { char: "®", entity: "&reg;", desc: "Registered" },
  { char: "™", entity: "&trade;", desc: "Trademark" },
  { char: "—", entity: "&mdash;", desc: "Em dash" },
  { char: "–", entity: "&ndash;", desc: "En dash" },
  { char: "…", entity: "&hellip;", desc: "Ellipsis" },
  { char: " ", entity: "&nbsp;", desc: "Non-breaking space" },
];

export default function HtmlEntities() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();

  const output = input ? (mode === "encode" ? encode(input) : decode(input)) : "";

  const handleInput = (v: string) => setInput(v);

  const swap = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Output copied to clipboard." });
  };

  return (
    <div className="space-y-5">
      {/* Mode + Swap */}
      <div className="flex gap-2">
        <Button variant={mode === "encode" ? "default" : "outline"} onClick={() => setMode("encode")} size="sm">
          Encode
        </Button>
        <Button variant={mode === "decode" ? "default" : "outline"} onClick={() => setMode("decode")} size="sm">
          Decode
        </Button>
        <Button variant="ghost" size="sm" onClick={swap} className="ml-auto">
          <ArrowDownUp className="w-4 h-4 mr-2" /> Swap
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {mode === "encode" ? "Plain Text / HTML" : "HTML Entities"}
          </label>
          <Textarea
            className="font-mono text-sm min-h-[280px] resize-none"
            placeholder={mode === "encode" ? 'Paste HTML or text — e.g. <div class="box"> or "Hello & goodbye"' : "Paste encoded HTML — e.g. &lt;div&gt; &amp; &copy; 2024"}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {mode === "encode" ? "Encoded Output" : "Decoded Text"}
            </label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copy}>
                <Copy className="w-3 h-3 mr-2" /> Copy
              </Button>
            )}
          </div>
          <Textarea
            className="font-mono text-sm min-h-[280px] resize-none"
            placeholder="Result will appear here..."
            value={output}
            readOnly
          />
        </div>
      </div>

      {/* Reference table */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Common Entities</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {COMMON_ENTITIES.map((e) => (
            <button
              key={e.entity}
              onClick={() => { setInput(e.entity); setMode("decode"); }}
              title={`Click to decode ${e.entity}`}
              className="flex items-center gap-2 bg-muted/30 hover:bg-muted/60 rounded-lg px-3 py-2 border border-border hover:border-primary/30 transition-colors text-left"
            >
              <span className="text-base w-5 text-center shrink-0">{e.char}</span>
              <div className="min-w-0">
                <p className="text-xs font-mono text-primary truncate">{e.entity}</p>
                <p className="text-xs text-muted-foreground truncate">{e.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
