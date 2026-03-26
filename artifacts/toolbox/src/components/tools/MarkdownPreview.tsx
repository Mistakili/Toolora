import { useState, useEffect } from "react";
import { marked } from "marked";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_MD = `# Markdown Previewer
## Instantly render your markdown

Write markdown in the left pane, and see it rendered beautifully on the right.

### Features
* Real-time rendering
* Supports **bold**, *italic*, and \`code\`
* GitHub flavored markdown

\`\`\`javascript
function hello() {
  console.log("Hello world!");
}
\`\`\`

> Blockquotes look great too.
`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [html, setHtml] = useState("");

  useEffect(() => {
    const renderMd = async () => {
      // Configure marked for safe HTML if needed, but basic usage is fine here
      const result = await marked.parse(markdown);
      setHtml(result);
    };
    renderMd();
  }, [markdown]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[600px] -m-2">
      <div className="flex flex-col border-r border-border pr-2">
        <div className="bg-muted/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground rounded-t-xl">Editor</div>
        <Textarea 
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="flex-1 rounded-none rounded-b-xl border-0 focus-visible:ring-0 resize-none font-mono text-sm p-4 bg-background"
          spellCheck={false}
        />
      </div>
      
      <div className="flex flex-col pl-2">
        <div className="bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary rounded-t-xl">Preview</div>
        <div 
          className="flex-1 p-6 overflow-y-auto bg-card rounded-b-xl prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
