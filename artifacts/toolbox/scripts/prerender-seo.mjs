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
  // All 5 agent-critical tools
  { slug: "number-base-converter", category: "developer", name: "Number Base Converter", seoTitle: "Free Number Base Converter — Decimal, Binary, Octal, Hex Online",          seoDescription: "Convert numbers between decimal, binary (base 2), octal (base 8), and hexadecimal (base 16) instantly. Free online number base converter for developers." },
  { slug: "string-escape",         category: "developer", name: "String Escape Tool",    seoTitle: "Free String Escape Tool — Escape JSON, SQL, Regex, Shell Strings Online",  seoDescription: "Escape or unescape strings for JSON, SQL, regular expressions, CSV, Bash/Shell, and XML. Free online string escape tool for developers. Nothing uploaded." },
  // Agent-critical tools
  { slug: "token-counter",       category: "developer",   name: "Token Counter",           seoTitle: "Free Token Counter — Count LLM Tokens for GPT-4, Claude & Llama Online",  seoDescription: "Count tokens in any text using accurate tokenizer models for GPT-4o, GPT-4, GPT-3.5, Claude, and Llama. See context window usage. Free, browser-based, 100% private." },
  { slug: "yaml-json-converter", category: "developer",   name: "YAML ↔ JSON Converter",   seoTitle: "Free YAML to JSON Converter — Convert YAML ↔ JSON Online",               seoDescription: "Convert YAML to JSON or JSON to YAML instantly. Validate syntax, swap directions, and load examples. Free online YAML JSON converter — nothing uploaded." },
  { slug: "cron-parser",         category: "developer",   name: "Cron Expression Parser",  seoTitle: "Free Cron Expression Parser — Decode & Validate Cron Jobs Online",        seoDescription: "Parse any cron expression into plain English and preview the next 5 run times. Includes common presets and a quick-reference table. Free online cron parser." },
  // New tools
  { slug: "jwt-decoder",       category: "developer",   name: "JWT Decoder",             seoTitle: "Free JWT Decoder — Decode & Inspect JSON Web Tokens Online",            seoDescription: "Decode any JWT token and inspect the header, payload, and signature. Shows expiry status and claims. 100% private — your token never leaves your browser." },
  { slug: "regex-tester",      category: "developer",   name: "Regex Tester",            seoTitle: "Free Regex Tester — Test Regular Expressions Online with Live Highlighting", seoDescription: "Test regex patterns against any text with live match highlighting. Supports flags (g, i, m, s), shows all matches and capture groups. Free online regex tester." },
  { slug: "text-sorter",       category: "text",        name: "Text Sorter",             seoTitle: "Free Text Sorter — Sort, Remove Duplicates & Clean Lines Online",        seoDescription: "Sort lines A→Z or Z→A, remove duplicates, remove empty lines, reverse, shuffle, trim whitespace, or number lines. Free online text line sorter tool." },
  { slug: "html-entities",     category: "developer",   name: "HTML Entities",           seoTitle: "Free HTML Entity Encoder & Decoder — Encode & Decode HTML Entities Online", seoDescription: "Encode special characters to HTML entities or decode entities back to text. Supports named entities, numeric references, and common HTML characters." },
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

