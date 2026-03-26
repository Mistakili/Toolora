import { useEffect } from "react";
import { Link } from "wouter";
import { Code2, ChevronRight, Home, Copy, Check } from "lucide-react";
import { useState } from "react";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative group">
      <pre className="bg-muted/60 rounded-xl p-4 text-sm font-mono overflow-x-auto border border-border">
        <code>{code}</code>
      </pre>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute top-3 right-3 px-2 py-1 text-xs rounded-lg bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
      >
        {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
      </button>
    </div>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  const colors: Record<string, string> = {
    GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    POST: "bg-green-500/10 text-green-500 border-green-500/20",
  };
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border">
      <span className={`px-2 py-0.5 text-xs font-bold rounded border shrink-0 ${colors[method]}`}>{method}</span>
      <div>
        <code className="text-sm font-mono">/api{path}</code>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

export default function ApiDocs() {
  useEffect(() => {
    document.title = "Public API Docs | Toolora";
  }, []);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://toolora.app";

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">API Docs</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Code2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Public API</h1>
          <p className="text-muted-foreground text-sm mt-1">Use Toolora's tools programmatically — no API key required</p>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6">
            <p className="text-sm font-medium text-primary mb-1">Base URL</p>
            <code className="text-sm font-mono">{baseUrl}/api</code>
            <p className="text-xs text-muted-foreground mt-2">All responses are JSON. No authentication required for read endpoints. Rate limit: 60 requests/minute per IP.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Endpoints</h2>
          <div className="space-y-3">
            <Endpoint method="GET" path="/healthz" desc="Health check — returns server status" />
            <Endpoint method="GET" path="/tools/popular" desc="Returns the most-used tools with usage counts" />
            <Endpoint method="POST" path="/tools/{slug}/use" desc="Increment the usage counter for a tool" />
            <Endpoint method="GET" path="/auth/user" desc="Returns the currently authenticated user (null if not logged in)" />
            <Endpoint method="GET" path="/user/history" desc="Returns the authenticated user's recent tool history (requires sign-in)" />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Examples</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Get popular tools</h3>
              <CodeBlock code={`curl ${baseUrl}/api/tools/popular`} />
              <div className="mt-2">
                <CodeBlock lang="json" code={`{
  "tools": [
    { "slug": "json-formatter", "usageCount": 1420 },
    { "slug": "pdf-merge", "usageCount": 980 },
    { "slug": "password-generator", "usageCount": 870 }
  ]
}`} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Track a tool usage</h3>
              <CodeBlock code={`curl -X POST ${baseUrl}/api/tools/json-formatter/use`} />
              <div className="mt-2">
                <CodeBlock lang="json" code={`{ "success": true, "usageCount": 1421 }`} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Get current user (with session cookie)</h3>
              <CodeBlock code={`curl -b "sid=<your-session-id>" ${baseUrl}/api/auth/user`} />
              <div className="mt-2">
                <CodeBlock lang="json" code={`{
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "profileImageUrl": "https://..."
  }
}`} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Response Formats</h2>
          <p className="text-sm text-muted-foreground mb-4">All error responses follow this shape:</p>
          <CodeBlock lang="json" code={`{ "error": "Human-readable error message" }`} />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Usage Notes</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ All read endpoints are public and require no authentication</li>
            <li>✓ Toolora's tool processing happens client-side — there are no server-side processing endpoints for file/text tools</li>
            <li>✓ No API key required for the current endpoints</li>
            <li>✓ CORS is enabled — you can call these endpoints from any browser origin</li>
            <li>⚠ Rate limiting applies — 60 requests per minute per IP</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
