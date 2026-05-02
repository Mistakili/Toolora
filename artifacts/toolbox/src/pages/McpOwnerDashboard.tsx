import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, BarChart3, Download, ExternalLink, RefreshCw, TrendingUp, TrendingDown, Eye, Bot, Github, Copy, Check, Coins, Zap, AlertTriangle } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"analytics" | "billing">("analytics");

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
          <div className="flex items-center gap-1 mb-6 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab("analytics")}
              className={
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition " +
                (activeTab === "analytics"
                  ? "text-zinc-100 border-violet-500"
                  : "text-zinc-500 border-transparent hover:text-zinc-300")
              }
            >
              <span className="inline-flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition " +
                (activeTab === "billing"
                  ? "text-zinc-100 border-emerald-500"
                  : "text-zinc-500 border-transparent hover:text-zinc-300")
              }
            >
              <span className="inline-flex items-center gap-2"><Coins className="w-4 h-4" /> Gateway billing</span>
              <span className="ml-2 text-[9px] uppercase tracking-widest text-emerald-400 align-middle">new</span>
            </button>
          </div>

          {activeTab === "billing" && (
            <GatewayBillingTab listingId={stats.listing.id} listingName={stats.listing.name} token={token} />
          )}

          {activeTab === "analytics" && (
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

          </>
          )}

          <button onClick={signOut} className="text-xs text-zinc-500 hover:text-zinc-300 mt-6">Sign out of dashboard</button>
        </>
      )}
    </main>
  );
}

// ─── Gateway billing tab ────────────────────────────────────────────────────
interface GatewayConfig {
  id: string;
  listingId: string;
  enabled: boolean;
  pricePerCallUsdcMicros: number;
  payoutWalletAddress: string;
  payoutNetwork: string;
  upstreamMcpUrl: string;
  createdAt: string | null;
  updatedAt: string | null;
}

interface BillingEvent {
  id: string;
  toolName: string | null;
  amountUsdcMicros: number;
  tooloraFeeUsdcMicros: number;
  paymentTxHash: string | null;
  payoutTxHash: string | null;
  status: string;
  errorReason: string | null;
  createdAt: string | null;
  settledAt: string | null;
}

interface BillingSummary {
  ok: true;
  payoutMode: "stub" | "broadcast";
  last24h: { calls: number; grossUsd: number; feeUsd: number; ownerEarningsUsd: number };
  last7d: { calls: number; grossUsd: number; feeUsd: number; ownerEarningsUsd: number };
  allTime: { calls: number; grossUsd: number; feeUsd: number; ownerEarningsUsd: number };
}

