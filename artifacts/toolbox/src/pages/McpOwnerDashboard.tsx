import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, BarChart3, Download, ExternalLink, RefreshCw, TrendingUp, TrendingDown, Eye, Bot, Github, Copy, Check } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

interface Stats {
  ok: true;
  listing: { id: string; name: string; category: string; featured: boolean };
  summary: {
    installs_7d: number;
    installs_prev_7d: number;
    installs_change_pct: number | null;
    installs_all_time: number;
    views_7d: number;
    views_prev_7d: number;
    views_change_pct: number | null;
    views_all_time: number;
    badge_views_7d: number;
    badge_views_all_time: number;
  };
  byKind: Array<{ kind: string; count: number }>;
  daily: Array<{ day: string; kind: string; count: number }>;
  topReferers: Array<{ referer: string | null; count: number }>;
}

function tokenKey(slug: string) {
  return `toolora.owner.${slug}`;
}

export default function McpOwnerDashboard() {
  const [, params] = useRoute("/mcp-hub/owner/:slug");
  const slug = params?.slug ?? "";

  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useSEO({
    title: "Owner dashboard — MCP install analytics on Toolora",
    description: "Track installs, views, and badge impressions for your MCP server. Free for every listed server.",
    canonical: `https://toolora.dev/mcp-hub/owner/${slug}`,
  });

  useEffect(() => {
    if (!slug) return;
    const stored = localStorage.getItem(tokenKey(slug));
    if (stored) setToken(stored);
  }, [slug]);

  useEffect(() => {
    if (!slug || !token) return;
    setBusy(true);
    setError(null);
    fetch(API + `/api/directory/owner/${encodeURIComponent(slug)}/stats`, {
      headers: { "X-Owner-Token": token },
    })
      .then((r) => r.json().then((d) => ({ status: r.status, d })))
      .then(({ status, d }) => {
        if (status === 401) {
          localStorage.removeItem(tokenKey(slug));
          setToken("");
          setError("Session expired. Re-enter your owner email.");
          return;
        }
        if (!d.ok) throw new Error("server_error");
        setStats(d as Stats);
      })
      .catch(() => setError("Could not load stats. Try again in a moment."))
      .finally(() => setBusy(false));
  }, [slug, token]);

  const claim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(API + "/api/directory/owner/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email: email.trim() }),
      });
      const d = await r.json();
      if (!d.ok) {
        setError(d.hint || d.error || "Email did not match the listing's owner email on file.");
        return;
      }
      localStorage.setItem(tokenKey(slug), d.token);
      setToken(d.token);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(tokenKey(slug));
    setToken("");
    setStats(null);
  };

  if (!slug) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-xl font-semibold text-zinc-100">Owner dashboard</h1>
        <p className="text-sm text-zinc-400 mt-2">Open the dashboard from your server's listing page.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href={`/mcp-hub/server/${slug}`} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to listing
      </Link>

      <div className="flex items-center gap-2 mb-2 text-xs text-violet-400 uppercase tracking-widest font-semibold">
        <BarChart3 className="w-3.5 h-3.5" /> Owner dashboard
      </div>
      <h1 className="text-3xl font-bold text-zinc-100 mb-1">{stats?.listing.name ?? slug}</h1>
      <p className="text-sm text-zinc-400 mb-8">Free analytics for every listed MCP server. Updated in real time.</p>

      {!token && (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <form onSubmit={claim} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">Option A · Email on file</h3>
            <p className="text-xs text-zinc-500 mb-3">For listings submitted via Polar checkout.</p>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Email you submitted with</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
            />
            {error && <p className="mt-2 text-xs text-amber-400">{error}</p>}
            <button
              disabled={busy}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-2 text-sm font-semibold"
            >
              {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sign in via email"}
            </button>
          </form>

          <GithubClaimCard slug={slug} onSuccess={(t) => { localStorage.setItem(tokenKey(slug), t); setToken(t); }} />
        </div>
      )}

      {token && stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={<Download className="w-4 h-4 text-emerald-400" />}
              label="Installs · last 7 days"
              value={stats.summary.installs_7d}
              changePct={stats.summary.installs_change_pct}
              subtitle={`${stats.summary.installs_all_time.toLocaleString()} all-time`}
            />
            <StatCard
              icon={<Eye className="w-4 h-4 text-violet-400" />}
              label="Listing views · 7d"
              value={stats.summary.views_7d}
              changePct={stats.summary.views_change_pct}
              subtitle={`${stats.summary.views_all_time.toLocaleString()} all-time`}
            />
            <StatCard
              icon={<Bot className="w-4 h-4 text-cyan-400" />}
              label="README badge views · 7d"
              value={stats.summary.badge_views_7d}
              subtitle={`${stats.summary.badge_views_all_time.toLocaleString()} all-time`}
            />
          </div>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Installs by client (last 7 days)</h2>
            <ClientBreakdown rows={stats.byKind} />
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Top referrers (last 7 days)</h2>
            {stats.topReferers.length === 0 ? (
              <p className="text-xs text-zinc-500">Not enough data yet. Add the README badge to start collecting referrer data from GitHub.</p>
            ) : (
              <ul className="space-y-1.5">
                {stats.topReferers.slice(0, 8).map((r, i) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <a href={r.referer ?? "#"} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-zinc-100 truncate max-w-[80%] inline-flex items-center gap-1">
                      {prettyRef(r.referer)} <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                    </a>
                    <span className="text-zinc-500 tabular-nums">{r.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 p-6 mb-6">
            <h2 className="text-sm font-semibold text-zinc-100 mb-2">Want a feature in MCP Weekly?</h2>
            <p className="text-xs text-zinc-400 mb-3">We pick 3 new servers + 1 hidden gem every Friday. If your install rate is rising, you're already a candidate. Reply to <a href="mailto:hello@toolora.dev" className="text-emerald-400 hover:underline">hello@toolora.dev</a> with what's new.</p>
          </section>

          <button onClick={signOut} className="text-xs text-zinc-500 hover:text-zinc-300">Sign out of dashboard</button>
        </>
      )}
    </main>
  );
}

function StatCard({ icon, label, value, changePct, subtitle }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  changePct?: number | null;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">{icon}{label}</div>
      <div className="text-3xl font-bold text-zinc-100 tabular-nums">{value.toLocaleString()}</div>
      <div className="flex items-center gap-2 mt-1">
        {typeof changePct === "number" && (
          <span className={"inline-flex items-center gap-0.5 text-[11px] font-medium " + (changePct >= 0 ? "text-emerald-400" : "text-red-400")}>
            {changePct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {changePct >= 0 ? "+" : ""}{changePct}%
          </span>
        )}
        {subtitle && <span className="text-[11px] text-zinc-500">{subtitle}</span>}
      </div>
    </div>
  );
}

function ClientBreakdown({ rows }: { rows: Array<{ kind: string; count: number }> }) {
  const installs = rows.filter((r) => r.kind.startsWith("install_"));
  const total = installs.reduce((s, r) => s + r.count, 0) || 1;
  if (installs.length === 0) {
    return <p className="text-xs text-zinc-500">No installs in the last 7 days yet. Share your listing URL to start tracking.</p>;
  }
  const labels: Record<string, string> = {
    install_claude: "Claude Desktop",
    install_cursor: "Cursor",
    install_chatgpt: "ChatGPT",
    install_continue: "Continue",
    install_zed: "Zed",
    install_other: "Other (Windsurf / VS Code / etc.)",
  };
  return (
    <ul className="space-y-2.5">
      {installs.sort((a, b) => b.count - a.count).map((r) => {
        const pct = Math.round((r.count / total) * 100);
        return (
          <li key={r.kind}>
            <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
              <span>{labels[r.kind] ?? r.kind}</span>
              <span className="tabular-nums text-zinc-400">{r.count} · {pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-950 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500" style={{ width: pct + "%" }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function GithubClaimCard({ slug, onSuccess }: { slug: string; onSuccess: (token: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [githubOwner, setGithubOwner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const start = async () => {
    setBusy(true); setError(null);
    try {
      const r = await fetch(API + "/api/directory/owner/claim-github/start", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }),
      });
      const d = await r.json();
      if (!d.ok) { setError(d.hint || d.error || "Could not start verification."); return; }
      setVerifyToken(d.verifyToken); setGithubOwner(d.githubOwner);
    } catch { setError("Network error. Try again."); }
    finally { setBusy(false); }
  };

  const verify = async () => {
    setBusy(true); setError(null);
    try {
      const r = await fetch(API + "/api/directory/owner/claim-github/verify", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }),
      });
      const d = await r.json();
      if (!d.ok) { setError(d.hint || d.error || "Verification string not found in your GitHub bio yet."); return; }
      onSuccess(d.token);
    } catch { setError("Network error. Try again."); }
    finally { setBusy(false); }
  };

  const copy = async () => {
    if (!verifyToken) return;
    await navigator.clipboard.writeText(verifyToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/30 to-zinc-900/40 p-6">
      <h3 className="text-sm font-semibold text-zinc-100 mb-1 inline-flex items-center gap-2"><Github className="w-4 h-4" /> Option B · GitHub bio verification</h3>
      <p className="text-xs text-zinc-400 mb-3">For the 340+ servers we auto-listed. No email needed.</p>

      {!verifyToken && (
        <>
          <p className="text-xs text-zinc-400 mb-3">We'll generate a one-line code. Paste it into your GitHub bio, then click verify. You can remove it from your bio right after.</p>
          <button onClick={start} disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 disabled:opacity-50 px-4 py-2 text-sm font-semibold">
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Start GitHub verification</>}
          </button>
        </>
      )}

      {verifyToken && (
        <>
          <p className="text-xs text-zinc-400 mb-2">
            1. Open <a href="https://github.com/settings/profile" target="_blank" rel="noopener noreferrer" className="text-violet-300 underline">github.com/settings/profile</a>
            {githubOwner && <> (signed in as <strong className="text-zinc-200">@{githubOwner}</strong>)</>}
          </p>
          <p className="text-xs text-zinc-400 mb-2">2. Paste this into your "Bio" and save:</p>
          <div className="flex items-center gap-2 mb-3">
            <code className="flex-1 rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-emerald-300 font-mono select-all">{verifyToken}</code>
            <button onClick={copy} className="p-2 rounded-md border border-zinc-700 hover:border-zinc-500 text-zinc-300">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-zinc-400 mb-3">3. Click verify:</p>
          <button onClick={verify} disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-4 py-2 text-sm font-semibold">
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify my GitHub bio"}
          </button>
        </>
      )}

      {error && <p className="mt-3 text-xs text-amber-400">{error}</p>}
    </div>
  );
}

function prettyRef(r: string | null): string {
  if (!r) return "(direct)";
  try {
    const u = new URL(r);
    return u.hostname + u.pathname.replace(/\/$/, "");
  } catch {
    return r;
  }
}
