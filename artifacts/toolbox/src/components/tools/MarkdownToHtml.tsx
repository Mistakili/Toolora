import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Eye, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function mdToHtml(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code${lang ? ` class="language-${lang}"` : ""}>${code.trim()}</code></pre>`;
  });

  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>");

  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  html = html.replace(/^\s*[-*+]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, "<li>$1</li>");

  html = html.replace(/^---$/gm, "<hr />");
  html = html.replace(/^___$/gm, "<hr />");

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  html = html.replace(/^&gt;\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  const lines = html.split("\n");
  const result: string[] = [];
  let inPre = false;

  for (const line of lines) {
    if (line.startsWith("<pre>")) inPre = true;
    if (line.startsWith("</pre>")) inPre = false;

    if (!inPre && line.trim() && !line.match(/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|img)/)) {
      result.push(`<p>${line}</p>`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

const SAMPLE = `# Hello, Markdown

This is a **bold** and *italic* example.

## Features

- Item one
- Item two  
- Item three

> A blockquote with some insight.

\`\`\`js
const hello = "world";
console.log(hello);
\`\`\`

Visit [Toolora](https://toolora.dev) — all tools run in your browser.
`;

export default function MarkdownToHtml() {
  const [input, setInput] = useState(SAMPLE);
  const [view, setView] = useState<"preview" | "html">("preview");
  const { toast } = useToast();

  const html = mdToHtml(input);

  const copy = () => {
    navigator.clipboard.writeText(html);
    toast({ title: "Copied!", description: "HTML copied to clipboard." });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider block">Markdown</label>
          <Textarea
            className="font-mono text-sm min-h-[420px] resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write Markdown here..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant={view === "preview" ? "default" : "outline"} onClick={() => setView("preview")}>
                <Eye className="w-4 h-4 mr-2" />Preview
              </Button>
              <Button size="sm" variant={view === "html" ? "default" : "outline"} onClick={() => setView("html")}>
                <Code2 className="w-4 h-4 mr-2" />HTML
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={copy}>
              <Copy className="w-3 h-3 mr-2" />Copy HTML
            </Button>
          </div>

          {view === "preview" ? (
            <div
              className="rounded-lg border border-border bg-background p-4 min-h-[420px] overflow-auto prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <Textarea
              readOnly
              className="font-mono text-xs min-h-[420px] resize-none bg-muted"
              value={html}
            />
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Conversion runs entirely in your browser — no content is uploaded.</p>
    </div>
  );
}
