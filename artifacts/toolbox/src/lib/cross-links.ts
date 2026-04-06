export const TOOL_TO_COMPARISONS: Record<string, string[]> = {
  "pdf-merge": [
    "toolora-vs-smallpdf",
    "toolora-vs-ilovepdf",
    "toolora-vs-cloudconvert",
    "best-smallpdf-alternative",
    "best-ilovepdf-alternative",
    "best-pdf-tools-without-uploading",
    "hipaa-compliant-pdf-tools-free",
    "free-online-tools-for-lawyers",
    "free-online-tools-for-healthcare",
    "gdpr-compliant-online-tools",
  ],
  "pdf-split": [
    "toolora-vs-smallpdf",
    "toolora-vs-ilovepdf",
    "toolora-vs-cloudconvert",
    "best-smallpdf-alternative",
    "best-ilovepdf-alternative",
    "best-pdf-tools-without-uploading",
    "hipaa-compliant-pdf-tools-free",
    "free-online-tools-for-lawyers",
    "free-online-tools-for-healthcare",
  ],
  "json-formatter": [
    "toolora-vs-jsonformatter-org",
    "toolora-vs-codebeautify",
    "best-json-formatter-privacy",
    "gdpr-compliant-online-tools",
  ],
  "jwt-decoder": [
    "toolora-vs-jwt-io",
    "best-jwt-decoder-online",
  ],
  "regex-tester": [
    "toolora-vs-regex101",
  ],
  "base64": [
    "best-base64-decoder-online",
    "toolora-vs-codebeautify",
  ],
  "image-convert": [
    "toolora-vs-convertio",
    "toolora-vs-cloudconvert",
  ],
  "image-resize": [
    "toolora-vs-convertio",
    "toolora-vs-cloudconvert",
  ],
  "image-compress": [
    "toolora-vs-convertio",
    "toolora-vs-cloudconvert",
  ],
};

export const TOOL_TO_GLOSSARY: Record<string, string[]> = {
  "json-formatter":        ["json", "yaml", "rest-api", "openapi", "xml"],
  "jwt-decoder":           ["jwt", "bearer-token", "oauth", "oauth2", "base64"],
  "base64":                ["base64", "utf-8", "mime-type", "character-encoding"],
  "url-encoder":           ["url-encoding", "uri-vs-url", "utf-8"],
  "hash-generator":        ["sha-256", "md5", "hmac", "hash"],
  "password-generator":    ["password-hashing", "bcrypt", "argon2"],
  "uuid-generator":        ["uuid"],
  "regex-tester":          ["regex"],
  "markdown-preview":      ["markdown"],
  "yaml-json-converter":   ["yaml", "json", "toml"],
  "cron-parser":           ["cron-expression"],
  "timestamp-converter":   ["unix-timestamp", "iso-8601", "utc-timezone", "datetime-format"],
  "number-base-converter": ["hex-encoding", "binary-number", "ascii"],
  "html-entities":         ["html-entities", "unicode", "utf-8"],
  "token-counter":         ["token", "llm"],
  "svg-optimizer":         ["svg", "raster-vs-vector"],
  "css-gradient-generator":["css-variables", "css-animation"],
  "color-picker":          ["hex-color", "hsl-color", "color-space", "rgb-color-model"],
  "image-resize":          ["aspect-ratio", "dpi-resolution", "exif-metadata"],
  "image-compress":        ["lossy-compression", "lossless-compression", "webp", "jpeg"],
  "image-convert":         ["webp", "png", "jpeg", "svg", "gif"],
  "pdf-merge":             ["pdf", "gdpr", "pii"],
  "pdf-split":             ["pdf", "gdpr", "pii"],
  "word-counter":          ["flesch-kincaid-readability"],
  "readability-score":     ["flesch-kincaid-readability"],
  "og-preview":            ["structured-data", "seo"],
  "html-minifier":         ["core-web-vitals"],
  "string-escape":         ["utf-8", "unicode"],
};

export const COMPARISON_TO_HOWTO: Record<string, string[]> = {
  "toolora-vs-smallpdf":           ["pdf-merge", "pdf-split"],
  "toolora-vs-ilovepdf":           ["pdf-merge", "pdf-split"],
  "toolora-vs-convertio":          ["image-convert", "image-resize", "image-compress"],
  "toolora-vs-cloudconvert":       ["image-convert", "pdf-merge"],
  "toolora-vs-jwt-io":             ["jwt-decoder"],
  "toolora-vs-regex101":           ["regex-tester"],
  "toolora-vs-jsonformatter-org":  ["json-formatter"],
  "toolora-vs-codebeautify":       ["json-formatter", "html-entities", "base64"],
  "best-smallpdf-alternative":     ["pdf-merge", "pdf-split"],
  "best-ilovepdf-alternative":     ["pdf-merge", "pdf-split"],
  "best-pdf-tools-without-uploading": ["pdf-merge", "pdf-split"],
  "best-json-formatter-privacy":   ["json-formatter"],
  "best-jwt-decoder-online":       ["jwt-decoder"],
  "best-base64-decoder-online":    ["base64"],
  "free-online-tools-for-lawyers": ["pdf-merge", "pdf-split"],
  "free-online-tools-for-healthcare": ["pdf-merge", "pdf-split"],
  "hipaa-compliant-pdf-tools-free": ["pdf-merge", "pdf-split"],
  "gdpr-compliant-online-tools":   ["pdf-merge", "json-formatter"],
};

export function getToolComparisons(toolSlug: string): string[] {
  return TOOL_TO_COMPARISONS[toolSlug] ?? [];
}

export function getToolGlossary(toolSlug: string): string[] {
  return TOOL_TO_GLOSSARY[toolSlug] ?? [];
}

export function getComparisonHowTos(comparisonSlug: string): string[] {
  return COMPARISON_TO_HOWTO[comparisonSlug] ?? [];
}
