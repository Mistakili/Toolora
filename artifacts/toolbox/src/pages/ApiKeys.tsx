import { useState, useEffect } from "react";
import { Plus, Trash2, Copy, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

interface ApiKey {
  id: string;
  prefix: string;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
  revoked: boolean;
  monthlyUsage: number;
}

interface KeysResponse {
  keys: ApiKey[];
  tier: string;
  limit: number;
  used: number;
}

interface NewKeyResult {
  key: string;
  prefix: string;
  label: string;
  message: string;
}

const TIER_COLORS: Record<string, string> = {
  free: "text-zinc-400",
  pro: "text-violet-400",
  team: "text-amber-400",
};

export default function ApiKeys() {
  const [data, setData] = useState<KeysResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<NewKeyResult | null>(null);
  const [creating, setCreating] = useState(false);
  const [label, setLabel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  useSEO({
    title: "API Keys — Toolora",
    description: "Manage your Toolora API keys. Generate, revoke, and monitor usage.",
  });

  async function fetchKeys() {
    try {
      const res = await fetch(`${BASE}/api/keys`, { credentials: "include" });
      if (res.status === 401) {
        window.location.href = `${BASE}/api/login?returnTo=/welcome`;
        return;
      }
      const json = await res.json() as KeysResponse;
      setData(json);
    } catch {
      setError("Failed to load API keys.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchKeys(); }, []);

  async function createKey() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ label: label || "Default" }),
      });
      const json = await res.json() as NewKeyResult & { error?: string };
      if (json.error) { setError(json.error); return; }
      setNewKey(json);
      setLabel("");
      fetchKeys();
    } catch {
      setError("Failed to create key.");
    } finally {
      setCreating(false);
    }
  }

  async function revokeKey(id: string) {
    setRevoking(id);
    try {
      await fetch(`${BASE}/api/keys/${id}`, { method: "DELETE", credentials: "include" });
      fetchKeys();
    } finally {
      setRevoking(null);
    }
  }

  function copyKey() {
    if (newKey) {
      navigator.clipboard.writeText(newKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const pct = data ? Math.round((data.used / data.limit) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-1">API Keys</h1>
        <p className="text-zinc-400 mb-8">Generate keys to authenticate requests to the Toolora API.</p>

        {/* Usage bar */}
        {data && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-sm text-zinc-400">This month's usage</span>
                <span className={`ml-2 text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-800 ${TIER_COLORS[data.tier] ?? "text-zinc-400"}`}>
                  {data.tier}
                </span>
              </div>
              <span className="text-sm font-mono">
                {data.used.toLocaleString()} / {data.limit.toLocaleString()} calls
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-violet-500"}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            {pct >= 80 && pct < 100 && (
              <div className="mt-3 flex items-start gap-2 bg-amber-950/40 border border-amber-700/50 rounded-lg px-3 py-2">
                <span className="text-amber-400 text-sm mt-0.5">⚠</span>
                <p className="text-xs text-amber-300">
                  You've used <strong>{pct}%</strong> of your monthly calls.{" "}
                  {data.tier === "free"
                    ? <><a href={`${BASE}/pricing`} className="underline hover:text-amber-200">Upgrade to Pro</a> to get 5,000 calls/month before you hit the limit.</>
                    : <>Contact us if you need a higher limit.</>
                  }
                </p>
              </div>
            )}
            {pct >= 100 && (
              <div className="mt-3 flex items-start gap-2 bg-red-950/40 border border-red-700/50 rounded-lg px-3 py-2">
                <span className="text-red-400 text-sm mt-0.5">✕</span>
                <p className="text-xs text-red-300">
                  Monthly limit reached. API calls are blocked until next month.{" "}
                  <a href={`${BASE}/pricing`} className="underline hover:text-red-200">Upgrade now</a> to restore access immediately.
                </p>
              </div>
            )}
            {pct < 80 && data.tier === "free" && (
              <p className="text-xs text-zinc-500 mt-2">
                Free tier · 200 calls/month.{" "}
                <a href={`${BASE}/pricing`} className="text-violet-400 hover:underline">Upgrade to Pro</a> for 5,000 calls/month + OCR, audio transcription, DOCX and Excel tools.
              </p>
            )}
          </div>
        )}

        {/* New key banner */}
        {newKey && (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-5 mb-6">
            <p className="text-green-400 font-semibold mb-1">Key created — save it now!</p>
            <p className="text-zinc-400 text-sm mb-3">This key won't be shown again.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-sm bg-zinc-900 px-3 py-2 rounded-lg overflow-auto">
                {showKey ? newKey.key : `${newKey.key.slice(0, 22)}${"•".repeat(20)}`}
              </code>
              <button onClick={() => setShowKey((v) => !v)} className="p-2 text-zinc-400 hover:text-white">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={copyKey} className="p-2 text-zinc-400 hover:text-white">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-green-400 mt-1">Copied!</p>}
          </div>
        )}

        {/* Create key form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold mb-3">Create new key</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Label (e.g. Production, My Agent)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
              maxLength={40}
              onKeyDown={(e) => e.key === "Enter" && createKey()}
            />
            <button
              onClick={createKey}
              disabled={creating}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>

        {/* Key list */}
        {loading ? (
          <div className="text-zinc-500 text-sm">Loading…</div>
        ) : (
          <div className="space-y-3">
            {data?.keys.length === 0 && (
              <div className="text-zinc-500 text-sm py-4 text-center">No API keys yet. Create one above.</div>
            )}
            {data?.keys.map((k) => (
              <div key={k.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-sm">{k.prefix}…</p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {k.label} · Created {new Date(k.createdAt).toLocaleDateString()} ·{" "}
                    {k.lastUsedAt ? `Last used ${new Date(k.lastUsedAt).toLocaleDateString()}` : "Never used"} ·{" "}
                    <span className="text-violet-400">{k.monthlyUsage} calls this month</span>
                  </p>
                </div>
                <button
                  onClick={() => revokeKey(k.id)}
                  disabled={revoking === k.id}
                  className="text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-40"
                  title="Revoke key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Usage instructions */}
        <div className="mt-10 border-t border-zinc-800 pt-8">
          <h2 className="text-lg font-semibold mb-3">Using your API key</h2>
          <p className="text-zinc-400 text-sm mb-4">Add the key to any request as a Bearer token:</p>
          <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm font-mono overflow-auto text-zinc-300">
{`curl -X POST https://api.toolora.dev/api/agent/ocr \\
  -H "Authorization: Bearer sk_toolora_..." \\
  -F "file=@screenshot.png"`}
          </pre>
          <p className="text-zinc-500 text-xs mt-3">
            You can also pay per call with Stellar XLM or Solana USDC — no key needed.{" "}
            <a href={`${BASE}/api-docs`} className="text-violet-400 hover:underline inline-flex items-center gap-1">
              View full docs <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
