import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toSentenceCase = () => {
    setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()));
  };

  const toTitleCase = () => {
    setText(text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
  };

  const converters = [
    { label: "UPPERCASE", action: () => setText(text.toUpperCase()) },
    { label: "lowercase", action: () => setText(text.toLowerCase()) },
    { label: "Title Case", action: toTitleCase },
    { label: "Sentence case", action: toSentenceCase },
    { label: "camelCase", action: () => setText(text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '')) },
    { label: "snake_case", action: () => setText(text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || '') },
    { label: "kebab-case", action: () => setText(text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || '') },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-wrap gap-2">
        {converters.map(conv => (
          <Button 
            key={conv.label} 
            variant="secondary" 
            onClick={conv.action}
            className="hover:bg-primary hover:text-primary-foreground transition-all"
            disabled={!text}
          >
            {conv.label}
          </Button>
        ))}
      </div>
      
      <div className="flex-1 relative min-h-[400px]">
        <Textarea
          placeholder="Enter text to convert..."
          className="w-full h-full min-h-[400px] resize-none text-base p-6 rounded-2xl focus-visible:ring-primary/20 bg-background font-mono"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {text && (
            <Button size="sm" variant="outline" onClick={() => setText("")}>
              Clear
            </Button>
          )}
          <Button size="sm" onClick={handleCopy} disabled={!text}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}
