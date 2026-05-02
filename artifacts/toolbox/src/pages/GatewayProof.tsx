import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { ExternalLink, ShieldCheck, ArrowLeft, AlertTriangle } from "lucide-react";

/**
 * Public on-chain proof page for a single MCP listing.
 *
 * Lists the most recent N billing events with deep-links to the Solana
 * explorer for each tx hash. Owners must opt in via proof_public=true on
 * their gateway config; otherwise this returns 404.
 *
 * Why this exists: agent-economy infra is full of marketing claims about
 * "instant settlement" with no way to verify. This page is the smallest
 * possible "click → see the actual blockchain tx" loop. YC partners and
 * potential customers can audit a listing in <30 seconds.
 */

interface ProofRow {
  id: string;
  toolName: string | null;
  paymentTxHash: string | null;
  payoutTxHash: string | null;
  refundTxHash: string | null;
  amountUsdcMicros: number;
  tooloraFeeUsdcMicros: number;
  status: string;
  createdAt: string | null;
  settledAt: string | null;
  refundedAt: string | null;
}

interface ProofPayload {
  ok: true;
  listing: { id: string; name: string };
  mode: "stub" | "broadcast";
  rows: ProofRow[];
}

const SOLANA_EXPLORER_BASE = "https://explorer.solana.com/tx/";

function fmtUsd(micros: number): string {
  const usd = micros / 1_000_000;
  if (usd === 0) return "$0.00";
  if (usd < 0.01) return `$${usd.toFixed(6)}`;
  if (usd < 1) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}

function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString();
}

function TxLink({ hash, mode }: { hash: string | null; mode: "stub" | "broadcast" }) {
  if (!hash) return <span className="text-zinc-600">—</span>;
  if (hash.startsWith("stub_") || mode === "stub") {
    return (
      <span title="Synthetic tx hash — payout mode is currently 'stub'. Real on-chain settlement starts when the platform wallet is funded." className="font-mono text-[11px] text-zinc-400">
        {hash.slice(0, 16)}…
      </span>
    );
  }
  return (
    <a
      href={`${SOLANA_EXPLORER_BASE}${encodeURIComponent(hash)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[11px] text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1"
    >
      {hash.slice(0, 16)}…
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}

export default function GatewayProof() {
  const params = useParams<{ listingId: string }>();
  const listingId = params.listingId ?? "";
  const [data, setData] = useState<ProofPayload | null>(null);
  const [notEnabled, setNotEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listingId) return;
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`/api/gateway/public-proof/${encodeURIComponent(listingId)}?limit=50`);
        if (r.status === 404) {
          if (alive) {
            setNotEnabled(true);
            setLoading(false);
          }
          return;
        }
        const j = (await r.json()) as ProofPayload;
        if (alive && j.ok) {
          setData(j);
          setLoading(false);
        }
      } catch {
        if (alive) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [listingId]);

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <Link href="/gateway" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 mb-4">
        <ArrowLeft className="w-3 h-3" /> Back to Gateway
      </Link>

      <header className="mb-6 flex items-start gap-3">
        <ShieldCheck className="w-7 h-7 text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Toolora Gateway · On-chain proof</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Every billing event for this listing, with a direct link to the underlying Solana transaction.
            No marketing claims — click any tx hash to see it on the explorer.
          </p>
        </div>
      </header>

      {loading && <p className="text-sm text-zinc-500">Loading…</p>}

      {notEnabled && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-200">Public proof is not enabled for this listing.</p>
            <p className="text-xs text-amber-200/80 mt-1">
              The owner can turn this on from the dashboard — it's an explicit opt-in because real wallet addresses
              are involved.
            </p>
          </div>
        </div>
      )}

      {data && (
        <>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-zinc-300">
              <span className="text-zinc-500">Listing:</span> <span className="font-medium">{data.listing.name}</span>
            </div>
            <div className="text-xs text-zinc-500">
              Settlement mode: <span className="font-mono text-zinc-400">{data.mode}</span>
              {data.mode === "stub" && (
                <span className="ml-2 text-amber-400">(synthetic tx hashes until platform wallet is funded)</span>
              )}
            </div>
          </div>

          {data.rows.length === 0 ? (
            <p className="text-sm text-zinc-500">No billing events yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-800">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="text-left px-4 py-2.5">When</th>
                    <th className="text-left px-4 py-2.5">Tool</th>
                    <th className="text-left px-4 py-2.5">Status</th>
                    <th className="text-right px-4 py-2.5">Caller paid</th>
                    <th className="text-left px-4 py-2.5">Payment tx</th>
                    <th className="text-left px-4 py-2.5">Payout / refund tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {data.rows.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-900/30">
                      <td className="px-4 py-2.5 text-xs text-zinc-400">{fmtTime(row.settledAt ?? row.createdAt)}</td>
                      <td className="px-4 py-2.5 text-xs text-zinc-300 font-mono">{row.toolName ?? "—"}</td>
                      <td className="px-4 py-2.5 text-xs">
                        {row.status === "settled" && (
                          <span className="rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-0.5 text-[10px] font-medium">settled</span>
                        )}
                        {row.status === "failed" && (
                          <span className="rounded-full bg-rose-500/15 text-rose-300 px-2 py-0.5 text-[10px] font-medium">
                            {row.refundTxHash ? "refunded" : "failed"}
                          </span>
                        )}
                        {row.status === "pending" && (
                          <span className="rounded-full bg-amber-500/15 text-amber-300 px-2 py-0.5 text-[10px] font-medium">pending</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs text-zinc-200 tabular-nums">{fmtUsd(row.amountUsdcMicros)}</td>
                      <td className="px-4 py-2.5"><TxLink hash={row.paymentTxHash} mode={data.mode} /></td>
                      <td className="px-4 py-2.5">
                        <TxLink hash={row.refundTxHash ?? row.payoutTxHash} mode={data.mode} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-[11px] text-zinc-600 mt-4">
            This page is gated by an explicit owner opt-in (proof_public). Failed-call refunds are processed
            by the gateway worker every 60 seconds and recorded here automatically.
          </p>
        </>
      )}
    </main>
  );
}
