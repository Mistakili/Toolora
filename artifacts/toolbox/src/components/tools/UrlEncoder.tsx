import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ArrowDownUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const process = (value: string, m: "encode" | "decode") => {
    setError("");
    if (!value) { setOutput(""); return; }
    try {
      if (m === "encode") {
        setOutput(encodeURIComponent(value));
      } else {
        setOutput(decodeURIComponent(value));
      }
    } catch {
      setError("Invalid input — could not " + m);
      setOutput("");
    }
  };

  const handleInput = (v: string) => { setInput(v); process(v, mode); };

  const switchMode = (m: "encode" | "decode") => {
    setMode(m);
    process(input, m);
  };

  const swap = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    process(output, newMode);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Output copied to clipboard." });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant={mode === "encode" ? "default" : "outline"} onClick={() => switchMode("encode")} size="sm">Encode</Button>
        <Button variant={mode === "decode" ? "default" : "outline"} onClick={() => switchMode("decode")} size="sm">Decode</Button>
        <Button variant="ghost" size="sm" onClick={swap} className="ml-auto">
          <ArrowDownUp className="w-4 h-4 mr-2" />Swap
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {mode === "encode" ? "Plain Text / URL" : "Encoded Input"}
          </label>
          <Textarea
            className="font-mono text-sm min-h-[300px] resize-none"
            placeholder={mode === "encode" ? "Paste your URL or text..." : "Paste encoded URL string..."}
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
                <Copy className="w-3 h-3 mr-2" />Copy
              </Button>
            )}
          </div>
          <Textarea
            className={`font-mono text-sm min-h-[300px] resize-none ${error ? "border-destructive text-destructive" : ""}`}
            placeholder="Result will appear here..."
            value={error || output}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
