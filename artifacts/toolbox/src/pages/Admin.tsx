import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  ChevronRight, Home, BarChart2, Zap, Copy, Check, ExternalLink, RefreshCw, Lock,
} from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";

function getApiBase() {
  if (typeof window === "undefined") return "https://toolora-api.replit.app";
  return window.location.origin
    .replace(/toolora\.replit\.app/, "toolora-api.replit.app")
    .replace(/:\d+$/, ":8080");
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminStats {
  summary: { totalCalls: number; totalXlmEarned: string };
  byEndpoint: { endpoint: string; calls: number; xlmEarned: string }[];
  daily: { day: string; calls: number; xlmEarned: number }[];
  payments: {
    id: number;
    endpoint: string;
    txHash: string;
    fromAddress: string | null;
    amountXlm: string | null;
    network: string | null;
    createdAt: string;
  }[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-3xl font-bold font-display">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function CopyCell({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group"
      title={text}
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      <span>{text.slice(0, 10)}…{text.slice(-6)}</span>
      {copied
        ? <Check className="w-3 h-3 text-green-500 shrink-0" />
        : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0" />}
    </button>
  );
}

function endpointLabel(ep: string) {
  return ep.replace("/api/agent/", "").replace("/", " › ");
}

function XLM_USD(xlm: number) {
  // Rough live estimate — hard-coded since we have no price oracle
  const RATE = 0.10;
  return `≈ $${(xlm * RATE).toFixed(2)} USD`;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Admin() {
  const { isAuthenticated, login } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    document.title = "Admin | Toolora";
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${getApiBase()}/api/admin/stats`, { credentials: "include" });
      if (res.status === 401) {
        setError("Not signed in. Please sign in to view admin stats.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as AdminStats;
      setStats(data);
      setLastRefresh(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Admin</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Agent API Admin</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Revenue dashboard · x402 Stellar payments
              {lastRefresh && <span className="ml-2 opacity-60">· Updated {lastRefresh.toLocaleTimeString()}</span>}
            </p>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Not signed in */}
      {!isAuthenticated && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border border-border rounded-2xl bg-card">
          <Lock className="w-10 h-10 text-muted-foreground" />
          <div className="text-lg font-semibold">Sign in to view analytics</div>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            This dashboard is only accessible to the Toolora account owner.
          </p>
          <button
            onClick={() => login()}
            className="mt-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Sign in with Replit
          </button>
        </div>
      )}

      {/* Error */}
      {isAuthenticated && error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {isAuthenticated && loading && !stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted" />
          ))}
        </div>
      )}

      {/* Dashboard */}
      {stats && (
        <div className="space-y-10">

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total API Calls"
              value={stats.summary.totalCalls.toLocaleString()}
              sub="all time, verified payments only"
            />
            <StatCard
              label="XLM Earned"
              value={`${parseFloat(stats.summary.totalXlmEarned).toFixed(4)} XLM`}
              sub={XLM_USD(parseFloat(stats.summary.totalXlmEarned))}
            />
            <StatCard
              label="Active Endpoints"
              value={stats.byEndpoint.length.toString()}
              sub="generating revenue"
            />
          </div>

          {/* Revenue by endpoint */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold mb-4">Revenue by Endpoint</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="pb-3 pr-6">Endpoint</th>
                    <th className="pb-3 pr-6 text-right">Calls</th>
                    <th className="pb-3 text-right">XLM Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.byEndpoint.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-muted-foreground text-sm">
                        No paid calls recorded yet.
                      </td>
                    </tr>
                  )}
                  {stats.byEndpoint.map((row) => (
                    <tr key={row.endpoint} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-6 font-mono text-xs">{row.endpoint}</td>
                      <td className="py-3 pr-6 text-right font-semibold">{row.calls}</td>
                      <td className="py-3 text-right">
                        <span className="font-semibold text-yellow-400">{parseFloat(row.xlmEarned).toFixed(4)}</span>
                        <span className="text-muted-foreground ml-1 text-xs">XLM</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily chart */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold mb-4">Daily Activity (last 30 days)</h2>
            {stats.daily.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                No activity yet — charts will appear once you have paid calls.
              </div>
            ) : (
              <div className="flex gap-6 flex-col lg:flex-row">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Calls per day</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={stats.daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(d: string) => d.slice(5)} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">XLM earned per day</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={stats.daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(d: string) => d.slice(5)} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        formatter={(v: number) => [`${v.toFixed(4)} XLM`, "Revenue"]}
                      />
                      <Bar dataKey="xlmEarned" fill="#eab308" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Full payments table */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">Recent Payments</h2>
              <span className="text-xs text-muted-foreground">Last 100 records</span>
            </div>
            {stats.payments.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                No payments recorded yet. Once you receive your first paid API call, it will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground uppercase tracking-wider">
                      <th className="pb-3 pr-4">Endpoint</th>
                      <th className="pb-3 pr-4">Tx Hash</th>
                      <th className="pb-3 pr-4">From</th>
                      <th className="pb-3 pr-4 text-right">Amount</th>
                      <th className="pb-3 pr-4">Network</th>
                      <th className="pb-3 text-right">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stats.payments.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 pr-4 font-mono">{endpointLabel(p.endpoint)}</td>
                        <td className="py-2.5 pr-4">
                          {p.txHash ? (
                            <div className="flex items-center gap-1">
                              <CopyCell text={p.txHash} />
                              <a
                                href={`https://stellar.expert/explorer/public/tx/${p.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ) : "—"}
                        </td>
                        <td className="py-2.5 pr-4">
                          {p.fromAddress ? <CopyCell text={p.fromAddress} /> : "—"}
                        </td>
                        <td className="py-2.5 pr-4 text-right text-yellow-400 font-semibold">
                          {p.amountXlm ? `${parseFloat(p.amountXlm).toFixed(4)} XLM` : "—"}
                        </td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{p.network ?? "—"}</td>
                        <td className="py-2.5 text-right text-muted-foreground">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Full Manifest", href: "/api/agent", external: true },
              { label: "Public Stats", href: "/api/agent/stats", external: true },
              { label: "API Docs", href: "/api-docs", external: false },
            ].map((link) => (
              link.external
                ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    {link.label}
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-0.5" />
                  </a>
                )
                : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors text-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    {link.label}
                  </Link>
                )
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
