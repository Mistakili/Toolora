/**
 * SEO Pre-renderer
 * Runs after `vite build`. For each tool, generates a dedicated
 * dist/public/tools/<category>/<slug>/index.html with the correct
 * <title>, <meta description>, <link rel="canonical">, OG tags,
 * and JSON-LD injected — before JavaScript runs.
 *
 * This lets Google read the correct metadata on first crawl without
 * waiting for client-side JS to execute.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist/public");
const BASE_URL = "https://toolora.dev";
const TODAY = new Date().toISOString().slice(0, 10);

// ── Tool definitions (kept in sync with src/lib/tools-config.ts) ─────────────
const TOOLS = [
  // Text
  { slug: "word-counter",      category: "text",        name: "Word Counter",            seoTitle: "Free Word Counter — Count Words, Characters & Sentences Online",         seoDescription: "Instantly count words, characters, sentences, paragraphs and reading time. Free, private, 100% browser-based. No signup needed." },
  { slug: "case-converter",    category: "text",        name: "Case Converter",          seoTitle: "Free Case Converter — UPPERCASE, lowercase, camelCase & more",           seoDescription: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and PascalCase instantly. Free online text case converter." },
  { slug: "lorem-ipsum",       category: "text",        name: "Lorem Ipsum Generator",   seoTitle: "Free Lorem Ipsum Generator — Placeholder Text for Designers",            seoDescription: "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Choose count, customize start, copy instantly. Free online tool." },
  { slug: "markdown-preview",  category: "text",        name: "Markdown Preview",        seoTitle: "Free Markdown Preview — Live Markdown Editor & Renderer Online",         seoDescription: "Write markdown and see a live side-by-side HTML preview. Free online markdown editor with instant rendering. No signup required." },
  { slug: "text-diff",         category: "text",        name: "Text Diff",               seoTitle: "Free Text Diff Tool — Compare Two Texts Online & Find Differences",     seoDescription: "Compare two blocks of text and highlight additions, removals and unchanged lines. Free online text diff and comparison tool." },
  // Developer
  { slug: "json-formatter",    category: "developer",   name: "JSON Formatter",          seoTitle: "Free JSON Formatter & Validator — Pretty Print & Minify JSON Online",   seoDescription: "Format and validate JSON instantly. Pretty-print messy JSON or minify it for production. Free online JSON formatter with error detection." },
  { slug: "base64",            category: "developer",   name: "Base64 Encoder/Decoder",  seoTitle: "Free Base64 Encoder & Decoder — Encode or Decode Base64 Online",        seoDescription: "Encode text to Base64 or decode Base64 strings back to plain text. Free online Base64 encoder/decoder tool. No data sent to servers." },
  { slug: "url-encoder",       category: "developer",   name: "URL Encoder/Decoder",     seoTitle: "Free URL Encoder & Decoder — Encode or Decode URLs Online",             seoDescription: "Encode special characters in URLs or decode percent-encoded strings. Free online URL encoder and decoder tool for developers." },
  { slug: "hash-generator",    category: "developer",   name: "Hash Generator",          seoTitle: "Free Hash Generator — MD5, SHA-1, SHA-256 Hash Online",                seoDescription: "Generate MD5, SHA-1, and SHA-256 cryptographic hashes from any text. Free online hash generator. All processing done in your browser." },
  { slug: "uuid-generator",    category: "developer",   name: "UUID Generator",          seoTitle: "Free UUID Generator — Generate Random UUIDs v4 Online in Bulk",         seoDescription: "Generate one or multiple UUID v4 strings instantly. Free online UUID generator for developers. Copy all with one click." },
  // Productivity
  { slug: "qr-generator",      category: "productivity",name: "QR Code Generator",       seoTitle: "Free QR Code Generator — Create Custom QR Codes Online",               seoDescription: "Generate QR codes from any URL or text. Free online QR code generator with custom colors. Download as PNG instantly." },
  { slug: "password-generator",category: "productivity",name: "Password Generator",      seoTitle: "Free Password Generator — Create Strong, Secure Passwords Online",      seoDescription: "Generate strong random passwords with custom length, uppercase, numbers and symbols. Free secure password generator — nothing is stored or transmitted." },
  { slug: "unit-converter",    category: "productivity",name: "Unit Converter",          seoTitle: "Free Unit Converter — Length, Weight, Temperature & More Online",       seoDescription: "Convert between units of length, weight, temperature, area, speed, and volume. Free online unit converter for everyday and scientific use." },
  { slug: "color-picker",      category: "productivity",name: "Color Converter",         seoTitle: "Free Color Converter — HEX to RGB to HSL Color Picker Online",          seoDescription: "Convert colors between HEX, RGB, and HSL formats. Use the color picker, RGB sliders, or type a hex code. Free online color converter tool." },
  { slug: "timestamp-converter",category:"productivity",name: "Timestamp Converter",     seoTitle: "Free Unix Timestamp Converter — Convert Epoch Time Online",             seoDescription: "Convert Unix timestamps to human-readable dates and times. See ISO 8601, UTC, relative time and more. Free online epoch timestamp converter." },
  // Image
  { slug: "image-resize",      category: "image",       name: "Image Resizer",           seoTitle: "Free Image Resizer — Resize Images Online Without Uploading",           seoDescription: "Resize any image by pixels or percentage. Lock aspect ratio, set custom dimensions, adjust quality. Free online image resizer — files never leave your device." },
  { slug: "image-compress",    category: "image",       name: "Image Compressor",        seoTitle: "Free Image Compressor — Compress Images Online Without Losing Quality", seoDescription: "Compress JPG, PNG and WebP images and reduce file size without visible quality loss. Free online image compressor — 100% private, browser-based." },
  { slug: "image-convert",     category: "image",       name: "Image Converter",         seoTitle: "Free Image Converter — Convert JPG, PNG, WebP Online",                  seoDescription: "Convert images between JPEG, PNG, and WebP formats instantly. Free online image format converter. No uploads, no registration, fully private." },
  // PDF
  { slug: "pdf-merge",         category: "pdf",         name: "Merge PDF",               seoTitle: "Free PDF Merger — Combine & Merge PDF Files Online",                    seoDescription: "Merge multiple PDF files into one document. Drag, reorder and combine PDFs in seconds. Free online PDF merger — files never leave your browser." },
  { slug: "pdf-split",         category: "pdf",         name: "Split PDF",               seoTitle: "Free PDF Splitter — Split or Extract Pages from PDF Online",            seoDescription: "Split a PDF into individual pages, extract page ranges, or divide every N pages. Free online PDF splitter — fully client-side, nothing uploaded." },
];

const CATEGORIES = [
  { id: "text",        name: "Text Tools",        seoTitle: "Free Text Tools Online",          seoDescription: "Word counter, case converter, lorem ipsum generator, markdown preview and text diff. All browser-based, no signup." },
  { id: "developer",   name: "Developer Tools",   seoTitle: "Free Developer Tools Online",     seoDescription: "JSON formatter, Base64 encoder, URL encoder, hash generator and UUID generator. Fast, free, browser-based developer utilities." },
  { id: "productivity",name: "Productivity Tools",seoTitle: "Free Productivity Tools Online",  seoDescription: "QR code generator, password generator, unit converter, color picker and timestamp converter. Free online productivity tools." },
  { id: "image",       name: "Image Tools",       seoTitle: "Free Online Image Tools",         seoDescription: "Resize, compress and convert images — all 100% private, browser-side processing. No uploads, no registration." },
  { id: "pdf",         name: "PDF Tools",         seoTitle: "Free Online PDF Tools",           seoDescription: "Merge and split PDF files locally in your browser. Fast, private, and completely free. No file size limits." },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildJsonLd(tool) {
  const url = `${BASE_URL}/tools/${tool.category}/${tool.slug}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.seoDescription,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: "Toolora", url: BASE_URL },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: `${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tools`, item: `${BASE_URL}/tools/${tool.category}` },
        { "@type": "ListItem", position: 3, name: tool.name, item: url },
      ],
    },
  });
}

function buildCategoryJsonLd(cat) {
  const url = `${BASE_URL}/tools/${cat.id}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.seoTitle,
    description: cat.seoDescription,
    url,
    provider: { "@type": "Organization", name: "Toolora", url: BASE_URL },
  });
}

function patchHtml(template, { title, description, canonical, jsonLd }) {
  let html = template;

  // Title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)} | Toolora</title>`);

  // Description
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,
    `$1${esc(description)}$2`);

  // Canonical
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/,
    `$1${esc(canonical)}$2`);

  // OG tags
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,
    `$1${esc(title + " | Toolora")}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,
    `$1${esc(description)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,
    `$1${esc(canonical)}$2`);

  // Twitter
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,
    `$1${esc(title + " | Toolora")}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,
    `$1${esc(description)}$2`);

  // Inject JSON-LD right before </head>
  const ldTag = `  <script type="application/ld+json">${jsonLd}</script>\n</head>`;
  html = html.replace(/<\/head>/, ldTag);

  return html;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const templatePath = path.join(DIST, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("❌ dist/public/index.html not found. Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");
let generated = 0;

// Tool pages
for (const tool of TOOLS) {
  const url = `${BASE_URL}/tools/${tool.category}/${tool.slug}`;
  const outDir = path.join(DIST, "tools", tool.category, tool.slug);
  fs.mkdirSync(outDir, { recursive: true });

  const html = patchHtml(template, {
    title: tool.seoTitle,
    description: tool.seoDescription,
    canonical: url,
    jsonLd: buildJsonLd(tool),
  });

  fs.writeFileSync(path.join(outDir, "index.html"), html);
  generated++;
}

// Category pages
for (const cat of CATEGORIES) {
  const url = `${BASE_URL}/tools/${cat.id}`;
  const outDir = path.join(DIST, "tools", cat.id);
  fs.mkdirSync(outDir, { recursive: true });

  const html = patchHtml(template, {
    title: cat.seoTitle,
    description: cat.seoDescription,
    canonical: url,
    jsonLd: buildCategoryJsonLd(cat),
  });

  fs.writeFileSync(path.join(outDir, "index.html"), html);
  generated++;
}

console.log(`✅ Pre-rendered ${generated} HTML files with per-page meta tags.`);

// ── Regenerate sitemap with lastmod ──────────────────────────────────────────

const sitemapPath = path.join(DIST, "sitemap.xml");

const toolUrls = TOOLS.map(t => `
  <url>
    <loc>${BASE_URL}/tools/${t.category}/${t.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${["word-counter","json-formatter","qr-generator","password-generator","image-resize","pdf-merge"].includes(t.slug) ? "0.9" : "0.8"}</priority>
  </url>`).join("");

const categoryUrls = CATEGORIES.map(c => `
  <url>
    <loc>${BASE_URL}/tools/${c.id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/pricing</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/api-docs</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/privacy</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${BASE_URL}/terms</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
${categoryUrls}
${toolUrls}
</urlset>
`;

fs.writeFileSync(sitemapPath, sitemap);
console.log(`✅ Sitemap regenerated with ${TOOLS.length + CATEGORIES.length + 5} URLs and today's lastmod (${TODAY}).`);
