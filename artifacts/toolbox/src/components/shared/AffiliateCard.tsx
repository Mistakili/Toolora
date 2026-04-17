import type { Affiliate } from "@/lib/affiliates";

interface Props {
  affiliate: Affiliate;
  variant?: "inline" | "block";
}

export function AffiliateCard({ affiliate, variant = "block" }: Props) {
  if (variant === "inline") {
    return (
      <p className="my-6 text-sm text-zinc-400 italic border-l-2 border-violet-500/40 pl-3">
        Sponsored ·{" "}
        <a
          href={affiliate.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="text-violet-300 hover:text-violet-200 underline-offset-2 hover:underline"
        >
          {affiliate.title}
        </a>{" "}
        — {affiliate.blurb}
      </p>
    );
  }
  return (
    <aside className="my-8 rounded-xl border border-zinc-800 bg-gradient-to-br from-violet-950/40 to-zinc-900/40 p-5">
      <div className="text-xs uppercase tracking-wider text-violet-400 mb-2">Sponsored</div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-1">{affiliate.title}</h3>
      <p className="text-sm text-zinc-400 mb-4">{affiliate.blurb}</p>
      <a
        href={affiliate.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 text-sm font-medium transition"
      >
        {affiliate.cta} →
      </a>
    </aside>
  );
}