function buildFaqJsonLd(tool) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Does ${tool.name} upload my files?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `No. ${tool.name} runs entirely in your browser using WebAssembly. Your files never leave your device and are never sent to any server.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${tool.name} free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, ${tool.name} is completely free with no signup or account required.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${tool.name} private and secure?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. All processing happens locally in your browser — no data is collected, no files are uploaded, and no usage is tracked. Your privacy is fully preserved.`,
        },
      },
      {
        "@type": "Question",
        name: `Do I need to create an account to use ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `No account or registration is required. Open the tool and start using it instantly.`,
        },
      },
    ],
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

  // Inject JSON-LD right before </head> — supports array for multiple blocks
  const ldBlocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  const ldTags = ldBlocks.map(ld => `  <script type="application/ld+json">${ld}</script>`).join("\n");
  html = html.replace(/<\/head>/, `${ldTags}\n</head>`);

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
    jsonLd: [buildJsonLd(tool), buildFaqJsonLd(tool)],
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

const BLOG_POSTS = [
  { slug: "merge-pdfs-without-uploading",        title: "How to Merge PDFs Without Uploading Files",                               description: "Most PDF tools send your files to remote servers. Here's how to merge PDFs entirely in your browser — no uploads, no accounts, no risk." },
  { slug: "best-free-image-compressor-privacy",  title: "The Best Free Image Compressor That Doesn't See Your Files",             description: "TinyPNG, Squoosh, Canva — they all upload your images. Here's a faster alternative that compresses images entirely in your browser." },
  { slug: "why-i-built-client-side-toolbox",     title: "Why I Built a 100% Client-Side Toolbox",                                  description: "The story behind Toolora — why I decided every tool should run in the browser, what that means technically, and what the tradeoffs are." },
  { slug: "base64-encode-decode-online",          title: "Free Base64 Encoder & Decoder — No Sign-Up, No Server Required",         description: "Base64 encoding explained in plain English, plus a free browser-based tool that encodes and decodes instantly — no account, no data sent anywhere." },
  { slug: "free-password-generator-no-signup",   title: "How to Generate Strong Passwords Without a Password Manager",             description: "What makes a password strong, why most people get it wrong, and how to generate truly random passwords instantly — without installing anything." },
  { slug: "free-qr-code-generator-no-watermark", title: "The Best Free QR Code Generator — No Watermarks, No Sign-Up, No Ads",    description: "Most free QR code generators add watermarks or expire your codes. Here's how to generate clean QR codes instantly, for free, with no strings attached." },
  { slug: "json-formatter-validate-debug",        title: "JSON Formatter: How to Read, Validate and Debug JSON Online",            description: "JSON errors are cryptic. A missing comma or brace can break everything. Here's how to format, validate, and debug JSON fast — no server required." },
  { slug: "hashing-vs-encryption-whats-the-difference", title: "Hashing vs Encryption: What's the Difference and When to Use Each", description: "Hashing and encryption are both used to protect data, but they work very differently. Learn the key distinctions, common algorithms, and when to use each — with code examples." },
];

const blogListUrl = `  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

const blogPostUrls = BLOG_POSTS.map(p => `  <url>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");

// Pre-render blog list page
const blogListDir = path.join(DIST, "blog");
fs.mkdirSync(blogListDir, { recursive: true });
const blogListHtml = template
  .replace(/<title>[^<]*<\/title>/, `<title>Blog | Toolora</title>`)
  .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="Privacy, tools, and the indie web. Articles from the Toolora team.">`)
  .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${BASE_URL}/blog">`)
  .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="Blog | Toolora">`)
  .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="Privacy, tools, and the indie web.">`)
  .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${BASE_URL}/blog">`)
  .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="Blog | Toolora">`)
  .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="Privacy, tools, and the indie web.">`);
fs.writeFileSync(path.join(blogListDir, "index.html"), blogListHtml);

// Pre-render individual blog post pages
for (const post of BLOG_POSTS) {
  const postDir = path.join(DIST, "blog", post.slug);
  fs.mkdirSync(postDir, { recursive: true });
  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: TODAY,
    dateModified: TODAY,
    publisher: { "@type": "Organization", name: "Toolora", url: BASE_URL },
    author: { "@type": "Organization", name: "Toolora" },
  });
  const postHtml = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(post.title)} | Toolora Blog</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(post.description)}">`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${BASE_URL}/blog/${post.slug}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(post.title)}">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(post.description)}">`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${BASE_URL}/blog/${post.slug}">`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(post.title)}">`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(post.description)}">`)
    .replace("</head>", `<script type="application/ld+json">${articleJsonLd}</script>\n</head>`);
  fs.writeFileSync(path.join(postDir, "index.html"), postHtml);
}

const totalBlogPages = BLOG_POSTS.length + 1;
console.log(`✅ Pre-rendered ${totalBlogPages} blog pages (list + ${BLOG_POSTS.length} posts).`);

