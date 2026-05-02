/**
 * In-memory critical-event tracker for the Gateway.
 *
 * The Gateway writes a billing event row for every paid call, regardless of
 * upstream success or failure (accounting integrity invariant). If that
 * insert ever fails, we lose the ledger row entirely — the agent has paid,
 * but we have no record. The proxy logs CRITICAL and continues serving.
 *
 * This counter lets ops see at a glance (via /api/healthz) whether any
 * critical events have happened in the current process lifetime, so they
 * can dig into logs and reconcile manually before more damage accumulates.
 *
 * Process-local on purpose: a missed insert in this process is a directly
 * actionable signal. For multi-instance deployments, aggregate via the
 * standard log pipeline; this counter is the cheap-and-immediate signal.
 */

type CriticalKind =
  | "failed_upstream_insert" // recordFailedCallAndRespond → DB insert threw
  | "success_billing_insert"; // happy path billing event → DB insert threw

interface GatewayHealthState {
  startedAt: string;
  criticalEventsTotal: number;
  byKind: Record<CriticalKind, number>;
  lastCriticalAt: string | null;
  lastCriticalKind: CriticalKind | null;
}

const state: GatewayHealthState = {
  startedAt: new Date().toISOString(),
  criticalEventsTotal: 0,
  byKind: {
    failed_upstream_insert: 0,
    success_billing_insert: 0,
  },
  lastCriticalAt: null,
  lastCriticalKind: null,
};

export function recordGatewayCriticalEvent(kind: CriticalKind): void {
  state.criticalEventsTotal += 1;
  state.byKind[kind] += 1;
  state.lastCriticalAt = new Date().toISOString();
  state.lastCriticalKind = kind;
}

export function getGatewayHealth(): {
  status: "ok" | "degraded";
  startedAt: string;
  criticalEventsTotal: number;
  byKind: Record<CriticalKind, number>;
  lastCriticalAt: string | null;
  lastCriticalKind: CriticalKind | null;
} {
  return {
    status: state.criticalEventsTotal === 0 ? "ok" : "degraded",
    startedAt: state.startedAt,
    criticalEventsTotal: state.criticalEventsTotal,
    byKind: { ...state.byKind },
    lastCriticalAt: state.lastCriticalAt,
    lastCriticalKind: state.lastCriticalKind,
  };
}
