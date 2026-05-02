import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Copy, ExternalLink, Loader2, Sparkles, ShieldCheck, Coins, Zap } from "lucide-react";

interface InitResponse {
  ok: boolean;
  specId?: string;
  mcpUrl?: string;
  toolCount?: number;
  baseUrl?: string;
  title?: string;
  warnings?: string[];
  error?: string;
}

export default function Publish() {
  const [specUrl, setSpecUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<InitResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Client-side pre-validation — fail fast on obvious garbage so users see a
  // useful message in <50ms instead of waiting for the server round-trip.
  const validateUrl = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) return "Paste a URL to get started.";
    if (trimmed.length > 2048) return "URL is too long (max 2048 chars).";
    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      return "That doesn't look like a valid URL. Try something like https://petstore3.swagger.io/api/v3/openapi.json";
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "URL must start with https:// (or http:// for local testing).";
    }
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateUrl(specUrl);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    setBusy(true);
    setResult(null);
    setErrorMsg(null);
    try {
      const r = await fetch("/api/gateway/openapi-to-mcp/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specUrl: specUrl.trim() }),
      });
      const data = (await r.json()) as InitResponse & { reason?: string };
      if (!r.ok || !data.ok) {
        if (r.status === 429) {
          setErrorMsg(data.reason ?? "Too many submissions from your IP. Try again in an hour.");
        } else if (data.error === "invalid_url") {
          setErrorMsg(data.reason ?? "Invalid URL.");
        } else if (data.error === "spec_invalid") {
          setErrorMsg(`That URL didn't parse as an OpenAPI 3 spec. ${data.reason ?? ""}`.trim());
        } else {
          setErrorMsg(data.error ?? `Failed (HTTP ${r.status}) — make sure the URL points at a public OpenAPI 3 JSON spec.`);
        }
        return;
      }
      setResult(data);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    } finally {
      setBusy(false);
    }
  };

  const tryExample = () => {
    setSpecUrl("https://petstore3.swagger.io/api/v3/openapi.json");
    setErrorMsg(null);
  };

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch { /* noop */ }
  };

  const fullMcpUrl = result?.mcpUrl
    ? (result.mcpUrl.startsWith("http") ? result.mcpUrl : `${window.location.origin}${result.mcpUrl}`)
    : "";

  const claudeConfig = fullMcpUrl ? JSON.stringify({
    mcpServers: {
      [`toolora-${(result?.title ?? "api").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`]: {
        url: fullMcpUrl,
      },
    },
  }, null, 2) : "";

  const curlSnippet = fullMcpUrl ? `curl -X POST ${fullMcpUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'` : "";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-16 pb-12 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5" />
        <div className="container mx-auto px-4 max-w-4xl relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-5 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Toolora Gateway · Inbound funnel
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            Have an API? Get paid in USDC in 60 seconds.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Paste a public OpenAPI 3 spec URL. Toolora wraps it in an MCP server,
            charges agents per call in Solana USDC via x402, and pays you 95%
            on-chain. No signup, no SDK, no Stripe account.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="url"
              required
              placeholder="https://example.com/openapi.json"
              value={specUrl}
              onChange={(e) => setSpecUrl(e.target.value)}
              disabled={busy}
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 disabled:opacity-50"
              data-testid="input-openapi-url"
            />
            <button
              type="submit"
              disabled={busy || !specUrl.trim()}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              data-testid="button-generate-mcp"
            >
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <>Generate MCP <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {errorMsg ? (
            <div className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg p-3 mb-4">
              {errorMsg}
            </div>
          ) : null}

          <div className="text-xs text-muted-foreground">
            Don't have one handy?{" "}
            <button
              type="button"
              onClick={tryExample}
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              data-testid="button-try-example"
            >
              Try the Swagger Petstore example
            </button>
            .
          </div>

          {/* Trust bullets */}
          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border/50 bg-card/30">
              <Coins className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">95% to you</div>
                <div className="text-xs text-muted-foreground">Toolora keeps 5% for the rail. No card, no contract.</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border/50 bg-card/30">
              <ShieldCheck className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">On-chain settlement</div>
                <div className="text-xs text-muted-foreground">USDC on Solana. Verifiable signatures, sub-second.</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border/50 bg-card/30">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Instant test</div>
                <div className="text-xs text-muted-foreground">No signup. Stub mode lets agents try before paying.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result */}
      {result?.ok && fullMcpUrl ? (
        <section className="py-10 border-b border-border/40">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold">Your MCP is live.</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Toolora parsed <span className="font-mono text-foreground">{result.title}</span> and exposed{" "}
                <span className="font-bold text-emerald-400">{result.toolCount}</span> tool(s) at:
              </p>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border mb-4">
                <code className="flex-1 text-sm font-mono text-emerald-400 break-all" data-testid="text-mcp-url">{fullMcpUrl}</code>
                <button
                  onClick={() => copy(fullMcpUrl, "url")}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted transition-colors inline-flex items-center gap-1.5"
                  data-testid="button-copy-url"
                >
                  {copied === "url" ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>

              {result.warnings?.length ? (
                <div className="text-xs text-amber-300/80 bg-amber-500/5 border border-amber-500/20 rounded-md p-2.5 mb-4">
                  <strong>Heads up:</strong> {result.warnings.join(" · ")}
                </div>
              ) : null}
            </div>

            {/* Code samples */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Claude Desktop config</span>
                  <button onClick={() => copy(claudeConfig, "claude")} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                    {copied === "claude" ? <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto"><code>{claudeConfig}</code></pre>
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Test from any shell</span>
                  <button onClick={() => copy(curlSnippet, "curl")} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                    {copied === "curl" ? <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto"><code>{curlSnippet}</code></pre>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start">
              <Link href="/gateway" className="px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                See the Gateway dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/leaderboard" className="px-5 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted transition-colors inline-flex items-center gap-2">
                Check the live leaderboard <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* How it works */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-display font-bold mb-6">How it works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "You paste an OpenAPI URL", d: "Public OpenAPI 3 JSON. Toolora fetches it server-side, validates against SSRF, and parses every operation." },
              { n: "02", t: "Toolora wraps it in MCP", d: "Each operation becomes an MCP tool with a JSON schema. The MCP URL is callable from Claude, ChatGPT, Cursor, Replit Agent, anything that speaks MCP." },
              { n: "03", t: "Agents pay per call in USDC", d: "Calls are charged via x402. You set the price; we settle on-chain. Owner gets 95%, Toolora keeps 5%." },
            ].map(s => (
              <div key={s.n} className="rounded-xl border border-border bg-card/50 p-5">
                <div className="text-xs font-mono text-emerald-400 mb-2">{s.n}</div>
                <div className="font-bold mb-1.5">{s.t}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
