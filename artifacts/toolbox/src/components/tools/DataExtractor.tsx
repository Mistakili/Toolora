import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Check, Sparkles, Download } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const PRESETS = [
  { label: "Contact info", schema: "Extract: full name, email address, phone number, company name, job title" },
  { label: "Invoice", schema: "Extract: invoice number, date, due date, vendor name, total amount, line items as array of {description, amount}" },
  { label: "Meeting notes", schema: "Extract: meeting date, attendees as array, action items as array of {task, owner, due date}, decisions made as array" },
  { label: "Job posting", schema: "Extract: job title, company, location, salary range, required skills as array, responsibilities as array, benefits as array" },
  { label: "Product review", schema: "Extract: product name, rating (1-5), pros as array, cons as array, reviewer sentiment (positive/neutral/negative), key phrases as array" },
];

const EXAMPLES = [
  {
    label: "Email → CRM",
    text: `From: Sarah Chen <sarah.chen@growthco.io>
Hi, I came across Toolora and I'm very interested in the enterprise plan for our team.
We're a 45-person startup in the fintech space. I'm the VP of Engineering.
Best way to reach me is sarah.chen@growthco.io or +1 415 555 0192.
Could we schedule a call this week?`,
    schema: "Extract: full name, email, phone, company, job title, team size, industry, request",
  },
  {
    label: "Legal clause",
    text: `LIMITATION OF LIABILITY. In no event shall Toolora Inc., its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service. Total liability shall not exceed the greater of $100 USD or the amount paid by you in the past 12 months.`,
    schema: "Extract: liable parties, excluded damages as array, liability cap amount, conditions for liability cap",
  },
];

export default function DataExtractor() {
  const [text, setText] = useState("");
  const [schema, setSchema] = useState("");
  const [result, setResult] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!text.trim() || !schema.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${BASE}/api/mcp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: {
            name: "extract_structured_data",
            arguments: { text, schema },
          },
        }),
      });
      const data = await res.json();
      const raw = data.result?.content?.[0]?.text ?? "{}";
      const cleaned = raw.replace(/\n\n—.*$/s, "").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed. Try rephrasing your schema description.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "extracted-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setText(ex.text);
    setSchema(ex.schema);
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">How it works:</span> Paste any unstructured text — emails, contracts, web content, notes — describe what to pull out in plain English, and get back clean JSON. Powered by AI.
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center">Try an example:</span>
        {EXAMPLES.map(ex => (
          <button
            key={ex.label}
            onClick={() => loadExample(ex)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 hover:text-primary text-muted-foreground transition-colors"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Source Text</Label>
            <Textarea
              placeholder="Paste an email, contract, web page, meeting notes, product description, or any unstructured text..."
              className="min-h-[220px] resize-none text-sm bg-muted/20"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>What to extract</Label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => setSchema(p.schema)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${schema === p.schema ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Textarea
              placeholder='Describe what to extract in plain English, e.g. "Extract: company name, contact email, budget range, and project requirements as an array"'
              className="min-h-[100px] resize-none text-sm bg-muted/20"
              value={schema}
              onChange={e => setSchema(e.target.value)}
            />
          </div>

          <Button
            onClick={handleExtract}
            disabled={loading || !text.trim() || !schema.trim()}
            className="w-full"
          >
            {loading ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" /> Extracting…</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Extract Data</>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>JSON Output</Label>
            {result && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleDownload}>
                  <Download className="w-3 h-3 mr-1" /> JSON
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleCopy}>
                  {copied ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {result ? (
            <div className="rounded-xl border border-border bg-muted/20 p-4 overflow-auto min-h-[360px]">
              <pre className="text-xs font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="min-h-[360px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center gap-3 text-muted-foreground px-8">
              {loading ? (
                <><span className="animate-spin inline-block w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full" /><p className="text-sm">Extracting structured data…</p></>
              ) : (
                <><Sparkles className="w-8 h-8 opacity-20" /><p className="text-sm">Your extracted JSON will appear here</p><p className="text-xs">Works on any text — emails, contracts, web content, notes</p></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
