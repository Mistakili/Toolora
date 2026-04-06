import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, ArrowRight } from "lucide-react";

function htmlToMarkdown(html: string, includeLinks: boolean, includeImages: boolean): string {
  if (!html.trim()) return "";

  const div = document.createElement("div");
  div.innerHTML = html;

  function convert(node: Node): string {
    if (node.nodeType === 3) return node.textContent ?? "";
    if (node.nodeType !== 1) return "";
    const el = node as Element;
    const tag = el.tagName?.toLowerCase() ?? "";
    const inner = () => Array.from(el.childNodes).map(convert).join("");

    switch (tag) {
      case "script": case "style": case "nav": case "footer": case "head": return "";
      case "h1": return `\n# ${inner().trim()}\n\n`;
      case "h2": return `\n## ${inner().trim()}\n\n`;
      case "h3": return `\n### ${inner().trim()}\n\n`;
      case "h4": return `\n#### ${inner().trim()}\n\n`;
      case "h5": return `\n##### ${inner().trim()}\n\n`;
      case "h6": return `\n###### ${inner().trim()}\n\n`;
      case "p": { const t = inner().trim(); return t ? `\n${t}\n` : ""; }
      case "br": return "\n";
      case "hr": return "\n---\n";
      case "strong": case "b": return `**${inner()}**`;
      case "em": case "i": return `_${inner()}_`;
      case "del": case "s": return `~~${inner()}~~`;
      case "code": return el.closest("pre") ? el.textContent ?? "" : `\`${el.textContent}\``;
      case "pre": {
        const code = el.querySelector("code");
        const lang = code?.className?.replace(/.*language-(\w+).*/, "$1") ?? "";
        return `\n\`\`\`${lang}\n${el.textContent?.trim()}\n\`\`\`\n`;
      }
      case "blockquote": return `\n> ${inner().trim().replace(/\n/g, "\n> ")}\n`;
      case "ul": {
        const items = Array.from(el.children).map(li => `- ${Array.from(li.childNodes).map(convert).join("").trim()}`);
        return "\n" + items.join("\n") + "\n";
      }
      case "ol": {
        const items = Array.from(el.children).map((li, i) => `${i + 1}. ${Array.from(li.childNodes).map(convert).join("").trim()}`);
        return "\n" + items.join("\n") + "\n";
      }
      case "li": return inner();
      case "a": {
        const href = el.getAttribute("href") ?? "";
        const text = inner().trim();
        if (!includeLinks || !href || href.startsWith("javascript:")) return text;
        return href === text ? href : `[${text}](${href})`;
      }
      case "img": {
        const src = el.getAttribute("src") ?? "";
        const alt = el.getAttribute("alt") ?? "";
        if (!src || src.startsWith("data:")) return includeImages ? `![${alt}](image)` : alt;
        return includeImages ? `![${alt}](${src})` : alt;
      }
      case "table": {
        const rows = Array.from(el.querySelectorAll("tr"));
        if (!rows.length) return "";
        const toRow = (r: Element) => "| " + Array.from(r.querySelectorAll("th,td")).map(c => c.textContent?.trim().replace(/\|/g, "\\|") ?? "").join(" | ") + " |";
        const [head, ...body] = rows;
        const cols = head.querySelectorAll("th,td").length;
        const sep = "| " + Array(cols).fill("---").join(" | ") + " |";
        return "\n" + toRow(head) + "\n" + sep + "\n" + body.map(toRow).join("\n") + "\n";
      }
      default: return inner();
    }
  }

  let md = convert(div).replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

const EXAMPLES = [
  {
    label: "Blog post",
    html: `<h1>Getting Started with RAG</h1><p>Retrieval-Augmented Generation (<strong>RAG</strong>) lets your AI access <em>real-time data</em> without retraining.</p><h2>Key Components</h2><ul><li>Vector database</li><li>Embedding model</li><li>LLM</li></ul><p>Read more at <a href="https://toolora.dev">Toolora</a>.</p>`,
  },
  {
    label: "Table",
    html: `<h2>Model Comparison</h2><table><tr><th>Model</th><th>Context</th><th>Cost/1k</th></tr><tr><td>GPT-4o</td><td>128k</td><td>$0.005</td></tr><tr><td>Claude 3.5</td><td>200k</td><td>$0.003</td></tr></table>`,
  },
];

export default function HtmlToMarkdown() {
  const [input, setInput] = useState("");
  const [includeLinks, setIncludeLinks] = useState(true);
  const [includeImages, setIncludeImages] = useState(false);
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => htmlToMarkdown(input, includeLinks, includeImages), [input, includeLinks, includeImages]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "converted.md";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => setInput(ex.html)}
              className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 hover:text-primary text-muted-foreground transition-colors"
            >
              Try: {ex.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={includeLinks} onChange={e => setIncludeLinks(e.target.checked)} className="accent-primary" />
            Preserve links
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={includeImages} onChange={e => setIncludeImages(e.target.checked)} className="accent-primary" />
            Include images
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>HTML Input</Label>
          <Textarea
            placeholder="Paste HTML here — from a web scrape, email template, CMS export, or any HTML source..."
            className="min-h-[420px] resize-none font-mono text-xs bg-muted/20"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          {input && (
            <p className="text-xs text-muted-foreground">{input.length.toLocaleString()} characters</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
              Markdown Output
            </Label>
            <div className="flex gap-2">
              {markdown && (
                <>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleDownload}>
                    <Download className="w-3 h-3 mr-1" /> .md
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleCopy}>
                    {copied ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </>
              )}
            </div>
          </div>
          {markdown ? (
            <div className="min-h-[420px] rounded-xl border border-border bg-muted/20 p-4 overflow-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/80 leading-relaxed">{markdown}</pre>
            </div>
          ) : (
            <div className="min-h-[420px] rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              Markdown will appear here
            </div>
          )}
          {markdown && (
            <p className="text-xs text-muted-foreground">{markdown.length.toLocaleString()} characters · {markdown.split("\n").length} lines</p>
          )}
        </div>
      </div>
    </div>
  );
}
