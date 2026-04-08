export interface PrivateTool {
  slug: string;
  name: string;
  description: string;
  category: "text" | "developer" | "ai" | "productivity";
  icon: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
}

export const PRIVATE_TOOLS: PrivateTool[] = [
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, and sentences privately",
    category: "text",
    icon: "📝",
    inputLabel: "Your text",
    inputPlaceholder: "Paste confidential text here...",
    outputLabel: "Analysis",
  },
  {
    slug: "text-case",
    name: "Text Case Converter",
    description: "Convert text case without uploading to servers",
    category: "text",
    icon: "🔤",
    inputLabel: "Your text",
    inputPlaceholder: "Text to convert...",
    outputLabel: "Converted text",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON privately",
    category: "developer",
    icon: "{}",
    inputLabel: "JSON input",
    inputPlaceholder: '{"key": "value"}',
    outputLabel: "Formatted JSON",
  },
  {
    slug: "base64",
    name: "Base64 Encoder",
    description: "Encode/decode Base64 without server exposure",
    category: "developer",
    icon: "🔐",
    inputLabel: "Text to encode",
    inputPlaceholder: "Enter text to encode...",
    outputLabel: "Base64 output",
  },
  {
    slug: "html-to-markdown",
    name: "HTML → Markdown",
    description: "Convert HTML to Markdown privately for AI pipelines",
    category: "ai",
    icon: "⚙️",
    inputLabel: "HTML input",
    inputPlaceholder: "<p>Your HTML content...</p>",
    outputLabel: "Markdown output",
  },
  {
    slug: "text-chunker",
    name: "Text Chunker",
    description: "Split text into RAG-ready chunks privately",
    category: "ai",
    icon: "✂️",
    inputLabel: "Text to chunk",
    inputPlaceholder: "Long document to split into chunks...",
    outputLabel: "Chunks",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    description: "Encode URLs without exposing parameters",
    category: "developer",
    icon: "🔗",
    inputLabel: "URL to encode",
    inputPlaceholder: "https://example.com/path?q=hello world",
    outputLabel: "Encoded URL",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5/SHA hashes client-side",
    category: "developer",
    icon: "#️⃣",
    inputLabel: "Text to hash",
    inputPlaceholder: "Text to hash...",
    outputLabel: "Hash output",
  },
];

export function getToolBySlug(slug: string): PrivateTool | undefined {
  return PRIVATE_TOOLS.find((t) => t.slug === slug);
}

export function groupToolsByCategory(tools: PrivateTool[]): Record<string, PrivateTool[]> {
  const groups: Record<string, PrivateTool[]> = {};
  for (const tool of tools) {
    if (!groups[tool.category]) groups[tool.category] = [];
    groups[tool.category].push(tool);
  }
  return groups;
}

export const CATEGORY_LABELS: Record<string, string> = {
  text: "Text Tools",
  developer: "Developer Tools",
  ai: "AI & RAG",
  productivity: "Productivity",
};
