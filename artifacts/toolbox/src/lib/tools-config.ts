import { 
  FileText, Type, Hash, Shield, KeyRound, QrCode, ArrowLeftRight, 
  Palette, Image as ImageIcon, FileJson, Clock, Link as LinkIcon, 
  Scissors, Minimize, SplitSquareHorizontal, Layers, Fingerprint, RefreshCcw,
  BookOpen, ListOrdered, Code2, CodeXml, Coins, GitCompare, CalendarClock
} from "lucide-react";

export type ToolCategory = "pdf" | "image" | "text" | "developer" | "productivity";

export interface ToolDef {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: any;
  category: ToolCategory;
  isPopular?: boolean;
}

export const CATEGORIES: { id: ToolCategory; name: string; description: string; icon: any }[] = [
  { id: "pdf", name: "PDF Tools", description: "Merge, split, and compress PDFs locally.", icon: FileText },
  { id: "image", name: "Image Tools", description: "Resize, convert, and compress images.", icon: ImageIcon },
  { id: "text", name: "Text Tools", description: "Count words, change cases, and format text.", icon: Type },
  { id: "developer", name: "Developer Tools", description: "Format JSON, hash strings, decode Base64.", icon: Hash },
  { id: "productivity", name: "Productivity", description: "Generate passwords, QR codes, and convert units.", icon: Shield },
];

