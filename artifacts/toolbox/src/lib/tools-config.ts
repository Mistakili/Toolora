import { 
  FileText, Type, Hash, Shield, KeyRound, QrCode, ArrowLeftRight, 
  Palette, Image as ImageIcon, FileJson, Clock, Link as LinkIcon, 
  Scissors, Minimize, SplitSquareHorizontal, Layers, Fingerprint, RefreshCcw,
  BookOpen
} from "lucide-react";

export type ToolCategory = "pdf" | "image" | "text" | "developer" | "productivity";

export interface ToolDef {
  id: string;
  name: string;
  slug: string;
  description: string;
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
  { id: "word-counter", name: "Word Counter", slug: "word-counter", description: "Count words, characters, sentences, and paragraphs in real-time.", icon: Type, category: "text", isPopular: true },
  { id: "case-converter", name: "Case Converter", slug: "case-converter", description: "Convert text between UPPERCASE, lowercase, camelCase, and more.", icon: ArrowLeftRight, category: "text" },
  { id: "lorem-ipsum", name: "Lorem Ipsum Generator", slug: "lorem-ipsum", description: "Generate placeholder text for your designs.", icon: FileText, category: "text" },
  { id: "markdown-preview", name: "Markdown Preview", slug: "markdown-preview", description: "Write markdown and see a live rendered preview side-by-side.", icon: BookOpen, category: "text" },
  { id: "text-diff", name: "Text Diff", slug: "text-diff", description: "Compare two texts and highlight all the differences.", icon: SplitSquareHorizontal, category: "text" },
  
  // Developer Tools
  { id: "json-formatter", name: "JSON Formatter", slug: "json-formatter", description: "Format, validate, and minify JSON data.", icon: FileJson, category: "developer", isPopular: true },
  { id: "base64", name: "Base64 Encoder/Decoder", slug: "base64", description: "Encode text to Base64 or decode it back.", icon: Hash, category: "developer" },
  { id: "url-encoder", name: "URL Encoder/Decoder", slug: "url-encoder", description: "Safely encode or decode URL parameters.", icon: LinkIcon, category: "developer" },
  { id: "hash-generator", name: "Hash Generator", slug: "hash-generator", description: "Generate MD5, SHA-1, SHA-256 hashes.", icon: Fingerprint, category: "developer" },
  { id: "uuid-generator", name: "UUID Generator", slug: "uuid-generator", description: "Generate random UUIDs (v4) in bulk.", icon: KeyRound, category: "developer" },
  
  // Productivity Tools
  { id: "qr-generator", name: "QR Code Generator", slug: "qr-generator", description: "Create customized QR codes from URLs or text.", icon: QrCode, category: "productivity", isPopular: true },
  { id: "password-generator", name: "Password Generator", slug: "password-generator", description: "Create highly secure, random passwords.", icon: Shield, category: "productivity", isPopular: true },
  { id: "unit-converter", name: "Unit Converter", slug: "unit-converter", description: "Convert between various units of measurement.", icon: RefreshCcw, category: "productivity" },
  { id: "color-picker", name: "Color Converter", slug: "color-picker", description: "Convert between HEX, RGB, and HSL color formats.", icon: Palette, category: "productivity" },
  { id: "timestamp-converter", name: "Timestamp Converter", slug: "timestamp-converter", description: "Convert Unix timestamps to human-readable dates.", icon: Clock, category: "productivity" },

  // Image Tools (Canvas based)
  { id: "image-resize", name: "Image Resizer", slug: "image-resize", description: "Change the dimensions of any image instantly.", icon: ImageIcon, category: "image", isPopular: true },
  { id: "image-compress", name: "Image Compressor", slug: "image-compress", description: "Reduce image file size while maintaining quality.", icon: Minimize, category: "image" },
  { id: "image-convert", name: "Image Converter", slug: "image-convert", description: "Convert images between PNG, JPG, WebP, etc.", icon: RefreshCcw, category: "image" },

  // PDF Tools (pdf-lib based)
  { id: "pdf-merge", name: "Merge PDF", slug: "pdf-merge", description: "Combine multiple PDF files into a single document.", icon: Layers, category: "pdf", isPopular: true },
  { id: "pdf-split", name: "Split PDF", slug: "pdf-split", description: "Extract pages from a PDF or split it into multiple files.", icon: SplitSquareHorizontal, category: "pdf" },
];

export const getToolBySlug = (slug: string) => TOOLS.find(t => t.slug === slug);
export const getToolsByCategory = (category: string) => TOOLS.filter(t => t.category === category);
export const getCategoryById = (id: string) => CATEGORIES.find(c => c.id === id);
