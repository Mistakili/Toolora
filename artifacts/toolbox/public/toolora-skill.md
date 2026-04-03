# Toolora MCP Tools

> 15 real server-side tools for file processing, PDF generation, OCR, markdown conversion, and content utilities. Free, no API key required, nothing stored.
>
> **Server:** https://toolora.dev/api/mcp
> **Docs:** https://toolora.dev/mcp
> **Registry:** io.github.Mistakili/toolora-mcp (Anthropic MCP Registry)

---

## Setup

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "toolora": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://toolora.dev/api/mcp"]
    }
  }
}
```

### Cursor / Windsurf (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "toolora": {
      "url": "https://toolora.dev/api/mcp",
      "type": "sse"
    }
  }
}
```

### Claude Code (this file)

Place this file at `.claude/skills/toolora.md` in your project root. Claude Code will automatically load it and know how to use all 15 tools.

---

## Available Tools (15)

### PDF

- **`extract_pdf_text`** — Extract all plain text from a PDF. Pass base64-encoded file content. Returns text, page count, word count, character count.
- **`merge_pdfs`** — Merge 2–20 PDF files into one. Each file as base64. Returns merged PDF as base64.
- **`generate_pdf_from_text`** — Render plain text or markdown into a formatted PDF. Detects headings and bullets. Returns base64 PDF.

### OCR & Images

- **`ocr_image`** — Extract text from images (PNG, JPEG, TIFF, BMP, WebP) using Tesseract OCR. Supports 50+ languages. Returns structured text with confidence score.

### QR Codes

- **`generate_qr_code`** — Generate a QR code PNG from any URL or text. Configurable size and error correction. Returns base64 PNG.

### File Conversion

- **`csv_to_json`** — Convert a CSV string to a JSON array of objects. Handles quoted fields, headers inferred from first row.
- **`json_to_csv`** — Convert a JSON array of objects to a CSV string. Column names inferred from object keys.
- **`excel_to_json`** — Parse Excel (.xlsx, .xls) or CSV files. Returns all sheets as structured JSON arrays.
- **`extract_docx_text`** — Extract plain text from a Word .docx file (base64). Returns text, paragraph count, word count.

### Audio

- **`transcribe_audio`** — Transcribe speech from audio files using OpenAI Whisper. Accepts base64 MP3/WAV/M4A/OGG (max 25 MB). Returns transcript text.

### Web Content

- **`scrape_url_js`** — Fetch content from JavaScript-rendered pages (SPAs, React apps). Returns clean text or markdown.
- **`read_url`** — Fetch any public URL and return the main readable content as plain text. Returns title, byline, excerpt, and body.

### Text & Markdown

- **`count_words`** — Count words, characters, sentences, paragraphs, and estimated reading time for any text.
- **`markdown_to_html`** — Convert markdown to a complete styled HTML document. Supports all common markdown syntax.

### Utilities

- **`create_shareable_paste`** — Store any text content and receive a public URL (`toolora.dev/p/[id]`) that anyone can visit. Expires in 7 days.

---

## Usage Examples

### Extract text from a PDF (Python)

```python
import base64, requests

with open("report.pdf", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

res = requests.post("https://toolora.dev/api/mcp", json={
    "jsonrpc": "2.0", "id": 1,
    "method": "tools/call",
    "params": {"name": "extract_pdf_text", "arguments": {"file_base64": b64}}
})
print(res.json()["result"]["content"][0]["text"])
```

### Generate a QR code (Node.js)

```javascript
const res = await fetch("https://toolora.dev/api/mcp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0", id: 1,
    method: "tools/call",
    params: { name: "generate_qr_code", arguments: { text: "https://toolora.dev", size: 300 } }
  })
});
const { result } = await res.json();
// result.content[0].text contains the base64 PNG
```

### Share a paste

```javascript
const res = await fetch("https://toolora.dev/api/mcp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0", id: 1,
    method: "tools/call",
    params: { name: "create_shareable_paste", arguments: { content: "Hello from Claude!", title: "My paste" } }
  })
});
// Returns: { url: "https://toolora.dev/p/abc123", id: "abc123", expiresAt: "..." }
```

---

## Protocol

Toolora's MCP server speaks JSON-RPC 2.0 over HTTP (Streamable HTTP transport, MCP spec 2025-03-26).

All files are processed in memory. No file contents are logged or stored. Server uptime and stats at https://toolora.dev/api/agent/stats.

---

## Links

- MCP page: https://toolora.dev/mcp
- 28 free browser tools (no install): https://toolora.dev
- Anthropic MCP Registry: https://registry.anthropic.com/mcp/io.github.Mistakili/toolora-mcp
- Smithery: https://smithery.ai/servers/mistakili/toolora-mcp
- Support: support@toolora.dev
