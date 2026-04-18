import { useMemo } from "react";
import { Link } from "wouter";

const BASE = import.meta.env.BASE_URL;

type Tile = {
  src: string;
  alt: string;
  href?: string;
  x: number;
  y: number;
  size: number;
  rot: number;
  delay: number;
};

const TILES: Tile[] = [
  { src: "mcp-icon-postgres",            alt: "Postgres MCP",        x:  4, y:  2, size: 0.85, rot: -4, delay: 0.0 },
  { src: "mcp-icon-figma",               alt: "Figma MCP",           x: 18, y:  6, size: 0.95, rot:  3, delay: 0.4 },
  { src: "mcp-icon-crypto",              alt: "Crypto MCP",          x: 33, y:  0, size: 0.90, rot: -5, delay: 0.8 },
  { src: "logo-soliris",                 alt: "Soliris",             x: 49, y:  4, href: "/mcp-hub/server/soliris", size: 1.00, rot:  2, delay: 1.2 },
  { src: "mcp-icon-video",               alt: "Video MCP",           x: 65, y:  1, size: 0.88, rot:  5, delay: 1.6 },
  { src: "mcp-icon-docs",                alt: "Docs MCP",            x: 81, y:  5, size: 0.85, rot: -3, delay: 2.0 },

  { src: "mcp-icon-slack",               alt: "Slack MCP",           x:  0, y: 18, size: 0.95, rot:  4, delay: 0.6 },
  { src: "mcp-icon-github",              alt: "GitHub MCP",          x: 14, y: 22, size: 1.05, rot: -2, delay: 1.0 },
  { src: "mcp-icon-image-gen",           alt: "Image gen MCP",       x: 29, y: 18, size: 1.00, rot:  6, delay: 1.4 },
  { src: "mcp-icon-browser",             alt: "Browser MCP",         x: 44, y: 20, size: 0.98, rot: -3, delay: 1.8 },
  { src: "mcp-icon-weather",             alt: "Weather MCP",         x: 60, y: 18, size: 1.05, rot:  4, delay: 2.2 },
  { src: "mcp-icon-scraper",             alt: "Scraper MCP",         x: 76, y: 22, size: 0.92, rot: -5, delay: 0.2 },
  { src: "mcp-icon-memory",              alt: "Memory MCP",          x: 90, y: 26, size: 0.85, rot:  3, delay: 0.6 },

  { src: "mcp-icon-analytics",           alt: "Analytics MCP",       x:  4, y: 38, size: 1.05, rot: -2, delay: 1.0 },
  { src: "mcp-icon-translate",           alt: "Translate MCP",       x: 20, y: 36, size: 1.10, rot:  5, delay: 1.4 },
  { src: "mcp-icon-security",            alt: "Security MCP",        x: 36, y: 34, size: 1.05, rot: -4, delay: 1.8 },
  { src: "mcp-icon-notion",              alt: "Notion MCP",          x: 56, y: 36, size: 1.05, rot:  2, delay: 2.2 },
  { src: "mcp-icon-maps",                alt: "Maps MCP",            x: 72, y: 34, size: 1.08, rot: -3, delay: 0.4 },
  { src: "mcp-icon-audio",               alt: "Audio MCP",           x: 88, y: 38, size: 1.00, rot:  4, delay: 0.8 },

  { src: "mcp-icon-terminal",            alt: "Terminal MCP",        x: 10, y: 56, size: 0.95, rot:  3, delay: 1.2 },
  { src: "mcp-icon-vector-db",           alt: "Vector DB MCP",       x: 25, y: 58, size: 1.05, rot: -5, delay: 1.6 },
  { src: "mcp-icon-calendar",            alt: "Calendar MCP",        x: 41, y: 56, size: 1.00, rot:  2, delay: 2.0 },
  { src: "logo-soliris-sentinel",        alt: "Soliris Sentinel",    x: 58, y: 60, href: "/mcp-hub/server/soliris-sentinel", size: 1.05, rot: -2, delay: 0.0 },
  { src: "mcp-icon-stripe",              alt: "Stripe MCP",          x: 76, y: 58, size: 0.95, rot:  4, delay: 0.6 },
  { src: "mcp-icon-filesystem",          alt: "Filesystem MCP",      x: 90, y: 62, size: 0.88, rot: -3, delay: 1.0 },

  { src: "mcp-icon-email",               alt: "Email MCP",           x: 18, y: 76, size: 0.95, rot: -3, delay: 1.4 },
  { src: "mcp-icon-brain-ai",            alt: "Brain / AI MCP",      x: 33, y: 80, size: 0.88, rot:  5, delay: 1.8 },
  { src: "mcp-icon-search",              alt: "Search MCP",          x: 70, y: 80, size: 0.92, rot:  3, delay: 0.4 },
  { src: "mcp-icon-toolora-hero",        alt: "Toolora MCP",         x: 84, y: 76, size: 0.95, rot: -5, delay: 0.8 },
];

