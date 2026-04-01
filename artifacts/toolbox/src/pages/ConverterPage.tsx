import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Lock, Zap } from "lucide-react";

export interface ConverterMeta {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  toolSlug: string;
  toolCategory: string;
  toolName: string;
  howItWorks: string[];
  faqs: { q: string; a: string }[];
  related: { slug: string; label: string }[];
}

const CONVERTERS: ConverterMeta[] = [
  {
    slug: "jpg-to-png",
    title: "JPG to PNG Converter",
    metaTitle: "JPG to PNG Converter — Free, Online, No Upload",
    metaDescription: "Convert JPG images to PNG format instantly in your browser. No upload, no server, 100% private. Supports batch conversion.",
    h1: "JPG to PNG Converter — Free & Private",
    intro: "Convert any JPG or JPEG image to PNG format directly in your browser. Your files never leave your device — no servers, no uploads, no privacy risk.",
    toolSlug: "image-convert",
    toolCategory: "image",
    toolName: "Image Converter",
    howItWorks: [
      "Click 'Open Tool' below and drop your JPG file onto the converter",
      "Select PNG as the output format",
      "Click Convert — done in under a second",
      "Download your PNG — no watermarks, no compression, full quality",
    ],
    faqs: [
      { q: "Is JPG to PNG conversion free?", a: "Yes, completely free with no usage limits or sign-up required." },
      { q: "Does converting JPG to PNG improve quality?", a: "PNG is lossless, so no further compression is applied. Quality matches your original JPG." },
      { q: "Are my images uploaded to a server?", a: "No. Conversion happens entirely in your browser using the Canvas API. Your files never leave your device." },
      { q: "Can I convert multiple JPGs at once?", a: "Yes, the tool supports batch conversion — just drop multiple files." },
    ],
    related: [
      { slug: "png-to-jpg", label: "PNG to JPG" },
      { slug: "webp-to-jpg", label: "WebP to JPG" },
      { slug: "jpg-to-webp", label: "JPG to WebP" },
      { slug: "image-compress", label: "Image Compressor" },
    ],
  },
  {
    slug: "png-to-jpg",
    title: "PNG to JPG Converter",
    metaTitle: "PNG to JPG Converter — Free, Online, No Upload",
    metaDescription: "Convert PNG images to JPG/JPEG format instantly in your browser. 100% private, no upload required. Reduce file size without losing visible quality.",
    h1: "PNG to JPG Converter — Free & Private",
    intro: "Convert PNG images to JPG format right in your browser. Ideal for reducing file size before sharing or uploading. Zero data leaves your device.",
    toolSlug: "image-convert",
    toolCategory: "image",
    toolName: "Image Converter",
    howItWorks: [
      "Open the Image Converter tool below",
      "Drop your PNG file onto the converter",
      "Select JPG as the output format and choose quality level",
      "Download your JPG — smaller file, same visual result",
    ],
    faqs: [
      { q: "Will PNG to JPG reduce file size?", a: "Yes — JPG uses lossy compression, so file sizes are typically 60–80% smaller than PNG." },
      { q: "Does conversion affect image quality?", a: "At 85%+ quality setting the difference is invisible to the human eye. Transparent backgrounds become white." },
      { q: "Is this conversion private?", a: "Yes. Processing uses the browser's Canvas API — no network request is ever made with your image data." },
    ],
    related: [
      { slug: "jpg-to-png", label: "JPG to PNG" },
      { slug: "webp-to-jpg", label: "WebP to JPG" },
      { slug: "jpg-to-webp", label: "JPG to WebP" },
    ],
  },
  {
    slug: "webp-to-jpg",
    title: "WebP to JPG Converter",
    metaTitle: "WebP to JPG Converter — Free Online, No Upload",
    metaDescription: "Convert WebP images to JPG format instantly in your browser. No signup, no upload. Works offline.",
    h1: "WebP to JPG Converter — Instant, Free, Private",
    intro: "Convert WebP images to JPG format in one click. Perfect when you need a universally compatible image format. All processing stays on your device.",
    toolSlug: "image-convert",
    toolCategory: "image",
    toolName: "Image Converter",
    howItWorks: [
      "Open the Image Converter below",
      "Drop your WebP file into the converter",
      "Select JPG as output and adjust quality if needed",
      "Download your JPG instantly",
    ],
    faqs: [
      { q: "Why convert WebP to JPG?", a: "Some apps and older software don't support WebP. JPG is universally compatible." },
      { q: "Is this free to use?", a: "Completely free, unlimited conversions, no account required." },
    ],
    related: [
      { slug: "jpg-to-webp", label: "JPG to WebP" },
      { slug: "jpg-to-png", label: "JPG to PNG" },
      { slug: "png-to-jpg", label: "PNG to JPG" },
    ],
  },
  {
    slug: "jpg-to-webp",
    title: "JPG to WebP Converter",
    metaTitle: "JPG to WebP Converter — Free Online, Reduce Image Size",
    metaDescription: "Convert JPG images to WebP format online for free. WebP files are 25–35% smaller than JPG. No upload, no server.",
    h1: "JPG to WebP Converter — Smaller Files, Same Quality",
    intro: "WebP is Google's modern image format — typically 25–35% smaller than JPG at equivalent quality. Convert for free, right in your browser.",
    toolSlug: "image-convert",
    toolCategory: "image",
    toolName: "Image Converter",
    howItWorks: [
      "Open the Image Converter below",
      "Drop your JPG or JPEG file",
      "Select WebP as output",
      "Download the smaller WebP file",
    ],
    faqs: [
      { q: "How much smaller is WebP than JPG?", a: "WebP is typically 25–35% smaller than JPG at equivalent visual quality, making pages load faster." },
      { q: "Do all browsers support WebP?", a: "Yes — Chrome, Safari, Firefox, and Edge all support WebP as of 2021." },
    ],
    related: [
      { slug: "webp-to-jpg", label: "WebP to JPG" },
      { slug: "jpg-to-png", label: "JPG to PNG" },
    ],
  },
  {
    slug: "base64-encode",
    title: "Base64 Encoder — Encode Text or Files to Base64",
    metaTitle: "Base64 Encoder Online — Free, No Upload",
    metaDescription: "Encode text or files to Base64 format instantly in your browser. No upload, no server, instant results. Free Base64 encoding tool.",
    h1: "Base64 Encoder — Free Online Tool",
    intro: "Encode any text string or file to Base64 format instantly. Used in APIs, email attachments, data URIs, and authentication headers. All processing is local.",
    toolSlug: "base64",
    toolCategory: "developer",
    toolName: "Base64 Encoder/Decoder",
    howItWorks: [
      "Open the Base64 tool below",
      "Paste your text or drag a file into the input field",
      "Switch to 'Encode' mode",
      "Copy the Base64 output — ready to use",
    ],
    faqs: [
      { q: "What is Base64 encoding used for?", a: "Base64 is used to represent binary data as ASCII text — common in APIs, email (MIME), data URIs, and HTTP Basic Auth headers." },
      { q: "Does encoding increase file size?", a: "Yes — Base64 encoding increases size by approximately 33%." },
      { q: "Is this tool free?", a: "Yes, unlimited, no sign-up required." },
    ],
    related: [
      { slug: "base64-decode", label: "Base64 Decode" },
      { slug: "url-encode", label: "URL Encode" },
      { slug: "md5-hash", label: "MD5 Hash" },
    ],
  },
  {
    slug: "base64-decode",
    title: "Base64 Decoder — Decode Base64 to Text or File",
    metaTitle: "Base64 Decoder Online — Free, Instant, No Upload",
    metaDescription: "Decode Base64 strings back to readable text or download as a file. Free, instant, runs in your browser. No data sent to any server.",
    h1: "Base64 Decoder — Free Online Tool",
    intro: "Decode any Base64 string back to plain text or binary file instantly. Handles standard Base64 and URL-safe Base64 variants.",
    toolSlug: "base64",
    toolCategory: "developer",
    toolName: "Base64 Encoder/Decoder",
    howItWorks: [
      "Open the Base64 tool below",
      "Paste your Base64 string into the input",
      "Switch to 'Decode' mode",
      "View the decoded text or download the file",
    ],
    faqs: [
      { q: "What is Base64 decoding?", a: "Decoding reverses Base64 encoding — converting the ASCII-safe encoded string back to its original binary or text form." },
      { q: "What if my Base64 string has padding issues?", a: "The tool automatically handles missing = padding and URL-safe variants (- and _ instead of + and /)." },
    ],
    related: [
      { slug: "base64-encode", label: "Base64 Encode" },
      { slug: "url-decode", label: "URL Decode" },
    ],
  },
  {
    slug: "url-encode",
    title: "URL Encoder — Encode Special Characters for URLs",
    metaTitle: "URL Encoder Online — Free, Instant, No Upload",
    metaDescription: "Encode strings for safe use in URLs. Converts spaces and special characters to percent-encoded format. Free, instant, browser-based.",
    h1: "URL Encoder — Free Online Tool",
    intro: "Encode any string for safe use in a URL query parameter or path. Converts spaces to %20, special characters to their percent-encoded equivalents.",
    toolSlug: "url-encoder",
    toolCategory: "developer",
    toolName: "URL Encoder/Decoder",
    howItWorks: [
      "Open the URL Encoder/Decoder below",
      "Paste the text you want to encode",
      "Select 'Encode' mode",
      "Copy the URL-safe encoded output",
    ],
    faqs: [
      { q: "Why do URLs need encoding?", a: "URLs can only contain certain ASCII characters. Special characters like spaces, &, =, and # must be percent-encoded to avoid breaking the URL structure." },
      { q: "What's the difference between encodeURI and encodeURIComponent?", a: "encodeURIComponent encodes more characters (including / and ?) and is used for query parameter values. The tool uses encodeURIComponent by default." },
    ],
    related: [
      { slug: "url-decode", label: "URL Decode" },
      { slug: "base64-encode", label: "Base64 Encode" },
    ],
  },
  {
    slug: "url-decode",
    title: "URL Decoder — Decode Percent-Encoded URLs",
    metaTitle: "URL Decoder Online — Free, Instant, No Upload",
    metaDescription: "Decode percent-encoded URLs back to readable text. Converts %20, %3D, and all other percent-encoded characters instantly. Free online tool.",
    h1: "URL Decoder — Free Online Tool",
    intro: "Decode any percent-encoded URL or query string back to human-readable text. Handles both full URLs and individual parameter values.",
    toolSlug: "url-encoder",
    toolCategory: "developer",
    toolName: "URL Encoder/Decoder",
    howItWorks: [
      "Open the URL Encoder/Decoder below",
      "Paste your encoded URL or string",
      "Select 'Decode' mode",
      "See the decoded readable text instantly",
    ],
    faqs: [
      { q: "What does %20 mean in a URL?", a: "%20 is the URL-encoded representation of a space character. Any character outside the safe URL set is encoded as a percent sign followed by its hex value." },
      { q: "Can I decode a full URL?", a: "Yes — paste the complete URL and the decoder handles both the path and query parameters." },
    ],
    related: [
      { slug: "url-encode", label: "URL Encode" },
      { slug: "base64-decode", label: "Base64 Decode" },
    ],
  },
  {
    slug: "json-format",
    title: "JSON Formatter & Beautifier",
    metaTitle: "JSON Formatter Online — Free, Validate & Beautify JSON",
    metaDescription: "Format, validate, and beautify JSON online for free. Syntax highlighting, error detection, collapsible tree view. Runs in your browser — no upload.",
    h1: "JSON Formatter & Validator — Free Online Tool",
    intro: "Paste any JSON string and instantly format it with proper indentation, syntax highlighting, and tree navigation. Errors are highlighted with exact line numbers.",
    toolSlug: "json-formatter",
    toolCategory: "developer",
    toolName: "JSON Formatter",
    howItWorks: [
      "Open the JSON Formatter below",
      "Paste your raw or minified JSON",
      "Click Format — the output is instantly beautified",
      "Use the tree view to navigate complex structures",
    ],
    faqs: [
      { q: "What is JSON formatting?", a: "JSON formatting adds whitespace and indentation to make compact JSON readable. It doesn't change the data, only the presentation." },
      { q: "Can this validate JSON?", a: "Yes — the tool highlights syntax errors and shows the exact line and character position where parsing failed." },
      { q: "Does my JSON get sent to a server?", a: "No. The formatter is entirely browser-based — your JSON data never leaves your machine." },
    ],
    related: [
      { slug: "json-minify", label: "JSON Minify" },
      { slug: "csv-to-json", label: "CSV to JSON" },
      { slug: "base64-encode", label: "Base64 Encode" },
    ],
  },
  {
    slug: "json-minify",
    title: "JSON Minifier — Minify & Compress JSON",
    metaTitle: "JSON Minifier Online — Free, Remove Whitespace from JSON",
    metaDescription: "Minify JSON by removing all whitespace and line breaks. Reduce JSON payload size for APIs and config files. Free, instant, browser-based.",
    h1: "JSON Minifier — Reduce JSON Payload Size",
    intro: "Strip whitespace, newlines, and indentation from JSON to minimize its size for production use in APIs, config files, and localStorage.",
    toolSlug: "json-formatter",
    toolCategory: "developer",
    toolName: "JSON Formatter",
    howItWorks: [
      "Open the JSON Formatter below",
      "Paste your formatted JSON",
      "Click Minify — all whitespace is removed",
      "Copy the compact JSON output",
    ],
    faqs: [
      { q: "How much does minification reduce JSON size?", a: "Typically 20–40% depending on how heavily indented the original was." },
      { q: "Is minified JSON still valid?", a: "Yes — JSON whitespace is not significant. Minified and formatted JSON are semantically identical." },
    ],
    related: [
      { slug: "json-format", label: "JSON Format" },
      { slug: "csv-to-json", label: "CSV to JSON" },
    ],
  },
  {
    slug: "csv-to-json",
    title: "CSV to JSON Converter",
    metaTitle: "CSV to JSON Converter Online — Free, Instant, No Upload",
    metaDescription: "Convert CSV files to JSON format instantly in your browser. Supports headers, custom delimiters, and nested output. Free, no upload required.",
    h1: "CSV to JSON Converter — Free Online Tool",
    intro: "Convert any CSV file or pasted CSV text to a clean JSON array in seconds. Automatically detects headers, handles quoted fields, and supports custom delimiters.",
    toolSlug: "json-formatter",
    toolCategory: "developer",
    toolName: "JSON Formatter",
    howItWorks: [
      "Open the JSON Formatter tool below",
      "Switch to CSV input mode",
      "Paste your CSV or drag in a .csv file",
      "Copy the resulting JSON array",
    ],
    faqs: [
      { q: "Does it handle CSV headers?", a: "Yes — the first row is treated as field names by default, creating a JSON array of objects." },
      { q: "What delimiters are supported?", a: "Comma, semicolon, tab, and pipe delimiters are all supported." },
    ],
    related: [
      { slug: "json-format", label: "JSON Format" },
      { slug: "json-minify", label: "JSON Minify" },
    ],
  },
  {
    slug: "md5-hash",
    title: "MD5 Hash Generator",
    metaTitle: "MD5 Hash Generator Online — Free, Instant, No Upload",
    metaDescription: "Generate MD5 hashes from any text or file in your browser. Instant, free, no upload required. Supports MD5, SHA-1, SHA-256, and SHA-512.",
    h1: "MD5 Hash Generator — Free Online Tool",
    intro: "Generate cryptographic hashes from text or files directly in your browser. Supports MD5, SHA-1, SHA-256, and SHA-512 in one tool.",
    toolSlug: "hash-generator",
    toolCategory: "developer",
    toolName: "Hash Generator",
    howItWorks: [
      "Open the Hash Generator below",
      "Type or paste your text input",
      "Select MD5 as the algorithm",
      "Copy the hash output — updates in real time as you type",
    ],
    faqs: [
      { q: "Is MD5 secure for passwords?", a: "No — MD5 is not suitable for password hashing due to known collision vulnerabilities. Use bcrypt or Argon2 for passwords instead." },
      { q: "What is MD5 used for?", a: "MD5 is used for file integrity checks, checksums, and non-security-critical fingerprinting." },
      { q: "Are my inputs sent to a server?", a: "No. Hashing uses the browser's Web Crypto API — nothing is transmitted." },
    ],
    related: [
      { slug: "sha256-hash", label: "SHA-256 Hash" },
      { slug: "base64-encode", label: "Base64 Encode" },
      { slug: "uuid-generator", label: "UUID Generator" },
    ],
  },
  {
    slug: "sha256-hash",
    title: "SHA-256 Hash Generator",
    metaTitle: "SHA-256 Hash Generator Online — Free, Instant",
    metaDescription: "Generate SHA-256 hashes from text or files for free. Browser-based, private, instant. Also supports MD5, SHA-1, and SHA-512.",
    h1: "SHA-256 Hash Generator — Free Online Tool",
    intro: "Generate SHA-256 hashes from any text or file in your browser. SHA-256 is the industry-standard algorithm for data integrity verification and digital signatures.",
    toolSlug: "hash-generator",
    toolCategory: "developer",
    toolName: "Hash Generator",
    howItWorks: [
      "Open the Hash Generator below",
      "Paste your text or drop a file",
      "Select SHA-256 as the algorithm",
      "Copy the 64-character hex hash",
    ],
    faqs: [
      { q: "What is SHA-256 used for?", a: "SHA-256 is used in TLS certificates, blockchain (Bitcoin), HMAC signatures, password hashing with salt, and file integrity verification." },
      { q: "Is SHA-256 the same as SHA-2?", a: "SHA-256 is part of the SHA-2 family. SHA-2 includes SHA-224, SHA-256, SHA-384, and SHA-512." },
    ],
    related: [
      { slug: "md5-hash", label: "MD5 Hash" },
      { slug: "base64-encode", label: "Base64 Encode" },
    ],
  },
  {
    slug: "text-to-qr",
    title: "Text to QR Code Generator",
    metaTitle: "Text to QR Code Generator — Free, No Watermark",
    metaDescription: "Generate QR codes from any text, URL, or data instantly. Free, no watermark, downloadable PNG. No sign-up required.",
    h1: "Text to QR Code Generator — Free & No Watermark",
    intro: "Turn any text, URL, email, or phone number into a scannable QR code instantly. Download as PNG with no watermark or branding.",
    toolSlug: "qr-generator",
    toolCategory: "productivity",
    toolName: "QR Code Generator",
    howItWorks: [
      "Open the QR Code Generator below",
      "Type or paste your text, URL, or data",
      "The QR code generates in real time",
      "Download the PNG — clean, no watermark",
    ],
    faqs: [
      { q: "What can I encode in a QR code?", a: "URLs, plain text, email addresses, phone numbers, SMS messages, WiFi credentials, vCard contacts, and more." },
      { q: "Is there a size limit?", a: "QR codes can store up to ~3KB of data. URLs and short text work best." },
      { q: "Are QR codes free to use commercially?", a: "Yes — QR codes are an open standard with no licensing fees." },
    ],
    related: [
      { slug: "base64-encode", label: "Base64 Encode" },
      { slug: "url-encode", label: "URL Encode" },
    ],
  },
  {
    slug: "unix-timestamp",
    title: "Unix Timestamp Converter",
    metaTitle: "Unix Timestamp Converter Online — Free, Instant",
    metaDescription: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Free, instant, no upload.",
    h1: "Unix Timestamp Converter — Free Online Tool",
    intro: "Convert Unix epoch timestamps (seconds or milliseconds) to human-readable date/time strings, or convert any date back to a Unix timestamp.",
    toolSlug: "timestamp-converter",
    toolCategory: "productivity",
    toolName: "Timestamp Converter",
    howItWorks: [
      "Open the Timestamp Converter below",
      "Paste a Unix timestamp or pick a date",
      "Choose seconds or milliseconds epoch",
      "Get the converted date/time instantly",
    ],
    faqs: [
      { q: "What is a Unix timestamp?", a: "A Unix timestamp is the number of seconds (or milliseconds) elapsed since January 1, 1970 00:00:00 UTC — used universally in programming." },
      { q: "How do I get the current Unix timestamp?", a: "The tool shows the live current timestamp. In JavaScript: Date.now() / 1000 (seconds) or Date.now() (milliseconds)." },
    ],
    related: [
      { slug: "json-format", label: "JSON Formatter" },
      { slug: "uuid-generator", label: "UUID Generator" },
    ],
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator — Generate UUIDs Online",
    metaTitle: "UUID Generator Online — Free, v4 UUID, Bulk Generate",
    metaDescription: "Generate random v4 UUIDs instantly. Bulk generate, copy to clipboard, free. No sign-up. Browser-based UUID generation.",
    h1: "UUID Generator — Free Online Tool",
    intro: "Generate RFC 4122 compliant v4 UUIDs (universally unique identifiers) instantly. Generate one or thousands at a time — all locally, no server.",
    toolSlug: "uuid-generator",
    toolCategory: "developer",
    toolName: "UUID Generator",
    howItWorks: [
      "Open the UUID Generator below",
      "Click Generate to create a new UUID",
      "Use bulk mode to generate hundreds at once",
      "Copy to clipboard with one click",
    ],
    faqs: [
      { q: "What is a UUID?", a: "A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify objects in software systems. v4 UUIDs are randomly generated." },
      { q: "How unique is a v4 UUID?", a: "The probability of a collision between two randomly generated v4 UUIDs is astronomically small — approximately 1 in 5.3×10³⁶." },
    ],
    related: [
      { slug: "md5-hash", label: "MD5 Hash" },
      { slug: "sha256-hash", label: "SHA-256 Hash" },
      { slug: "password-generator", label: "Password Generator" },
    ],
  },
  {
    slug: "password-generator",
    title: "Strong Password Generator",
    metaTitle: "Password Generator Online — Free, Strong, No Signup",
    metaDescription: "Generate strong, random passwords instantly. Choose length, include symbols, numbers, uppercase. Free, no account, browser-based.",
    h1: "Strong Password Generator — Free Online Tool",
    intro: "Generate cryptographically random passwords with custom length and character sets. Never reuse passwords — generate a new strong one for every account.",
    toolSlug: "password-generator",
    toolCategory: "productivity",
    toolName: "Password Generator",
    howItWorks: [
      "Open the Password Generator below",
      "Set your desired length (8–128 characters)",
      "Toggle uppercase, numbers, and symbols",
      "Click Generate and copy your new password",
    ],
    faqs: [
      { q: "How strong should a password be?", a: "At least 16 characters with a mix of uppercase, lowercase, numbers, and symbols. Each account should have a unique password." },
      { q: "Are generated passwords stored anywhere?", a: "No — passwords are generated using the browser's crypto.getRandomValues() and never transmitted anywhere." },
      { q: "Can I use this with a password manager?", a: "Yes — generate a strong password here, then save it in your password manager (1Password, Bitwarden, etc.)." },
    ],
    related: [
      { slug: "uuid-generator", label: "UUID Generator" },
      { slug: "md5-hash", label: "MD5 Hash" },
    ],
  },
  {
    slug: "hex-to-rgb",
    title: "HEX to RGB Converter",
    metaTitle: "HEX to RGB Color Converter — Free Online Tool",
    metaDescription: "Convert HEX color codes to RGB values instantly. Also supports HSL output. Free, browser-based color conversion tool.",
    h1: "HEX to RGB Color Converter — Free Online Tool",
    intro: "Convert any HEX color code (#RRGGBB or #RGB) to its RGB and HSL equivalents instantly. Essential for CSS, design work, and color system management.",
    toolSlug: "color-picker",
    toolCategory: "productivity",
    toolName: "Color Converter",
    howItWorks: [
      "Open the Color Converter below",
      "Enter your HEX color code (e.g. #1a2b3c)",
      "See RGB and HSL values instantly",
      "Copy any format to clipboard",
    ],
    faqs: [
      { q: "What is the HEX color format?", a: "HEX colors are 6-digit hexadecimal codes (#RRGGBB) where each pair represents red, green, and blue channel values from 00 to FF." },
      { q: "What is RGB?", a: "RGB expresses colors as three integers (0–255) representing red, green, and blue intensity — the native format for screens and CSS." },
    ],
    related: [
      { slug: "rgb-to-hex", label: "RGB to HEX" },
      { slug: "jpg-to-png", label: "JPG to PNG" },
    ],
  },
  {
    slug: "rgb-to-hex",
    title: "RGB to HEX Converter",
    metaTitle: "RGB to HEX Color Converter — Free Online Tool",
    metaDescription: "Convert RGB color values to HEX color codes instantly. Also supports HSL. Free, browser-based, no upload required.",
    h1: "RGB to HEX Color Converter — Free Online Tool",
    intro: "Convert RGB color values (0–255) to HEX color codes for use in CSS, HTML, design tools, and color systems.",
    toolSlug: "color-picker",
    toolCategory: "productivity",
    toolName: "Color Converter",
    howItWorks: [
      "Open the Color Converter below",
      "Enter your R, G, B values (0–255 each)",
      "Get the HEX code instantly",
      "Copy to use in your CSS or design tool",
    ],
    faqs: [
      { q: "What's the formula for RGB to HEX?", a: "Each RGB value is converted to a 2-digit hex: R=255 → FF, G=128 → 80, B=0 → 00, giving #FF8000." },
    ],
    related: [
      { slug: "hex-to-rgb", label: "HEX to RGB" },
    ],
  },
  {
    slug: "word-count",
    title: "Word Counter — Count Words, Characters & Reading Time",
    metaTitle: "Word Counter Online — Free, Instant, Characters & Reading Time",
    metaDescription: "Count words, characters, sentences, and estimate reading time instantly. Free online word counter — no upload, works offline.",
    h1: "Word Counter — Free Online Tool",
    intro: "Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time in real time as you type or paste text.",
    toolSlug: "word-counter",
    toolCategory: "text",
    toolName: "Word Counter",
    howItWorks: [
      "Open the Word Counter below",
      "Paste or type your text",
      "See live word count, character count, and reading time",
      "Use for essays, social media captions, SEO content, and more",
    ],
    faqs: [
      { q: "How is reading time calculated?", a: "Based on an average adult reading speed of 200–250 words per minute." },
      { q: "Does it count characters with or without spaces?", a: "Both — the tool shows separate counts for characters with spaces and characters without." },
      { q: "Is there a word limit?", a: "No limit — paste entire documents or books." },
    ],
    related: [
      { slug: "json-format", label: "JSON Formatter" },
      { slug: "markdown-preview", label: "Markdown Preview" },
    ],
  },
  {
    slug: "markdown-preview",
    title: "Markdown Preview — Render Markdown Online",
    metaTitle: "Markdown Preview Online — Free, Live, No Upload",
    metaDescription: "Preview Markdown as rendered HTML in real time. Supports GitHub-flavored Markdown, tables, code blocks, and syntax highlighting. Free, browser-based.",
    h1: "Markdown Preview — Free Online Tool",
    intro: "Write or paste Markdown and see the rendered HTML preview in real time. Supports GitHub-flavored Markdown including tables, strikethrough, and fenced code blocks.",
    toolSlug: "markdown-preview",
    toolCategory: "text",
    toolName: "Markdown Preview",
    howItWorks: [
      "Open the Markdown Preview below",
      "Type or paste your Markdown content",
      "See the live rendered HTML on the right",
      "Export or copy the rendered output",
    ],
    faqs: [
      { q: "What Markdown flavors are supported?", a: "GitHub-flavored Markdown (GFM) — including tables, task lists, strikethrough, and fenced code blocks with syntax highlighting." },
      { q: "Can I use this for README files?", a: "Yes — the renderer matches what GitHub shows for README.md files." },
    ],
    related: [
      { slug: "word-count", label: "Word Counter" },
      { slug: "json-format", label: "JSON Formatter" },
    ],
  },
];