function GatewayBillingTab({ listingId, listingName, token }: { listingId: string; listingName: string; token: string }) {
  const [config, setConfig] = useState<GatewayConfig | null>(null);
  const [events, setEvents] = useState<BillingEvent[]>([]);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payoutMode, setPayoutMode] = useState<"stub" | "broadcast" | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const [form, setForm] = useState({
    enabled: false,
    pricePerCallUsd: 0.001,
    payoutWalletAddress: "",
    payoutNetwork: "solana",
    upstreamMcpUrl: "",
    embedEnabled: false,
    proofPublic: false,
    leaderboardOptIn: false,
  });
  // Track whether the operator has touched the form since the last successful
  // load/save. While dirty=true we MUST NOT overwrite their typed values from
  // the polling refresh — otherwise a 10s tick clobbers their edits.
  const [dirty, setDirty] = useState(false);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }), [token]);
  const proxyUrl = `${window.location.origin.replace(/\/$/, "")}/api/gateway/proxy/${listingId}`;

  // Load the static config exactly once (and on explicit reload after save).
  const loadConfig = useCallback(async () => {
    try {
      const r = await fetch(API + `/api/gateway/configs/${listingId}`, { headers });
      const cfg = await r.json();
      if (cfg.ok) {
        setConfig(cfg.config);
        setPayoutMode(cfg.payoutMode);
        if (cfg.config) {
          setForm({
            enabled: cfg.config.enabled,
            pricePerCallUsd: cfg.config.pricePerCallUsdcMicros / 1_000_000,
            payoutWalletAddress: cfg.config.payoutWalletAddress,
            payoutNetwork: cfg.config.payoutNetwork,
            upstreamMcpUrl: cfg.config.upstreamMcpUrl,
            embedEnabled: cfg.config.embedEnabled ?? false,
            proofPublic: cfg.config.proofPublic ?? false,
            leaderboardOptIn: cfg.config.leaderboardOptIn ?? false,
          });
          setDirty(false);
        }
      }
    } catch {
      setError("Could not load Gateway config. Try again.");
    }
  }, [headers, listingId]);

  // Refresh just the live data (events + summary). Safe to poll without
  // disturbing the form.
  const refreshLiveData = useCallback(async () => {
    try {
      const [evR, sumR] = await Promise.all([
        fetch(API + `/api/gateway/billing-events/${listingId}?limit=50`, { headers }),
        fetch(API + `/api/gateway/summary/${listingId}`, { headers }),
      ]);
      const [ev, sum] = await Promise.all([evR.json(), sumR.json()]);
      if (ev.ok) setEvents(ev.events);
      if (sum.ok) setSummary(sum);
    } catch {
      /* swallow polling errors */
    }
  }, [headers, listingId]);

  // Combined refresh used by the manual "Refresh" button and by save().
  // Re-loads config too, but only when the form isn't dirty (to be safe).
  const loadAll = useCallback(async () => {
    await Promise.all([dirty ? Promise.resolve() : loadConfig(), refreshLiveData()]);
  }, [dirty, loadConfig, refreshLiveData]);

  useEffect(() => {
    void loadConfig();
    void refreshLiveData();
  }, [loadConfig, refreshLiveData]);

  // Poll only events + summary every 10s so a fresh smoke-test call shows up
  // live without overwriting the operator's in-progress form edits.
  useEffect(() => {
    const id = setInterval(() => {
      void refreshLiveData();
    }, 10_000);
    return () => clearInterval(id);
  }, [refreshLiveData]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const r = await fetch(API + `/api/gateway/configs/${listingId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          enabled: form.enabled,
          pricePerCallUsd: form.pricePerCallUsd,
          payoutWalletAddress: form.payoutWalletAddress.trim(),
          payoutNetwork: form.payoutNetwork,
          upstreamMcpUrl: form.upstreamMcpUrl.trim(),
          embedEnabled: form.embedEnabled,
          proofPublic: form.proofPublic,
          leaderboardOptIn: form.leaderboardOptIn,
        }),
      });
      const d = await r.json();
      if (!d.ok) {
        setError(d.reason ? `${d.error}: ${d.reason}` : (d.error || "Save failed"));
        return;
      }
      setConfig(d.config);
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      void loadAll();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const copyProxy = async () => {
    await navigator.clipboard.writeText(proxyUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1500);
  };

  return (
    <div>
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 p-5 mb-6 flex items-start gap-4">
        <Coins className="w-6 h-6 text-emerald-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-zinc-100 mb-1">Bill agents in USDC for every call to {listingName}</h2>
          <p className="text-xs text-zinc-400">
            You set the price. Agents auto-pay via x402 (HTTP 402). 95% lands in your Solana wallet the same block;
            Toolora keeps 5%. Sub-cent unit economics — no Stripe required.{" "}
            <Link href="/gateway" className="text-emerald-300 hover:underline">Read the docs →</Link>
          </p>
        </div>
      </div>

      {payoutMode === "stub" && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 mb-6 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200/90">
            <strong>Stub payout mode</strong> is currently active. Calls will be billed and recorded, but no on-chain transfer
            is broadcast. Toolora flips this to live broadcast as soon as the platform wallet is funded — your settled balance
            carries over.
          </p>
        </div>
      )}

      {summary && (
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <BillingStatCard label="Last 24h" value={summary.last24h} />
          <BillingStatCard label="Last 7 days" value={summary.last7d} />
          <BillingStatCard label="All time" value={summary.allTime} />
        </div>
      )}

      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">Gateway configuration</h3>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => { setForm({ ...form, enabled: e.target.checked }); setDirty(true); }}
              className="w-4 h-4 accent-emerald-500"
            />
            <span className="text-xs text-zinc-300">{form.enabled ? "Billing enabled" : "Billing disabled"}</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Your gateway URL (give this to agents)</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-xs text-emerald-300 font-mono select-all truncate">
              {proxyUrl}
            </code>
            <button type="button" onClick={copyProxy} className="p-2 rounded-md border border-zinc-700 hover:border-zinc-500 text-zinc-300">
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1.5">In production this will be served at <code>gateway.toolora.dev/mcp/{listingId.slice(0, 8)}…</code></p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Price per call (USD)</label>
            <input
              type="number"
              step="0.0001"
              min="0.000001"
              max="100"
              required
              value={form.pricePerCallUsd}
              onChange={(e) => { setForm({ ...form, pricePerCallUsd: parseFloat(e.target.value) || 0 }); setDirty(true); }}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-zinc-500 mt-1">You'll receive ${(form.pricePerCallUsd * 0.95).toFixed(6)} per call (95%)</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Payout network</label>
            <select
              value={form.payoutNetwork}
              onChange={(e) => { setForm({ ...form, payoutNetwork: e.target.value }); setDirty(true); }}
              className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            >
              <option value="solana">Solana (USDC SPL)</option>
              <option value="stellar" disabled>Stellar (USDC) — coming soon</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Payout wallet address</label>
          <input
            type="text"
            required
            placeholder="Solana wallet that receives 95% of every paid call"
            value={form.payoutWalletAddress}
            onChange={(e) => { setForm({ ...form, payoutWalletAddress: e.target.value }); setDirty(true); }}
            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 font-mono focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Upstream MCP URL (your real server)</label>
          <input
            type="url"
            required
            placeholder="https://your-mcp.example.com/mcp"
            value={form.upstreamMcpUrl}
            onChange={(e) => { setForm({ ...form, upstreamMcpUrl: e.target.value }); setDirty(true); }}
            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 font-mono focus:border-emerald-500 focus:outline-none"
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            Gateway forwards paid requests here. Private addresses (loopback, RFC1918, link-local) are blocked.
            For testing, you can point at <code>{window.location.origin}/api/gateway/echo</code>.
          </p>
        </div>

        {/* Public surfaces — three independent opt-ins. All default OFF; */}
        {/* anything aggregated about your listing is private until you tick a box. */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Public surfaces (opt-in)</h4>
            <span className="text-[10px] text-zinc-600">all default off</span>
          </div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.embedEnabled}
              onChange={(e) => { setForm({ ...form, embedEnabled: e.target.checked }); setDirty(true); }}
              className="mt-1 w-4 h-4 accent-emerald-500 shrink-0"
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-zinc-200 group-hover:text-zinc-100">Embeddable live badge</div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Allow anyone to embed an iframe showing your call count + USDC paid (aggregate only).
                {form.embedEnabled && (
                  <>
                    {" "}Snippet:{" "}
                    <code className="text-emerald-300 break-all">
                      &lt;iframe src="{window.location.origin}/embed/gateway-badge/{listingId}" width="320" height="120" frameborder="0"&gt;&lt;/iframe&gt;
                    </code>
                  </>
                )}
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.proofPublic}
              onChange={(e) => { setForm({ ...form, proofPublic: e.target.checked }); setDirty(true); }}
              className="mt-1 w-4 h-4 accent-emerald-500 shrink-0"
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-zinc-200 group-hover:text-zinc-100">Public on-chain proof page</div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Publishes the last 50 billing events with deep-links to the Solana explorer.
                {form.proofPublic && (
                  <>
                    {" "}Live at <Link href={`/gateway/proof/${listingId}`} className="text-emerald-300 hover:underline">/gateway/proof/{listingId.slice(0, 8)}…</Link>
                  </>
                )}
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.leaderboardOptIn}
              onChange={(e) => { setForm({ ...form, leaderboardOptIn: e.target.checked }); setDirty(true); }}
              className="mt-1 w-4 h-4 accent-emerald-500 shrink-0"
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-zinc-200 group-hover:text-zinc-100">Show on Toolora Index leaderboard</div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Ranks your listing on <Link href="/leaderboard" className="text-emerald-300 hover:underline">/leaderboard</Link> by USDC paid.
                Aggregate-only; no caller addresses leaked.
              </p>
            </div>
          </label>
        </div>

        {error && <p className="text-xs text-amber-400">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            disabled={busy}
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2 text-sm font-semibold"
          >
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {config ? "Save config" : "Enable Gateway"}
          </button>
          {saved && <span className="text-xs text-emerald-400 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
        </div>
      </form>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-100">Recent billing events</h3>
          <button onClick={() => void loadAll()} className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
        {events.length === 0 ? (
          <p className="text-xs text-zinc-500">
            No paid calls yet. Once an agent calls your gateway URL with a valid x402 payment, you'll see settled events here.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full text-xs">
              <thead className="text-zinc-500 text-left">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Time</th>
                  <th className="px-2 py-1.5 font-medium">Tool</th>
                  <th className="px-2 py-1.5 font-medium text-right">Caller paid</th>
                  <th className="px-2 py-1.5 font-medium text-right">You earned</th>
                  <th className="px-2 py-1.5 font-medium">Status</th>
                  <th className="px-2 py-1.5 font-medium">Payout tx</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {events.map((e) => {
                  const owner = (e.amountUsdcMicros - e.tooloraFeeUsdcMicros) / 1_000_000;
                  return (
                    <tr key={e.id} className="border-t border-zinc-800/60">
                      <td className="px-2 py-1.5 text-zinc-400 tabular-nums">{e.createdAt ? new Date(e.createdAt).toLocaleString() : "-"}</td>
                      <td className="px-2 py-1.5 font-mono text-zinc-300">{e.toolName ?? "-"}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">${(e.amountUsdcMicros / 1_000_000).toFixed(6)}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-emerald-400">${owner.toFixed(6)}</td>
                      <td className="px-2 py-1.5">
                        <span className={
                          "inline-block px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-semibold " +
                          (e.status === "settled"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : e.status === "pending"
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-red-500/15 text-red-300")
                        }>{e.status}</span>
                      </td>
                      <td className="px-2 py-1.5 font-mono text-zinc-500 truncate max-w-[160px]">{e.payoutTxHash ?? "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function BillingStatCard({ label, value }: { label: string; value: { calls: number; grossUsd: number; feeUsd: number; ownerEarningsUsd: number } }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="text-xs text-zinc-400 mb-2">{label}</div>
      <div className="text-3xl font-bold text-zinc-100 tabular-nums">${value.ownerEarningsUsd.toFixed(value.ownerEarningsUsd < 1 ? 6 : 2)}</div>
      <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500">
        <span>{value.calls.toLocaleString()} calls</span>
        <span>gross ${value.grossUsd.toFixed(value.grossUsd < 1 ? 6 : 2)}</span>
      </div>
    </div>
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
