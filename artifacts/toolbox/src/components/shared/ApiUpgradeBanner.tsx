import { Link } from "wouter";
import { ArrowRight, Zap, Code2 } from "lucide-react";

interface ApiUpgradeBannerProps {
  variant: "image-resize" | "image-compress" | "pdf-merge" | "markdown-embed";
}

const VARIANTS = {
  "image-resize": {
    icon: Zap,
    text: "Processing images in bulk? The Agent API handles resize, compress, and convert in a single API call — no browser required.",
    linkText: "See the API",
    href: "/api-docs",
  },
  "image-compress": {
    icon: Zap,
    text: "Need to compress hundreds of images programmatically? The Agent API processes files at scale from any script or pipeline.",
    linkText: "See the API",
    href: "/api-docs",
  },
  "pdf-merge": {
    icon: Zap,
    text: "Automating document workflows? The Agent API merges, splits, and extracts text from PDFs — call it from any language.",
    linkText: "See the API",
    href: "/api-docs",
  },
  "markdown-embed": {
    icon: Code2,
    text: "Embed this previewer on your own site or docs. Any Toolora tool is available as a free iframe embed.",
    linkText: "Get embed code",
    href: null,
  },
} as const;

export default function ApiUpgradeBanner({ variant }: ApiUpgradeBannerProps) {
  const { icon: Icon, text, linkText, href } = VARIANTS[variant];

  const inner = (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-sm text-muted-foreground hover:border-blue-500/35 transition-colors">
      <Icon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
      <span className="flex-1">{text}</span>
      <span className="flex items-center gap-1 text-blue-400 font-medium whitespace-nowrap shrink-0">
        {linkText}
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </div>
  );

  if (!href) return <div className="mt-4">{inner}</div>;

  return (
    <div className="mt-4">
      <Link to={href}>{inner}</Link>
    </div>
  );
}
