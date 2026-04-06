# n8n-nodes-toolora

Official n8n community node for [Toolora](https://toolora.dev) — privacy-first document processing, OCR, data conversion, and web content extraction.

## Features

10 API operations across 6 resource types:

| Resource | Operations |
|----------|-----------|
| **PDF** | Extract Text, Extract Structure (for RAG) |
| **Image / OCR** | Extract text from images using Tesseract |
| **Document** | Extract DOCX text, Excel/CSV to JSON |
| **Web** | Read URL (Readability), Scrape URL (headless browser) |
| **Data** | CSV → JSON, JSON → CSV |
| **Utility** | Generate QR Code (PNG output) |

## Installation

### In n8n (recommended)

1. Go to **Settings → Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-toolora` and confirm

### Manual (self-hosted n8n)

```bash
npm install n8n-nodes-toolora
# or
pnpm add n8n-nodes-toolora
```

## Setup

1. Get a free API key at [toolora.dev/api-keys](https://toolora.dev/api-keys)
2. In n8n, go to **Credentials → New → Toolora API**
3. Paste your key (`sk_toolora_...`)
4. Add a **Toolora** node to any workflow

## API Reference

Full documentation at [toolora.dev/api-docs](https://toolora.dev/api-docs)

Base URL: `https://toolora.dev/api/agent`

All endpoints accept `Authorization: Bearer sk_toolora_your_key` header.

## Privacy

Toolora's browser tools process files entirely client-side (no uploads). The server-side API used by this n8n node receives files only for the duration of the request — no retention, no logging of file content.

## License

MIT
