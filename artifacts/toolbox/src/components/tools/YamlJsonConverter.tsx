import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeftRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import yaml from "js-yaml";

type Direction = "yaml-to-json" | "json-to-yaml";

function convert(input: string, direction: Direction): { output: string; error: string | null } {
  if (!input.trim()) return { output: "", error: null };
  try {
    if (direction === "yaml-to-json") {
      const parsed = yaml.load(input);
      return { output: JSON.stringify(parsed, null, 2), error: null };
    } else {
      const parsed = JSON.parse(input);
      return { output: yaml.dump(parsed, { indent: 2, lineWidth: 120 }), error: null };
    }
  } catch (e: unknown) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}

const YAML_EXAMPLE = `name: my-service
version: "1.0"
server:
  host: localhost
  port: 8080
  tls: true
database:
  url: postgres://localhost/mydb
  pool:
    min: 2
    max: 10
tags:
  - production
  - api`;

const JSON_EXAMPLE = `{
  "name": "my-service",
  "version": "1.0",
  "server": {
    "host": "localhost",
    "port": 8080,
    "tls": true
  },
  "database": {
    "url": "postgres://localhost/mydb",
    "pool": { "min": 2, "max": 10 }
  },
  "tags": ["production", "api"]
}`;

export default function YamlJsonConverter() {
  const [direction, setDirection] = useState<Direction>("yaml-to-json");
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const { output, error } = convert(input, direction);

  const swap = useCallback(() => {
    const next: Direction = direction === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json";
    setDirection(next);
    setInput(output || "");
  }, [direction, output]);

  const loadExample = () => {
    setInput(direction === "yaml-to-json" ? YAML_EXAMPLE : JSON_EXAMPLE);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast({ description: "Copied to clipboard!" });
  };

  const inputLabel = direction === "yaml-to-json" ? "YAML INPUT" : "JSON INPUT";
  const outputLabel = direction === "yaml-to-json" ? "JSON OUTPUT" : "YAML OUTPUT";
  const inputPlaceholder = direction === "yaml-to-json"
    ? "Paste your YAML here..."
    : 'Paste your JSON here — e.g. { "key": "value" }';

  return (
    <div className="space-y-4">
      {/* Direction toggle */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-md overflow-hidden border border-border">
          <button
            onClick={() => setDirection("yaml-to-json")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              direction === "yaml-to-json"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            YAML → JSON
          </button>
          <button
            onClick={() => setDirection("json-to-yaml")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              direction === "json-to-yaml"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            JSON → YAML
          </button>
        </div>
        <Button variant="outline" size="sm" onClick={swap} disabled={!output} className="gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Swap
        </Button>
        <Button variant="ghost" size="sm" onClick={loadExample} className="text-muted-foreground">
          Load example
        </Button>
      </div>

      {/* Side-by-side editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{inputLabel}</p>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            className="font-mono text-sm min-h-[320px] resize-y"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{outputLabel}</p>
            {output && (
              <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            )}
          </div>
          <div
            className={`rounded-md border min-h-[320px] p-3 font-mono text-sm overflow-auto whitespace-pre-wrap ${
              error ? "border-red-500/40 bg-red-500/5 text-red-400" : "border-border bg-muted/30 text-foreground"
            }`}
          >
            {error ? (
              <div className="flex gap-2 text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : output ? (
              output
            ) : (
              <span className="text-muted-foreground">Converted output will appear here...</span>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      {output && !error && (
        <div className="flex items-center gap-2 text-sm text-green-500">
          <CheckCircle2 className="w-4 h-4" />
          <span>Converted successfully</span>
        </div>
      )}
    </div>
  );
}