export function IconCloud() {
  const tiles = useMemo(() => TILES, []);

  return (
    <div
      className="relative w-full max-w-[1100px] mx-auto overflow-hidden"
      style={{ containerType: "inline-size" as React.CSSProperties["containerType"] }}
      role="group"
      aria-label="Featured MCP servers"
    >
      <style>{`
        @keyframes mcp-float {
          0%, 100% { transform: translateY(0) rotate(var(--r,0deg)); }
          50%      { transform: translateY(-6px) rotate(calc(var(--r,0deg) + 1deg)); }
        }
        .mcp-tile { animation: mcp-float 7s ease-in-out infinite; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .mcp-tile { animation: none; } }
      `}</style>

      {/* Cloud canvas — keeps a fixed aspect so positions are predictable */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        {tiles.map((t, i) => {
          const sizeStyle = `calc(6cqw * ${t.size})`;
          const wrapperStyle: React.CSSProperties = {
            position: "absolute",
            left: `${t.x}%`,
            top: `${t.y}%`,
            width: sizeStyle,
            height: sizeStyle,
            // @ts-expect-error CSS var
            "--r": `${t.rot}deg`,
            animationDelay: `${t.delay}s`,
            transform: `rotate(${t.rot}deg)`,
            transformOrigin: "center",
          };
          const Wrapper: React.ElementType = t.href ? Link : "div";
          const wrapperProps = t.href ? { href: t.href } : {};
          return (
            <Wrapper
              key={i}
              {...wrapperProps}
              className="mcp-tile block drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] hover:drop-shadow-[0_22px_44px_rgba(124,58,237,0.5)] hover:scale-110 transition-transform duration-300"
              style={wrapperStyle}
              aria-label={t.alt}
            >
              <img
                src={BASE + "images/" + t.src + ".png"}
                alt=""
                loading={i < 12 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover rounded-[22%] ring-1 ring-white/10"
                draggable={false}
              />
            </Wrapper>
          );
        })}

        {/* Centered hero "App Store" equivalent — Toolora MCP */}
        <Link
          href="/mcp"
          className="absolute left-1/2 -translate-x-1/2 group block"
          style={{
            top: "62%",
            width: "clamp(96px, 16cqw, 188px)",
            height: "clamp(96px, 16cqw, 188px)",
          }}
          aria-label="Toolora MCP — featured server"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -m-6 rounded-[28%] bg-violet-500/30 blur-3xl opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <img
            src={BASE + "images/mcp-icon-toolora-hero.png"}
            alt=""
            loading="eager"
            decoding="async"
            className="relative w-full h-full object-cover rounded-[22%] ring-1 ring-white/15 shadow-[0_30px_80px_-10px_rgba(124,58,237,0.65)] group-hover:scale-[1.04] transition-transform duration-300"
            draggable={false}
          />
        </Link>
      </div>

      {/* Soft fade at edges so the cloud blends into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(9,9,11,0.65) 85%, rgba(9,9,11,1) 100%)",
        }}
      />
    </div>
  );
}