export function getConverter(slug: string): ConverterMeta | undefined {
  return CONVERTERS.find((c) => c.slug === slug);
}

export function getAllConverterSlugs(): string[] {
  return CONVERTERS.map((c) => c.slug);
}

interface ConverterPageProps {
  params: { slug: string };
}

export default function ConverterPage({ params }: ConverterPageProps) {
  const converter = getConverter(params.slug);

  if (!converter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Converter not found</h1>
          <Link href="/" className="text-blue-400 hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const toolHref = `/tools/${converter.toolCategory}/${converter.toolSlug}`;

  useEffect(() => { document.title = converter.metaTitle; }, [converter.metaTitle]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">{converter.h1}</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">{converter.intro}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <span className="flex items-center gap-1.5 text-sm text-green-400"><CheckCircle className="w-4 h-4" /> 100% Free</span>
            <span className="flex items-center gap-1.5 text-sm text-green-400"><Lock className="w-4 h-4" /> No Upload — Runs in Browser</span>
            <span className="flex items-center gap-1.5 text-sm text-green-400"><Zap className="w-4 h-4" /> Instant Results</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 text-center space-y-4">
          <p className="text-zinc-300 text-lg">Ready to convert? Open the free tool below.</p>
          <Link href={toolHref}>
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-lg">
              Open {converter.toolName} <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <p className="text-xs text-zinc-500">No sign-up · No upload · Works offline</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">How to Use</h2>
          <ol className="space-y-3">
            {converter.howItWorks.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <p className="text-zinc-300 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {converter.faqs.map((faq, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {converter.related.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Related Converters</h2>
            <div className="flex flex-wrap gap-3">
              {converter.related.map((rel) => (
                <Link key={rel.slug} href={`/convert/${rel.slug}`}>
                  <span className="inline-block bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg border border-zinc-700 transition-colors cursor-pointer">
                    {rel.label} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
  );
}
