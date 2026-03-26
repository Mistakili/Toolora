import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, FileJson, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between bg-muted/50 p-2 rounded-xl border border-border">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleFormat} disabled={!input}>Format (Pretty Print)</Button>
          <Button variant="outline" onClick={handleMinify} disabled={!input}>Minify</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => {setInput(""); setError(null)}}>Clear</Button>
          <Button onClick={handleCopy} disabled={!input}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />} Copy
          </Button>
        </div>
      </div>

      <div className="flex-1 relative min-h-[500px]">
        <Textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder='{"paste": "your JSON here"}'
          className="w-full h-full font-mono text-sm p-6 resize-none rounded-xl focus-visible:ring-primary bg-background border-2"
          spellCheck={false}
        />
        {!input && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <FileJson className="w-16 h-16 mb-4" />
            <p>Paste JSON content to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