export const TOOLS: ToolDef[] = [
  // Text Tools
  {
    id: "word-counter", name: "Word Counter", slug: "word-counter", category: "text", isPopular: true, icon: Type,
    description: "Count words, characters, sentences, and paragraphs in real-time.",
    seoTitle: "Free Word Counter — Count Words, Characters & Sentences Online | Toolora",
    seoDescription: "Instantly count words, characters, sentences, paragraphs and reading time. Free, private, 100% browser-based. No signup needed.",
  },
  {
    id: "case-converter", name: "Case Converter", slug: "case-converter", category: "text", icon: ArrowLeftRight,
    description: "Convert text between UPPERCASE, lowercase, camelCase, and more.",
    seoTitle: "Free Case Converter — UPPERCASE, lowercase, camelCase & more | Toolora",
    seoDescription: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case and PascalCase instantly. Free online text case converter.",
  },
  {
    id: "lorem-ipsum", name: "Lorem Ipsum Generator", slug: "lorem-ipsum", category: "text", icon: FileText,
    description: "Generate placeholder text for your designs.",
    seoTitle: "Free Lorem Ipsum Generator — Placeholder Text for Designers | Toolora",
    seoDescription: "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Choose count, customize start, copy instantly. Free online tool.",
  },
  {
    id: "markdown-preview", name: "Markdown Preview", slug: "markdown-preview", category: "text", icon: BookOpen,
    description: "Write markdown and see a live rendered preview side-by-side.",
    seoTitle: "Free Markdown Preview — Live Markdown Editor & Renderer Online | Toolora",
    seoDescription: "Write markdown and see a live side-by-side HTML preview. Free online markdown editor with instant rendering. No signup required.",
  },
  {
    id: "text-diff", name: "Text Diff", slug: "text-diff", category: "text", icon: SplitSquareHorizontal,
    description: "Compare two texts and highlight all the differences.",
    seoTitle: "Free Text Diff Tool — Compare Two Texts Online & Find Differences | Toolora",
    seoDescription: "Compare two blocks of text and highlight additions, removals and unchanged lines. Free online text diff and comparison tool.",
  },

  // Developer Tools
  {
    id: "json-formatter", name: "JSON Formatter", slug: "json-formatter", category: "developer", isPopular: true, icon: FileJson,
    description: "Format, validate, and minify JSON data.",
    seoTitle: "Free JSON Formatter & Validator — Pretty Print & Minify JSON Online | Toolora",
    seoDescription: "Format and validate JSON instantly. Pretty-print messy JSON or minify it for production. Free online JSON formatter with error detection.",
  },
  {
    id: "base64", name: "Base64 Encoder/Decoder", slug: "base64", category: "developer", icon: Hash,
    description: "Encode text to Base64 or decode it back.",
    seoTitle: "Free Base64 Encoder & Decoder — Encode or Decode Base64 Online | Toolora",
    seoDescription: "Encode text to Base64 or decode Base64 strings back to plain text. Free online Base64 encoder/decoder tool. No data sent to servers.",
  },
  {
    id: "url-encoder", name: "URL Encoder/Decoder", slug: "url-encoder", category: "developer", icon: LinkIcon,
    description: "Safely encode or decode URL parameters.",
    seoTitle: "Free URL Encoder & Decoder — Encode or Decode URLs Online | Toolora",
    seoDescription: "Encode special characters in URLs or decode percent-encoded strings. Free online URL encoder and decoder tool for developers.",
  },
  {
    id: "hash-generator", name: "Hash Generator", slug: "hash-generator", category: "developer", icon: Fingerprint,
    description: "Generate MD5, SHA-1, SHA-256 hashes.",
    seoTitle: "Free Hash Generator — MD5, SHA-1, SHA-256 Hash Online | Toolora",
    seoDescription: "Generate MD5, SHA-1, and SHA-256 cryptographic hashes from any text. Free online hash generator. All processing done in your browser.",
  },
  {
    id: "uuid-generator", name: "UUID Generator", slug: "uuid-generator", category: "developer", icon: KeyRound,
    description: "Generate random UUIDs (v4) in bulk.",
    seoTitle: "Free UUID Generator — Generate Random UUIDs v4 Online in Bulk | Toolora",
    seoDescription: "Generate one or multiple UUID v4 strings instantly. Free online UUID generator for developers. Copy all with one click.",
  },

  // Productivity Tools
  {
    id: "qr-generator", name: "QR Code Generator", slug: "qr-generator", category: "productivity", isPopular: true, icon: QrCode,
    description: "Create customized QR codes from URLs or text.",
    seoTitle: "Free QR Code Generator — Create Custom QR Codes Online | Toolora",
    seoDescription: "Generate QR codes from any URL or text. Free online QR code generator with custom colors. Download as PNG instantly.",
  },
  {
    id: "password-generator", name: "Password Generator", slug: "password-generator", category: "productivity", isPopular: true, icon: Shield,
    description: "Create highly secure, random passwords.",
    seoTitle: "Free Password Generator — Create Strong, Secure Passwords Online | Toolora",
    seoDescription: "Generate strong random passwords with custom length, uppercase, numbers and symbols. Free secure password generator — nothing is stored or transmitted.",
  },
  {
    id: "unit-converter", name: "Unit Converter", slug: "unit-converter", category: "productivity", icon: RefreshCcw,
    description: "Convert between various units of measurement.",
    seoTitle: "Free Unit Converter — Length, Weight, Temperature & More Online | Toolora",
    seoDescription: "Convert between units of length, weight, temperature, area, speed, and volume. Free online unit converter for everyday and scientific use.",
  },
  {
    id: "color-picker", name: "Color Converter", slug: "color-picker", category: "productivity", icon: Palette,
    description: "Convert between HEX, RGB, and HSL color formats.",
    seoTitle: "Free Color Converter — HEX to RGB to HSL Color Picker Online | Toolora",
    seoDescription: "Convert colors between HEX, RGB, and HSL formats. Use the color picker, RGB sliders, or type a hex code. Free online color converter tool.",
  },
  {
    id: "timestamp-converter", name: "Timestamp Converter", slug: "timestamp-converter", category: "productivity", icon: Clock,
    description: "Convert Unix timestamps to human-readable dates.",
    seoTitle: "Free Unix Timestamp Converter — Convert Epoch Time Online | Toolora",
    seoDescription: "Convert Unix timestamps to human-readable dates and times. See ISO 8601, UTC, relative time and more. Free online epoch timestamp converter.",
  },

  {
    id: "jwt-decoder", name: "JWT Decoder", slug: "jwt-decoder", category: "developer", isPopular: true, icon: KeyRound,
    description: "Decode and inspect JSON Web Tokens — header, payload, and expiry.",
    seoTitle: "Free JWT Decoder — Decode & Inspect JSON Web Tokens Online | Toolora",
    seoDescription: "Decode any JWT token and inspect the header, payload, and signature. Shows expiry status and claims. 100% private — your token never leaves your browser.",
  },
  {
    id: "regex-tester", name: "Regex Tester", slug: "regex-tester", category: "developer", isPopular: true, icon: Code2,
    description: "Write and test regular expressions with live match highlighting.",
    seoTitle: "Free Regex Tester — Test Regular Expressions Online with Live Highlighting | Toolora",
    seoDescription: "Test regex patterns against any text with live match highlighting. Supports flags (g, i, m, s), shows all matches and capture groups. Free online regex tester.",
  },
  {
    id: "text-sorter", name: "Text Sorter", slug: "text-sorter", category: "text", icon: ListOrdered,
    description: "Sort, deduplicate, shuffle, and clean lines of text.",
    seoTitle: "Free Text Sorter — Sort, Remove Duplicates & Clean Lines Online | Toolora",
    seoDescription: "Sort lines A→Z or Z→A, remove duplicates, remove empty lines, reverse, shuffle, trim whitespace, or number lines. Free online text line sorter tool.",
  },
  {
    id: "html-entities", name: "HTML Entities", slug: "html-entities", category: "developer", icon: CodeXml,
    description: "Encode and decode HTML special characters and entities.",
    seoTitle: "Free HTML Entity Encoder & Decoder — Encode & Decode HTML Entities Online | Toolora",
    seoDescription: "Encode special characters to HTML entities or decode entities back to text. Supports named entities, numeric references, and common HTML characters. Free online tool.",
  },

  {
    id: "token-counter", name: "Token Counter", slug: "token-counter", category: "developer", isPopular: true, icon: Coins,
    description: "Count tokens for GPT-4, Claude, and Llama models with exact tokenizer logic.",
    seoTitle: "Free Token Counter — Count LLM Tokens for GPT-4, Claude & Llama Online | Toolora",
    seoDescription: "Count tokens in any text using accurate tokenizer models for GPT-4o, GPT-4, GPT-3.5, Claude, and Llama. See context window usage. Free, browser-based, 100% private.",
  },
  {
    id: "yaml-json-converter", name: "YAML ↔ JSON Converter", slug: "yaml-json-converter", category: "developer", isPopular: true, icon: GitCompare,
    description: "Convert between YAML and JSON formats instantly.",
    seoTitle: "Free YAML to JSON Converter — Convert YAML ↔ JSON Online | Toolora",
    seoDescription: "Convert YAML to JSON or JSON to YAML instantly. Validate syntax, swap directions, and load examples. Free online YAML JSON converter — nothing uploaded.",
  },
  {
    id: "cron-parser", name: "Cron Expression Parser", slug: "cron-parser", category: "developer", icon: CalendarClock,
    description: "Translate cron expressions into plain English and preview next run times.",
    seoTitle: "Free Cron Expression Parser — Decode & Validate Cron Jobs Online | Toolora",
    seoDescription: "Parse any cron expression into plain English and preview the next 5 run times. Includes common presets and a quick-reference table. Free online cron parser.",
  },

  // Image Tools
  {
    id: "image-resize", name: "Image Resizer", slug: "image-resize", category: "image", isPopular: true, icon: ImageIcon,
    description: "Change the dimensions of any image instantly.",
    seoTitle: "Free Image Resizer — Resize Images Online Without Uploading | Toolora",
    seoDescription: "Resize any image by pixels or percentage. Lock aspect ratio, set custom dimensions, adjust quality. Free online image resizer — files never leave your device.",
  },
  {
    id: "image-compress", name: "Image Compressor", slug: "image-compress", category: "image", icon: Minimize,
    description: "Reduce image file size while maintaining quality.",
    seoTitle: "Free Image Compressor — Compress Images Online Without Losing Quality | Toolora",
    seoDescription: "Compress JPG, PNG and WebP images and reduce file size without visible quality loss. Free online image compressor — 100% private, browser-based.",
  },
  {
    id: "image-convert", name: "Image Converter", slug: "image-convert", category: "image", icon: RefreshCcw,
    description: "Convert images between PNG, JPG, WebP, etc.",
    seoTitle: "Free Image Converter — Convert JPG, PNG, WebP Online | Toolora",
    seoDescription: "Convert images between JPEG, PNG, and WebP formats instantly. Free online image format converter. No uploads, no registration, fully private.",
  },

  // PDF Tools
  {
    id: "pdf-merge", name: "Merge PDF", slug: "pdf-merge", category: "pdf", isPopular: true, icon: Layers,
    description: "Combine multiple PDF files into a single document.",
    seoTitle: "Free PDF Merger — Combine & Merge PDF Files Online | Toolora",
    seoDescription: "Merge multiple PDF files into one document. Drag, reorder and combine PDFs in seconds. Free online PDF merger — files never leave your browser.",
  },
  {
    id: "pdf-split", name: "Split PDF", slug: "pdf-split", category: "pdf", icon: SplitSquareHorizontal,
    description: "Extract pages from a PDF or split it into multiple files.",
    seoTitle: "Free PDF Splitter — Split or Extract Pages from PDF Online | Toolora",
    seoDescription: "Split a PDF into individual pages, extract page ranges, or divide every N pages. Free online PDF splitter — fully client-side, nothing uploaded.",
  },
];

export const getToolBySlug = (slug: string) => TOOLS.find(t => t.slug === slug);
export const getToolsByCategory = (category: string) => TOOLS.filter(t => t.category === category);
export const getCategoryById = (id: string) => CATEGORIES.find(c => c.id === id);