// ── Converter pages ───────────────────────────────────────────────────────────
const CONVERTERS = [
  { slug: "jpg-to-png",       title: "JPG to PNG Converter — Free, Online, No Upload",                   description: "Convert JPG images to PNG format instantly in your browser. No upload, no server, 100% private. Supports batch conversion." },
  { slug: "png-to-jpg",       title: "PNG to JPG Converter — Free, Online, No Upload",                   description: "Convert PNG images to JPG/JPEG format instantly in your browser. 100% private, no upload required. Reduce file size without losing quality." },
  { slug: "webp-to-jpg",      title: "WebP to JPG Converter — Free Online, No Upload",                   description: "Convert WebP images to JPG format instantly in your browser. No signup, no upload. Works offline." },
  { slug: "jpg-to-webp",      title: "JPG to WebP Converter — Free Online, Reduce Image Size",           description: "Convert JPG images to WebP format online for free. WebP files are 25–35% smaller than JPG. No upload, no server." },
  { slug: "base64-encode",    title: "Base64 Encoder Online — Free, No Upload",                          description: "Encode text or files to Base64 format instantly in your browser. No upload, no server, instant results. Free Base64 encoding tool." },
  { slug: "base64-decode",    title: "Base64 Decoder Online — Free, Instant, No Upload",                 description: "Decode Base64 strings back to readable text or download as a file. Free, instant, runs in your browser." },
  { slug: "url-encode",       title: "URL Encoder Online — Free, Instant, No Upload",                    description: "Encode strings for safe use in URLs. Converts spaces and special characters to percent-encoded format. Free, instant, browser-based." },
  { slug: "url-decode",       title: "URL Decoder Online — Free, Instant, No Upload",                    description: "Decode percent-encoded URLs back to readable text. Converts %20, %3D, and all other percent-encoded characters instantly." },
  { slug: "json-format",      title: "JSON Formatter Online — Free, Validate & Beautify JSON",           description: "Format, validate, and beautify JSON online for free. Syntax highlighting, error detection, collapsible tree view. Runs in your browser." },
  { slug: "json-minify",      title: "JSON Minifier Online — Free, Remove Whitespace from JSON",         description: "Minify JSON by removing all whitespace and line breaks. Reduce JSON payload size for APIs and config files. Free, instant." },
  { slug: "csv-to-json",      title: "CSV to JSON Converter Online — Free, Instant, No Upload",          description: "Convert CSV files to JSON format instantly in your browser. Supports headers, custom delimiters, and nested output." },
  { slug: "md5-hash",         title: "MD5 Hash Generator Online — Free, Instant, No Upload",             description: "Generate MD5 hashes from any text or file in your browser. Instant, free, no upload required. Supports MD5, SHA-1, SHA-256, and SHA-512." },
  { slug: "sha256-hash",      title: "SHA-256 Hash Generator Online — Free, Instant",                    description: "Generate SHA-256 hashes from text or files for free. Browser-based, private, instant. Also supports MD5, SHA-1, and SHA-512." },
  { slug: "text-to-qr",       title: "Text to QR Code Generator — Free, No Watermark",                  description: "Generate QR codes from any text, URL, or data instantly. Free, no watermark, downloadable PNG. No sign-up required." },
  { slug: "unix-timestamp",   title: "Unix Timestamp Converter Online — Free, Instant",                  description: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Free, instant, no upload." },
  { slug: "uuid-generator",   title: "UUID Generator Online — Free, v4 UUID, Bulk Generate",             description: "Generate random v4 UUIDs instantly. Bulk generate, copy to clipboard, free. No sign-up. Browser-based UUID generation." },
  { slug: "password-generator",title:"Password Generator Online — Free, Strong, No Signup",             description: "Generate strong, random passwords instantly. Choose length, include symbols, numbers, uppercase. Free, no account, browser-based." },
  { slug: "hex-to-rgb",       title: "HEX to RGB Color Converter — Free Online Tool",                    description: "Convert HEX color codes to RGB values instantly. Also supports HSL output. Free, browser-based color conversion tool." },
  { slug: "rgb-to-hex",       title: "RGB to HEX Color Converter — Free Online Tool",                    description: "Convert RGB color values to HEX color codes instantly. Also supports HSL. Free, browser-based, no upload required." },
  { slug: "word-count",       title: "Word Counter Online — Free, Instant, Characters & Reading Time",   description: "Count words, characters, sentences, and estimate reading time instantly. Free online word counter — no upload, works offline." },
  { slug: "markdown-preview", title: "Markdown Preview Online — Free, Live, No Upload",                  description: "Preview Markdown as rendered HTML in real time. Supports GitHub-flavored Markdown, tables, code blocks. Free, browser-based." },
];

for (const conv of CONVERTERS) {
  const dir = path.join(DIST, "convert", conv.slug);
  fs.mkdirSync(dir, { recursive: true });
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${conv.title}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${conv.description}">`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${BASE_URL}/convert/${conv.slug}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${conv.title}">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${conv.description}">`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${BASE_URL}/convert/${conv.slug}">`);
  fs.writeFileSync(path.join(dir, "index.html"), html);
}
console.log(`✅ Pre-rendered ${CONVERTERS.length} converter pages.`);

// ── Glossary pages ────────────────────────────────────────────────────────────
const GLOSSARY_TERMS = [
  { slug: "base64",       title: "What is Base64? Definition, Examples & Use Cases — Toolora Glossary",             description: "Base64 is a binary-to-text encoding scheme that represents binary data as ASCII characters. Learn how it works, when to use it, and see examples." },
  { slug: "jwt",          title: "What is a JWT? JSON Web Token Explained with Examples — Toolora Glossary",         description: "A JWT (JSON Web Token) is a compact, URL-safe token for securely transmitting claims. Learn the structure, how it works, and when to use it." },
  { slug: "url-encoding", title: "What is URL Encoding? Percent Encoding Explained — Toolora Glossary",              description: "URL encoding converts special characters in URLs to a safe format. Learn what it is, why it's needed, and see examples." },
  { slug: "json",         title: "What is JSON? JavaScript Object Notation Explained — Toolora Glossary",            description: "JSON is a lightweight data interchange format. Learn the syntax, data types, use cases, and how to work with JSON in JavaScript and APIs." },
  { slug: "hash",         title: "What is a Hash Function? Cryptographic Hashing Explained — Toolora Glossary",      description: "A hash function maps data of arbitrary size to a fixed-size output. Learn how MD5, SHA-256, and other algorithms work." },
  { slug: "qr-code",      title: "What is a QR Code? How QR Codes Work Explained — Toolora Glossary",               description: "QR codes are 2D barcodes that store text, URLs, and data. Learn how they work, what they can store, and how to generate them free." },
  { slug: "regex",        title: "What is a Regular Expression (Regex)? Explained with Examples — Toolora Glossary", description: "A regular expression (regex) is a pattern for matching text. Learn regex syntax, common patterns, and how to use it in JavaScript and Python." },
  { slug: "unicode",      title: "What is Unicode? The Universal Character Standard Explained — Toolora Glossary",   description: "Unicode is the universal character encoding standard that covers 140,000+ characters. Learn how it works and how UTF-8 relates to it." },
  { slug: "ascii",        title: "What is ASCII? The ASCII Character Table Explained — Toolora Glossary",            description: "ASCII is a 7-bit character encoding standard. Learn the ASCII table, printable characters, and how it relates to Unicode." },
  { slug: "pdf",          title: "What is a PDF? Portable Document Format Explained — Toolora Glossary",             description: "PDF is Adobe's open file format for fixed-layout documents. Learn how PDFs work, their structure, and how to process them programmatically." },
];

// Pre-render glossary index
const glossaryIndexDir = path.join(DIST, "glossary");
fs.mkdirSync(glossaryIndexDir, { recursive: true });
const glossaryIndexHtml = template
  .replace(/<title>[^<]*<\/title>/, `<title>Developer &amp; Tech Glossary — Toolora</title>`)
  .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="Free developer glossary explaining Base64, JWT, URL encoding, JSON, regex, hashing, Unicode, and more. Clear definitions with examples.">`)
  .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${BASE_URL}/glossary">`)
  .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${BASE_URL}/glossary">`);
fs.writeFileSync(path.join(glossaryIndexDir, "index.html"), glossaryIndexHtml);

for (const term of GLOSSARY_TERMS) {
  const dir = path.join(DIST, "glossary", term.slug);
  fs.mkdirSync(dir, { recursive: true });
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${term.title}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${term.description}">`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${BASE_URL}/glossary/${term.slug}">`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${term.title}">`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${term.description}">`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${BASE_URL}/glossary/${term.slug}">`);
  fs.writeFileSync(path.join(dir, "index.html"), html);
}
console.log(`✅ Pre-rendered ${GLOSSARY_TERMS.length + 1} glossary pages (index + ${GLOSSARY_TERMS.length} terms).`);

const converterUrls = CONVERTERS.map(c => `  <url>
    <loc>${BASE_URL}/convert/${c.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");

const glossaryUrls = [
  `  <url>\n    <loc>${BASE_URL}/glossary</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
  ...GLOSSARY_TERMS.map(t => `  <url>
    <loc>${BASE_URL}/glossary/${t.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`),
].join("\n");

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
${blogListUrl}
${blogPostUrls}
${categoryUrls}
${toolUrls}
${converterUrls}
${glossaryUrls}
</urlset>
`;

fs.writeFileSync(sitemapPath, sitemap);
const totalUrls = TOOLS.length + CATEGORIES.length + 5 + totalBlogPages + CONVERTERS.length + GLOSSARY_TERMS.length + 1;
console.log(`✅ Sitemap regenerated with ${totalUrls} URLs and today's lastmod (${TODAY}).`);
