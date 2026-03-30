import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import {
  ChevronRight, Home, BarChart2, Zap, Copy, Check, ExternalLink,
  RefreshCw, Lock, ChevronDown, Monitor, Globe2, Clock, FileText,
  Smartphone, Tablet, Laptop, TrendingUp,
} from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";

// ─── URL helper ───────────────────────────────────────────────────────────────

function getApiBase() {
  if (typeof window === "undefined") return "https://toolora-api.replit.app";
  return window.location.origin
    .replace(/toolora\.replit\.app/, "toolora-api.replit.app")
    .replace(/:\d+$/, ":8080");
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgentStats {
  summary: { totalCalls: number; totalXlmEarned: string };
  byEndpoint: { endpoint: string; calls: number; xlmEarned: string }[];
  daily: { day: string; calls: number; xlmEarned: number }[];
  payments: {
    id: number; endpoint: string; txHash: string; fromAddress: string | null;
    amountXlm: string | null; network: string | null; createdAt: string;
  }[];
}

interface Analytics {
  summary: {
    totalViews30d: number; uniqueSessions30d: number;
    todayViews: number; weekViews: number; botViews30d: number;
  };
  topPages: { path: string; views: number }[];
  byDevice: { deviceType: string; views: number }[];
  byBrowser: { browser: string; views: number }[];
  byOS: { os: string; views: number }[];
  byCountry: { country: string; views: number }[];
  byCities: { city: string; country: string; views: number }[];
  dailyTrend: { day: string; views: number; sessions: number }[];
  hourlyDist: { hour: number; views: number }[];
  byReferrer: { referrer: string; views: number }[];
}

// ─── Accordion section ────────────────────────────────────────────────────────

function Section({
  icon: Icon, title, badge, defaultOpen = false, children,
}: {
  icon: React.ElementType; title: string; badge?: string | number;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-semibold text-sm">{title}</span>
          {badge !== undefined && (
            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 border-t border-border/50">{children}</div>}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-4 ${accent ? `border-${accent}-500/20 bg-${accent}-500/5` : "border-border"}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-bold ${accent ? `text-${accent}-400` : ""}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Horizontal bar (simple % bar) ───────────────────────────────────────────

function HBar({ label, value, total, color = "bg-primary" }: { label: string; value: number; total: number; color?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-28 shrink-0 text-right text-muted-foreground truncate text-xs">{label}</div>
      <div className="flex-1 bg-muted/50 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-16 text-right text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{value.toLocaleString()}</span> ({pct}%)
      </div>
    </div>
  );
}

// ─── Copy cell ────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function xlmToUsd(xlm: number) { return `≈ $${(xlm * 0.10).toFixed(2)} USD`; }

function labelHour(h: number) {
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}${suffix}`;
}

function deviceIcon(type: string) {
  if (type === "mobile") return <Smartphone className="w-3.5 h-3.5" />;
  if (type === "tablet") return <Tablet className="w-3.5 h-3.5" />;
  return <Laptop className="w-3.5 h-3.5" />;
}

const CHART_COLORS = ["hsl(var(--primary))", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#f97316"];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Admin() {
  const { isAuthenticated, login } = useAuth();
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => { document.title = "Admin | Toolora"; }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = getApiBase();
      const [statsRes, analyticsRes] = await Promise.all([
        fetch(`${base}/api/admin/stats`, { credentials: "include" }),
        fetch(`${base}/api/admin/analytics`, { credentials: "include" }),
      ]);
      if (statsRes.status === 401 || analyticsRes.status === 401) {
        setError("Not signed in.");
        return;
      }
      if (!statsRes.ok || !analyticsRes.ok) throw new Error("Server error");
      const [s, a] = await Promise.all([statsRes.json(), analyticsRes.json()]);
      setAgentStats(s as AgentStats);
      setAnalytics(a as Analytics);
      setLastRefresh(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isAuthenticated) fetchAll(); }, [isAuthenticated, fetchAll]);

  const totalDeviceViews = analytics?.byDevice.reduce((a, d) => a + d.views, 0) ?? 0;
  const totalBrowserViews = analytics?.byBrowser.reduce((a, d) => a + d.views, 0) ?? 0;
  const totalOsViews = analytics?.byOS.reduce((a, d) => a + d.views, 0) ?? 0;
  const totalCountryViews = analytics?.byCountry.reduce((a, d) => a + d.views, 0) ?? 0;
  const totalPageViews = analytics?.topPages.reduce((a, d) => a + d.views, 0) ?? 0;

  // Build full 24h hourly array (fill missing hours with 0)
  const hourlyFull = Array.from({ length: 24 }, (_, h) => {
    const found = analytics?.hourlyDist.find((d) => d.hour === h);
    return { hour: h, views: found?.views ?? 0, label: labelHour(h) };
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground flex items-center"><Home className="w-4 h-4 mr-1" /> Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground font-medium">Admin</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              Revenue · Traffic · Analytics
              {lastRefresh && <span className="ml-2 opacity-50">· {lastRefresh.toLocaleTimeString()}</span>}
            </p>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={fetchAll}
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
          <p className="text-sm text-muted-foreground text-center max-w-xs">
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

      {isAuthenticated && error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {isAuthenticated && loading && !analytics && (
        <div className="space-y-3 animate-pulse">
          {[120, 80, 100, 80, 80].map((h, i) => (
            <div key={i} className={`h-${h === 120 ? "32" : "16"} rounded-2xl bg-muted`} style={{ height: h }} />
          ))}
        </div>
      )}

      {isAuthenticated && analytics && agentStats && (
        <div className="space-y-3">

          {/* ── Section 1: Traffic Overview ──────────────────────────────── */}
          <Section icon={TrendingUp} title="Traffic Overview" defaultOpen badge={analytics.summary.totalViews30d.toLocaleString() + " views"}>
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Today" value={analytics.summary.todayViews} />
                <StatCard label="This week" value={analytics.summary.weekViews} />
                <StatCard label="30-day views" value={analytics.summary.totalViews30d.toLocaleString()} />
                <StatCard label="30-day sessions" value={analytics.summary.uniqueSessions30d.toLocaleString()} sub="unique visitors" />
              </div>
              {analytics.dailyTrend.length > 0 ? (
                <div>
                  <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Daily page views (last 30 days)</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={analytics.dailyTrend} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="day" tick={{ fontSize: 9 }} tickFormatter={(d: string) => d.slice(5)} />
                      <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                        labelFormatter={(d: string) => `Date: ${d}`}
                      />
                      <Bar dataKey="views" name="Page views" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
                  No traffic data yet — charts appear once visitors arrive.
                </div>
              )}
            </div>
          </Section>

          {/* ── Section 2: Devices & Browsers ────────────────────────────── */}
          <Section icon={Monitor} title="Devices & Browsers" defaultOpen badge={totalDeviceViews}>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Device type */}
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Device type</div>
                {analytics.byDevice.length === 0
                  ? <p className="text-xs text-muted-foreground">No data yet</p>
                  : (
                    <div className="space-y-2">
                      {analytics.byDevice.map((d) => (
                        <div key={d.deviceType} className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">{deviceIcon(d.deviceType)}</span>
                          <HBar
                            label={d.deviceType.charAt(0).toUpperCase() + d.deviceType.slice(1)}
                            value={d.views}
                            total={totalDeviceViews}
                          />
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Browser */}
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Browser</div>
                {analytics.byBrowser.length === 0
                  ? <p className="text-xs text-muted-foreground">No data yet</p>
                  : (
                    <div className="space-y-2">
                      {analytics.byBrowser.map((d, i) => (
                        <HBar key={d.browser} label={d.browser} value={d.views} total={totalBrowserViews}
                          color={["bg-primary", "bg-yellow-500", "bg-green-500", "bg-blue-500", "bg-purple-500"][i % 5]} />
                      ))}
                    </div>
                  )}
              </div>

              {/* OS */}
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Operating System</div>
                {analytics.byOS.length === 0
                  ? <p className="text-xs text-muted-foreground">No data yet</p>
                  : (
                    <div className="space-y-2">
                      {analytics.byOS.map((d, i) => (
                        <HBar key={d.os} label={d.os} value={d.views} total={totalOsViews}
                          color={["bg-primary", "bg-yellow-500", "bg-green-500", "bg-blue-500", "bg-purple-500"][i % 5]} />
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </Section>

          {/* ── Section 3: Geography ──────────────────────────────────────── */}
          <Section icon={Globe2} title="Geography" badge={analytics.byCountry.length > 0 ? `${analytics.byCountry.length} countries` : undefined}>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Top Countries</div>
                {analytics.byCountry.length === 0
                  ? <p className="text-xs text-muted-foreground">No data yet</p>
                  : (
                    <div className="space-y-2">
                      {analytics.byCountry.map((d, i) => (
                        <HBar key={d.country} label={d.country} value={d.views} total={totalCountryViews}
                          color={CHART_COLORS[i % CHART_COLORS.length].startsWith("#") ? "bg-yellow-500" : "bg-primary"} />
                      ))}
                    </div>
                  )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Top Cities</div>
                {analytics.byCities.length === 0
                  ? <p className="text-xs text-muted-foreground">No data yet</p>
                  : (
                    <div className="space-y-1.5">
                      {analytics.byCities.map((d, i) => (
                        <div key={`${d.city}-${i}`} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                          <span className="text-foreground font-medium">{d.city}</span>
                          <span className="text-muted-foreground">{d.country}</span>
                          <span className="font-semibold">{d.views.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </Section>

          {/* ── Section 4: Activity Timeline ──────────────────────────────── */}
          <Section icon={Clock} title="Activity Timeline">
            <div className="pt-4">
              <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Visits by hour of day (UTC)</div>
              {analytics.hourlyDist.length === 0
                ? <p className="text-xs text-muted-foreground py-4 text-center">No data yet</p>
                : (
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={hourlyFull} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={2} />
                      <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                        formatter={(v: number) => [v, "views"]}
                        labelFormatter={(l: string) => `Hour: ${l}`}
                      />
                      <Bar dataKey="views" radius={[3, 3, 0, 0]}>
                        {hourlyFull.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.views > 0 ? "hsl(var(--primary))" : "rgba(255,255,255,0.06)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
            </div>
          </Section>

          {/* ── Section 5: Top Pages ──────────────────────────────────────── */}
          <Section icon={FileText} title="Top Pages" badge={analytics.topPages.length}>
            <div className="pt-4 space-y-1.5">
              {analytics.topPages.length === 0
                ? <p className="text-xs text-muted-foreground">No data yet</p>
                : analytics.topPages.map((p) => (
                  <div key={p.path} className="flex items-center gap-3 py-1">
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-xs text-foreground">{p.path || "/"}</span>
                    </div>
                    <div className="w-32 shrink-0">
                      <div className="bg-muted/50 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${totalPageViews > 0 ? Math.round(p.views / totalPageViews * 100) : 0}%` }} />
                      </div>
                    </div>
                    <div className="w-12 text-right text-xs font-semibold shrink-0">{p.views.toLocaleString()}</div>
                  </div>
                ))}
            </div>
          </Section>

          {/* ── Section 6: Referrers ──────────────────────────────────────── */}
          {analytics.byReferrer.length > 0 && (
            <Section icon={Globe2} title="Referrers" badge={analytics.byReferrer.length}>
              <div className="pt-4 space-y-1.5">
                {analytics.byReferrer.map((r) => {
                  let host = r.referrer;
                  try { host = new URL(r.referrer).hostname; } catch { /* keep raw */ }
                  return (
                    <div key={r.referrer} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                      <span className="text-foreground font-mono truncate max-w-xs" title={r.referrer}>{host}</span>
                      <span className="font-semibold shrink-0 ml-4">{r.views.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── Section 7: Agent API Revenue ──────────────────────────────── */}
          <Section icon={Zap} title="Agent API Revenue" badge={`${agentStats.summary.totalCalls} calls`}>
            <div className="pt-4 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard label="Total calls" value={agentStats.summary.totalCalls} accent="yellow" />
                <StatCard
                  label="XLM earned"
                  value={`${parseFloat(agentStats.summary.totalXlmEarned).toFixed(4)} XLM`}
                  sub={xlmToUsd(parseFloat(agentStats.summary.totalXlmEarned))}
                  accent="yellow"
                />
                <StatCard label="Active endpoints" value={agentStats.byEndpoint.length} />
              </div>

              {/* Per-endpoint */}
              {agentStats.byEndpoint.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">By endpoint</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground uppercase tracking-wider">
                          <th className="pb-2 pr-6">Endpoint</th>
                          <th className="pb-2 pr-6 text-right">Calls</th>
                          <th className="pb-2 text-right">XLM Earned</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {agentStats.byEndpoint.map((r) => (
                          <tr key={r.endpoint} className="hover:bg-muted/30">
                            <td className="py-2 pr-6 font-mono">{r.endpoint}</td>
                            <td className="py-2 pr-6 text-right font-semibold">{r.calls}</td>
                            <td className="py-2 text-right text-yellow-400 font-semibold">
                              {parseFloat(r.xlmEarned).toFixed(4)} XLM
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Daily revenue chart */}
              {agentStats.daily.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">XLM earned per day</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={agentStats.daily} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="day" tick={{ fontSize: 9 }} tickFormatter={(d: string) => d.slice(5)} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                        formatter={(v: number) => [`${v.toFixed(4)} XLM`, "Revenue"]}
                      />
                      <Bar dataKey="xlmEarned" fill="#eab308" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Section>

          {/* ── Section 8: Payments log ───────────────────────────────────── */}
          <Section icon={FileText} title="Payment Log" badge={agentStats.payments.length > 0 ? `last ${agentStats.payments.length}` : "0"}>
            <div className="pt-4">
              {agentStats.payments.length === 0
                ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No payments yet. First paid API call will appear here.
                  </p>
                )
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground uppercase tracking-wider">
                          <th className="pb-2 pr-3">Endpoint</th>
                          <th className="pb-2 pr-3">Tx Hash</th>
                          <th className="pb-2 pr-3">From</th>
                          <th className="pb-2 pr-3 text-right">Amount</th>
                          <th className="pb-2 text-right">When</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {agentStats.payments.map((p) => (
                          <tr key={p.id} className="hover:bg-muted/30">
                            <td className="py-2 pr-3 font-mono">{p.endpoint.replace("/api/agent/", "")}</td>
                            <td className="py-2 pr-3">
                              {p.txHash ? (
                                <div className="flex items-center gap-1">
                                  <CopyCell text={p.txHash} />
                                  <a href={`https://stellar.expert/explorer/public/tx/${p.txHash}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              ) : "—"}
                            </td>
                            <td className="py-2 pr-3">{p.fromAddress ? <CopyCell text={p.fromAddress} /> : "—"}</td>
                            <td className="py-2 pr-3 text-right text-yellow-400 font-semibold">
                              {p.amountXlm ? `${parseFloat(p.amountXlm).toFixed(4)} XLM` : "—"}
                            </td>
                            <td className="py-2 text-right text-muted-foreground">
                              {new Date(p.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          </Section>

        </div>
      )}
    </div>
  );
}
