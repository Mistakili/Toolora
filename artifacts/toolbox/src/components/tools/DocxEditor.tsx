import { useRef, useState, useCallback, useEffect } from "react";
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link2, Image as ImageIcon,
  Download, Upload, FileText, Trash2, Heading1, Heading2, Heading3,
  Printer, Save, Search, Indent, Outdent, Undo, Redo,
} from "lucide-react";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  LevelFormat, convertInchesToTwip, ImageRun,
} from "docx";

const LS_CONTENT = "toolora_docx_html";
const LS_NAME = "toolora_docx_name";
const FONT_SIZES = ["8","9","10","11","12","14","16","18","20","24","28","32","36","48","72"];

function countStats(html: string) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;
  return { words, chars };
}

function getInlineStyles(el: Element) {
  const style = (el as HTMLElement).style;
  const bold = style.fontWeight === "bold" || parseInt(style.fontWeight) >= 600;
  const italics = style.fontStyle === "italic";
  const underline = (style.textDecoration || "").includes("underline");
  const strike = (style.textDecoration || "").includes("line-through");
  const color = style.color || undefined;
  const size = style.fontSize
    ? Math.round(parseFloat(style.fontSize) * (style.fontSize.endsWith("pt") ? 2 : style.fontSize.endsWith("px") ? 1.5 : 2))
    : undefined;
  return { bold, italics, underline, strike, color, size };
}

async function imgSrcToUint8(src: string): Promise<{ data: Uint8Array; type: string } | null> {
  try {
    if (src.startsWith("data:image/")) {
      const match = src.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!match) return null;
      const type = match[1] === "jpeg" ? "jpg" : match[1];
      const bin = atob(match[2]);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return { data: arr, type };
    }
    const res = await fetch(src);
    const ct = res.headers.get("content-type") ?? "image/png";
    const type = ct.includes("jpeg") || ct.includes("jpg") ? "jpg"
      : ct.includes("gif") ? "gif" : "png";
    return { data: new Uint8Array(await res.arrayBuffer()), type };
  } catch { return null; }
}

async function nodeToRuns(
  node: Node,
  bold = false, italics = false, underline = false, strike = false, color?: string, size?: number
): Promise<(TextRun | ImageRun)[]> {
  const runs: (TextRun | ImageRun)[] = [];
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    if (text) runs.push(new TextRun({
      text, bold, italics,
      underline: underline ? {} : undefined,
      strike,
      color: color ? color.replace("#", "") : undefined,
      size,
    }));
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (tag === "br") { runs.push(new TextRun({ text: "", break: 1 })); return runs; }

    if (tag === "img") {
      const src = el.getAttribute("src") ?? (el as HTMLImageElement).src;
      const imgData = src ? await imgSrcToUint8(src) : null;
      if (imgData) {
        const imgEl = el as HTMLImageElement;
        const w = imgEl.naturalWidth || imgEl.width || 400;
        const h = imgEl.naturalHeight || imgEl.height || 300;
        const maxW = 500;
        const scale = w > maxW ? maxW / w : 1;
        try {
          runs.push(new ImageRun({
            type: imgData.type as any,
            data: imgData.data,
            transformation: { width: Math.round(w * scale), height: Math.round(h * scale) },
          }));
        } catch { /* skip broken images */ }
      }
      return runs;
    }

    const inl = getInlineStyles(el);
    const b = bold || inl.bold || tag === "b" || tag === "strong";
    const i = italics || inl.italics || tag === "i" || tag === "em";
    const u = underline || inl.underline || tag === "u";
    const s = strike || inl.strike || tag === "s" || tag === "strike" || tag === "del";
    const c = inl.color || color;
    const sz = inl.size || size;

    for (const child of Array.from(node.childNodes)) {
      runs.push(...await nodeToRuns(child, b, i, u, s, c, sz));
    }
  }
  return runs;
}

function getBlockAlign(el: Element): AlignmentType {
  const style = (el as HTMLElement).style?.textAlign ?? "";
  const attr = el.getAttribute("align") ?? "";
  const val = style || attr;
  if (val === "center") return AlignmentType.CENTER;
  if (val === "right") return AlignmentType.RIGHT;
  if (val === "justify") return AlignmentType.JUSTIFIED;
  return AlignmentType.LEFT;
}

async function htmlToDocxChildren(html: string): Promise<Paragraph[]> {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const paras: Paragraph[] = [];

  async function processEl(el: Element) {
    const tag = el.tagName?.toLowerCase();
    if (!tag) return;
    const align = getBlockAlign(el);

    if (["h1","h2","h3","h4","h5","h6"].includes(tag)) {
      const level = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3,
        HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6][parseInt(tag[1]) - 1];
      paras.push(new Paragraph({ heading: level, children: await nodeToRuns(el), alignment: align }));

    } else if (tag === "ul") {
      for (const li of Array.from(el.querySelectorAll(":scope > li"))) {
        paras.push(new Paragraph({ bullet: { level: 0 }, children: await nodeToRuns(li) }));
      }
    } else if (tag === "ol") {
      for (const li of Array.from(el.querySelectorAll(":scope > li"))) {
        paras.push(new Paragraph({ numbering: { reference: "num1", level: 0 }, children: await nodeToRuns(li) }));
      }
    } else if (tag === "table") {
      for (const row of Array.from(el.querySelectorAll("tr"))) {
        const cells = Array.from(row.querySelectorAll("td, th"));
        const text = cells.map(c => c.textContent?.trim()).join(" | ");
        if (text) paras.push(new Paragraph({ children: [new TextRun(text)] }));
      }
    } else if (tag === "img") {
      const src = el.getAttribute("src") ?? (el as HTMLImageElement).src;
      const imgData = src ? await imgSrcToUint8(src) : null;
      if (imgData) {
        const imgEl = el as HTMLImageElement;
        const w = imgEl.naturalWidth || imgEl.width || 400;
        const h = imgEl.naturalHeight || imgEl.height || 300;
        const maxW = 500;
        const scale = w > maxW ? maxW / w : 1;
        try {
          paras.push(new Paragraph({
            children: [new ImageRun({
              type: imgData.type as any,
              data: imgData.data,
              transformation: { width: Math.round(w * scale), height: Math.round(h * scale) },
            })],
          }));
        } catch { /* skip broken images */ }
      }
    } else {
      const runs = await nodeToRuns(el);
      if (runs.length) paras.push(new Paragraph({ children: runs, alignment: align }));
    }
  }

  for (const child of Array.from(doc.body.children)) await processEl(child as Element);
  if (!paras.length) paras.push(new Paragraph({ children: [new TextRun("")] }));
  return paras;
}

async function exportAsDocx(html: string, fileName: string) {
  const children = await htmlToDocxChildren(html);
  const doc = new Document({
    numbering: {
      config: [{
        reference: "num1",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } },
        }],
      }],
    },
    sections: [{ properties: {}, children }],
  });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".docx") ? fileName : `${fileName}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Brochure templates ───────────────────────────────────────────────────────

function parseSections(html: string) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const title = doc.querySelector("h1")?.textContent?.trim() ?? "Document";
  const sections: Array<{ heading: string; body: string }> = [];
  let intro = "";
  let curHeading = "";
  let curBody = "";
  let inSection = false;

  for (const el of Array.from(doc.body.children)) {
    const tag = el.tagName.toLowerCase();
    if (tag === "h1") continue;
    if (tag === "h2") {
      if (inSection) sections.push({ heading: curHeading, body: curBody });
      else if (curBody) intro = curBody;
      curHeading = el.innerHTML;
      curBody = "";
      inSection = true;
    } else {
      curBody += el.outerHTML;
    }
  }
  if (inSection) sections.push({ heading: curHeading, body: curBody });
  else if (curBody) intro = curBody;
  return { title, intro, sections };
}

const BROCHURE_TEMPLATES = {
  executive: {
    label: "Executive",
    desc: "Professional — dark header, clean single column",
    accent: "#0f172a",
    build(html: string, docTitle: string): string {
      const { title, intro, sections } = parseSections(html);
      const displayTitle = title || docTitle;
      const sectionsHtml = sections.map(s => `
        <div class="section">
          <h2>${s.heading}</h2>
          <div class="section-body">${s.body}</div>
        </div>`).join("");
      return `<!DOCTYPE html><html><head><title>${displayTitle}</title>
<style>
  @page { size: A4; margin: 0; }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,-apple-system,Arial,sans-serif;background:#fff;color:#1e293b;font-size:11pt;line-height:1.65}
  .cover{background:#0f172a;color:#fff;padding:52pt 56pt 44pt}
  .cover-title{font-size:30pt;font-weight:800;line-height:1.15;letter-spacing:-0.5pt;margin-bottom:12pt}
  .cover-rule{width:48pt;height:3pt;background:#6366f1;margin-bottom:16pt}
  .cover-intro{font-size:11.5pt;opacity:.75;line-height:1.6;max-width:420pt}
  .body{padding:40pt 56pt}
  .section{margin-bottom:28pt}
  h2{font-size:13pt;font-weight:700;color:#0f172a;border-left:3pt solid #6366f1;padding-left:12pt;margin-bottom:12pt;line-height:1.3}
  h3{font-size:11.5pt;font-weight:600;color:#4f46e5;margin:14pt 0 5pt}
  p{margin:0 0 9pt;color:#334155}
  ul,ol{padding-left:18pt;margin:6pt 0 10pt}
  li{margin:3pt 0;color:#334155}
  img{max-width:100%;height:auto;margin:10pt 0;border-radius:4pt}
  .footer{position:fixed;bottom:24pt;left:56pt;right:56pt;border-top:1pt solid #e2e8f0;padding-top:7pt;display:flex;justify-content:space-between;font-size:8.5pt;color:#94a3b8}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="cover">
  <div class="cover-title">${displayTitle}</div>
  <div class="cover-rule"></div>
  ${intro ? `<div class="cover-intro">${intro}</div>` : ""}
</div>
<div class="body">${sectionsHtml || (intro ? "" : html)}</div>
<div class="footer"><span>${displayTitle}</span><span>toolora.dev</span></div>
</body></html>`;
    },
  },

  modern: {
    label: "Modern",
    desc: "Two-column — gradient header, bold sections",
    accent: "#7c3aed",
    build(html: string, docTitle: string): string {
      const { title, intro, sections } = parseSections(html);
      const displayTitle = title || docTitle;
      const half = Math.ceil(sections.length / 2);
      const col1 = sections.slice(0, half);
      const col2 = sections.slice(half);
      const renderCol = (secs: typeof sections) => secs.map(s => `
        <div class="card">
          <div class="card-head">${s.heading}</div>
          <div class="card-body">${s.body}</div>
        </div>`).join("");
      const bodyHtml = sections.length >= 2
        ? `<div class="cols"><div class="col">${renderCol(col1)}</div><div class="col">${renderCol(col2)}</div></div>`
        : `<div class="single">${sections.map(s => `<div class="card"><div class="card-head">${s.heading}</div><div class="card-body">${s.body}</div></div>`).join("") || html}</div>`;
      return `<!DOCTYPE html><html><head><title>${displayTitle}</title>
<style>
  @page{size:A4;margin:0}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,-apple-system,Arial,sans-serif;background:#fff;color:#1f2937;font-size:10.5pt;line-height:1.65}
  .header{background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);color:#fff;padding:44pt 48pt 36pt;position:relative;overflow:hidden}
  .header::after{content:'';position:absolute;right:-40pt;top:-40pt;width:200pt;height:200pt;background:rgba(255,255,255,.06);border-radius:50%}
  .header-title{font-size:28pt;font-weight:800;line-height:1.15;margin-bottom:10pt;position:relative}
  .header-sub{font-size:11pt;opacity:.8;max-width:380pt;position:relative}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:32pt 32pt}
  .single{padding:32pt 48pt}
  .col{padding:0 16pt}
  .col:first-child{border-right:1pt solid #e5e7eb}
  .card{margin-bottom:22pt}
  .card-head{background:#ede9fe;color:#5b21b6;font-size:11.5pt;font-weight:700;padding:6pt 10pt;border-radius:4pt;margin-bottom:9pt}
  .card-body p{margin:0 0 7pt;color:#374151}
  .card-body ul,.card-body ol{padding-left:15pt;margin:5pt 0 7pt}
  .card-body li{margin:2pt 0;color:#374151}
  .card-body img{max-width:100%;height:auto;margin:6pt 0;border-radius:3pt}
  h3{font-size:11pt;font-weight:600;color:#7c3aed;margin:10pt 0 4pt}
  .intro{padding:24pt 48pt 0;font-size:11pt;color:#6b7280;border-bottom:1pt solid #f3f4f6;padding-bottom:20pt}
  .footer{text-align:center;font-size:8.5pt;color:#9ca3af;padding:12pt;border-top:1pt solid #f3f4f6}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="header">
  <div class="header-title">${displayTitle}</div>
  ${intro ? `<div class="header-sub">${intro.replace(/<[^>]*>/g, " ").trim().slice(0, 160)}</div>` : ""}
</div>
${bodyHtml}
<div class="footer">toolora.dev</div>
</body></html>`;
    },
  },

  flyer: {
    label: "Bold Flyer",
    desc: "High-impact — full color, cards for each section",
    accent: "#059669",
    build(html: string, docTitle: string): string {
      const { title, intro, sections } = parseSections(html);
      const displayTitle = title || docTitle;
      const cards = sections.map(s => `
        <div class="card">
          <div class="card-title">${s.heading}</div>
          <div class="card-text">${s.body}</div>
        </div>`).join("");
      return `<!DOCTYPE html><html><head><title>${displayTitle}</title>
<style>
  @page{size:A4;margin:0}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,-apple-system,Arial,sans-serif;background:#f0fdf4;color:#14532d;font-size:11pt}
  .hero{background:#065f46;color:#fff;text-align:center;padding:52pt 48pt 40pt}
  .hero-tag{display:inline-block;background:#10b981;color:#fff;font-size:8.5pt;font-weight:700;letter-spacing:1.5pt;text-transform:uppercase;padding:4pt 10pt;border-radius:20pt;margin-bottom:18pt}
  .hero-title{font-size:32pt;font-weight:900;line-height:1.1;margin-bottom:14pt;letter-spacing:-0.5pt}
  .hero-intro{font-size:12pt;opacity:.8;line-height:1.6;max-width:380pt;margin:0 auto}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200pt,1fr));gap:16pt;padding:32pt 40pt}
  .card{background:#fff;border-radius:8pt;padding:20pt;box-shadow:0 1pt 4pt rgba(0,0,0,.08);border-top:3pt solid #10b981}
  .card-title{font-size:12.5pt;font-weight:700;color:#065f46;margin-bottom:10pt;line-height:1.3}
  .card-text p{font-size:10.5pt;color:#374151;margin:0 0 7pt;line-height:1.6}
  .card-text ul,.card-text ol{padding-left:14pt;margin:5pt 0 7pt}
  .card-text li{font-size:10.5pt;color:#374151;margin:2pt 0;line-height:1.55}
  .card-text img{max-width:100%;height:auto;margin:6pt 0;border-radius:4pt}
  h3{font-size:11pt;font-weight:600;color:#059669;margin:9pt 0 4pt}
  .footer{text-align:center;padding:16pt;font-size:8.5pt;color:#6b7280;background:#fff;border-top:1pt solid #d1fae5}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="hero">
  <div class="hero-tag">Toolora</div>
  <div class="hero-title">${displayTitle}</div>
  ${intro ? `<div class="hero-intro">${intro.replace(/<[^>]*>/g, " ").trim().slice(0, 200)}</div>` : ""}
</div>
<div class="grid">${cards || `<div class="card"><div class="card-text">${html}</div></div>`}</div>
<div class="footer">toolora.dev</div>
</body></html>`;
    },
  },
} as const;

type BrochureKey = keyof typeof BROCHURE_TEMPLATES;

function printAsPdf(html: string, title: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Calibri', Arial, sans-serif; font-size: 12pt; line-height: 1.6; color: #000; padding: 1in; }
    h1 { font-size: 24pt; font-weight: bold; margin: 16pt 0 8pt; }
    h2 { font-size: 18pt; font-weight: bold; margin: 14pt 0 6pt; }
    h3 { font-size: 14pt; font-weight: bold; margin: 12pt 0 4pt; }
    p, div { margin: 4pt 0; }
    ul { list-style: disc; padding-left: 24pt; margin: 6pt 0; }
    ol { list-style: decimal; padding-left: 24pt; margin: 6pt 0; }
    li { margin: 2pt 0; }
    img { max-width: 100%; height: auto; }
    a { color: #1d4ed8; }
    table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
    td, th { border: 1px solid #ccc; padding: 4pt 8pt; }
    @media print { body { padding: 0.5in; } }
  </style></head><body>${html}</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 600);
}


const LS_SESSION = "toolora_uid";

function getOrCreateSessionToken(): string {
  let token = localStorage.getItem(LS_SESSION);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(LS_SESSION, token);
  }
  return token;
}

function extractImages(html: string): string[] {
  const div = document.createElement("div");
  div.innerHTML = html;
  const srcs: string[] = [];
  div.querySelectorAll("img").forEach(img => {
    if (img.src.startsWith("data:") && srcs.length < 4) srcs.push(img.src);
  });
  return srcs;
}

function htmlWithoutImages(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.querySelectorAll("img").forEach(img => img.replaceWith(`<span>[image]</span>`));
  return div.innerHTML;
}

export default function DocxEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [fileName, setFileName] = useState(() => localStorage.getItem(LS_NAME) ?? "Untitled Document");
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [showFind, setShowFind] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  const updateStats = useCallback(() => {
    if (editorRef.current) setStats(countStats(editorRef.current.innerHTML));
  }, []);

  const saveToLocal = useCallback(() => {
    if (!editorRef.current) return;
    localStorage.setItem(LS_CONTENT, editorRef.current.innerHTML);
    localStorage.setItem(LS_NAME, fileName);
    setLastSaved(new Date());
  }, [fileName]);

  useEffect(() => {
    const saved = localStorage.getItem(LS_CONTENT);
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
      updateStats();
    }
    editorRef.current?.focus();
  }, [updateStats]);

  useEffect(() => {
    const t = setInterval(saveToLocal, 30000);
    return () => clearInterval(t);
  }, [saveToLocal]);

  useEffect(() => {
    localStorage.setItem(LS_NAME, fileName);
  }, [fileName]);

  const saveRange = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
  }, []);

  const restoreRange = useCallback(() => {
    const r = savedRangeRef.current;
    if (!r) return;
    const sel = window.getSelection();
    if (sel) { sel.removeAllRanges(); sel.addRange(r); }
  }, []);

  const exec = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    updateStats();
  }, [updateStats]);

  const handleFontSize = useCallback((size: string) => {
    editorRef.current?.focus();
    exec("fontSize", "7");
    editorRef.current?.querySelectorAll("font[size='7']").forEach(el => {
      const span = document.createElement("span");
      span.style.fontSize = `${size}pt`;
      span.innerHTML = (el as HTMLElement).innerHTML;
      el.replaceWith(span);
    });
  }, [exec]);

  const handlePaste = useCallback(() => {
    setTimeout(updateStats, 0);
  }, [updateStats]);

  const handleNew = useCallback(() => {
    if (!window.confirm("Start a new document? Unsaved changes will be lost.")) return;
    if (editorRef.current) { editorRef.current.innerHTML = ""; updateStats(); }
    setFileName("Untitled Document");
    setImportError("");
    localStorage.removeItem(LS_CONTENT);
  }, [updateStats]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError("");
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer }, {
        convertImage: mammoth.images.imgElement(async (image: any) => {
          const buf = await image.read("base64");
          const ct = await image.contentType;
          return { src: `data:${ct};base64,${buf}` };
        }),
      });
      if (editorRef.current) { editorRef.current.innerHTML = result.value; updateStats(); }
      setFileName(file.name.replace(/\.docx$/i, ""));
    } catch {
      setImportError("Could not read this file. Make sure it is a valid .docx file.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [updateStats]);

  const handleInsertImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editorRef.current) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      editorRef.current?.focus();
      document.execCommand("insertImage", false, dataUrl);
      updateStats();
    };
    reader.readAsDataURL(file);
    if (imgInputRef.current) imgInputRef.current.value = "";
  }, [updateStats]);

  const handleDownload = useCallback(async () => {
    const html = editorRef.current?.innerHTML ?? "";
    setExporting(true);
    try { await exportAsDocx(html, fileName); }
    catch (e) { console.error(e); alert("Export failed. Try again."); }
    finally { setExporting(false); }
  }, [fileName]);

  const handlePrint = useCallback(() => {
    printAsPdf(editorRef.current?.innerHTML ?? "", fileName);
  }, [fileName]);

  const handleBrochure = useCallback((templateKey: BrochureKey) => {
    const html = editorRef.current?.innerHTML ?? "";
    const tpl = BROCHURE_TEMPLATES[templateKey];
    const doc = tpl.build(html, fileName);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(doc);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 800);
    setShowBrochureModal(false);
  }, [fileName]);

  const handleAiBrochure = useCallback(async () => {
    const html = editorRef.current?.innerHTML ?? "";
    if (!html.trim() || html === "<br>") {
      setAiError("Document is empty — add some content first.");
      return;
    }
    setAiGenerating(true);
    setAiError("");
    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/brochure/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          html: htmlWithoutImages(html),
          images: extractImages(html),
          fileName,
          sessionToken: getOrCreateSessionToken(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "free_used") {
          setAiError("You've already used your free AI brochure. Upgrade to Pro for unlimited generations.");
        } else if (data.error === "pro_required") {
          setAiError("The 2 free AI brochures have been claimed. Upgrade to Pro for unlimited use.");
        } else {
          setAiError(data.error ?? "Generation failed. Please try again.");
        }
        return;
      }
      const win = window.open("", "_blank");
      if (!win) { setAiError("Popup blocked — please allow popups for this site."); return; }
      win.document.write(data.html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 1200);
    } catch {
      setAiError("Network error. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  }, [fileName]);

  const handleInsertLink = useCallback(() => {
    saveRange();
    setShowLinkModal(true);
    setLinkUrl("");
  }, [saveRange]);

  const applyLink = useCallback(() => {
    if (!linkUrl) return;
    restoreRange();
    editorRef.current?.focus();
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    document.execCommand("createLink", false, url);
    setShowLinkModal(false);
  }, [linkUrl, restoreRange]);

  const handleFind = useCallback(() => {
    if (!findText) return;
    const html = editorRef.current?.innerHTML ?? "";
    const idx = html.toLowerCase().indexOf(findText.toLowerCase());
    if (idx === -1) { alert(`"${findText}" not found.`); return; }
    window.getSelection()?.removeAllRanges();
  }, [findText]);

  const handleReplaceAll = useCallback(() => {
    if (!editorRef.current || !findText) return;
    const re = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    editorRef.current.innerHTML = editorRef.current.innerHTML.replace(re, replaceText);
    updateStats();
  }, [findText, replaceText, updateStats]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveToLocal(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "f") { e.preventDefault(); setShowFind(v => !v); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveToLocal]);

  const Btn = ({ onClick, title, children, active }: { onClick: () => void; title: string; children: React.ReactNode; active?: boolean }) => (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? "bg-zinc-600 text-white" : "text-zinc-300 hover:bg-zinc-700 hover:text-white"}`}
    >
      {children}
    </button>
  );

  const Divider = () => <span className="w-px h-5 bg-zinc-600 mx-1 shrink-0" />;

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-zinc-700 min-h-[700px]">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-zinc-900 border-b border-zinc-700">
        <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          onBlur={saveToLocal}
          className="bg-transparent text-zinc-200 text-sm font-medium focus:outline-none border-b border-transparent focus:border-zinc-500 min-w-0 w-48"
          placeholder="Document name"
        />
        {lastSaved && (
          <span className="text-xs text-zinc-500 hidden sm:inline">
            Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto flex-wrap">
          <Btn onClick={handleNew} title="New document"><Trash2 className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={saveToLocal} title="Save (Ctrl+S)"><Save className="w-3.5 h-3.5" /></Btn>
          <Btn onClick={() => setShowFind(v => !v)} title="Find & Replace (Ctrl+F)"><Search className="w-3.5 h-3.5" /></Btn>
          <Divider />
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-2.5 py-1.5 rounded border border-zinc-600 hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />{importing ? "Opening…" : "Open .docx"}
          </button>
          <button
            onClick={handleAiBrochure}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-3 py-1.5 rounded font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {aiGenerating ? (
              <><span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" /> Designing…</>
            ) : (
              <>✦ AI Brochure</>
            )}
          </button>
          <button
            onClick={() => setShowBrochureModal(true)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded border border-zinc-700 hover:bg-zinc-700 transition-colors"
            title="CSS templates (instant)"
          >
            <FileText className="w-3.5 h-3.5" /> Template
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-2.5 py-1.5 rounded border border-zinc-600 hover:bg-zinc-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button
            onClick={handleDownload}
            disabled={exporting}
            className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors font-semibold disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />{exporting ? "Saving…" : "Save .docx"}
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept=".docx" className="hidden" onChange={handleImport} />
        <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleInsertImage} />
      </div>

      {/* ── Format toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-zinc-800 border-b border-zinc-700">
        <Btn onClick={() => exec("undo")} title="Undo (Ctrl+Z)"><Undo className="w-3.5 h-3.5" /></Btn>
        <Btn onClick={() => exec("redo")} title="Redo (Ctrl+Y)"><Redo className="w-3.5 h-3.5" /></Btn>
        <Divider />
        <Btn onClick={() => exec("bold")} title="Bold (Ctrl+B)"><Bold className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("italic")} title="Italic (Ctrl+I)"><Italic className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("underline")} title="Underline (Ctrl+U)"><Underline className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("strikeThrough")} title="Strikethrough"><Strikethrough className="w-4 h-4" /></Btn>
        <Divider />
        <Btn onClick={() => exec("formatBlock", "h1")} title="Heading 1"><Heading1 className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("formatBlock", "h2")} title="Heading 2"><Heading2 className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("formatBlock", "h3")} title="Heading 3"><Heading3 className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("formatBlock", "p")} title="Normal text"><span className="text-xs font-bold px-0.5">¶</span></Btn>
        <Divider />
        <Btn onClick={() => exec("insertUnorderedList")} title="Bullet list"><List className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered list"><ListOrdered className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("indent")} title="Indent"><Indent className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("outdent")} title="Outdent"><Outdent className="w-4 h-4" /></Btn>
        <Divider />
        <Btn onClick={() => exec("justifyLeft")} title="Align left"><AlignLeft className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("justifyCenter")} title="Align center"><AlignCenter className="w-4 h-4" /></Btn>
        <Btn onClick={() => exec("justifyRight")} title="Align right"><AlignRight className="w-4 h-4" /></Btn>
        <Divider />
        <Btn onClick={handleInsertLink} title="Insert link"><Link2 className="w-4 h-4" /></Btn>
        <Btn onClick={() => imgInputRef.current?.click()} title="Insert image from file"><ImageIcon className="w-4 h-4" /></Btn>
        <Divider />
        <select
          onChange={e => handleFontSize(e.target.value)}
          defaultValue="12"
          className="text-xs bg-zinc-700 text-zinc-200 border border-zinc-600 rounded px-1.5 py-1 focus:outline-none"
          title="Font size"
          onMouseDown={saveRange}
        >
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}pt</option>)}
        </select>
        <select
          onChange={e => exec("foreColor", e.target.value)}
          defaultValue=""
          title="Text color"
          className="text-xs bg-zinc-700 text-zinc-200 border border-zinc-600 rounded px-1.5 py-1 focus:outline-none"
          onMouseDown={saveRange}
        >
          <option value="" disabled>Color</option>
          {["#000000","#1d4ed8","#dc2626","#16a34a","#d97706","#7c3aed","#db2777","#6b7280"].map(c => (
            <option key={c} value={c} style={{ background: c, color: ["#000000","#1d4ed8","#dc2626","#16a34a","#7c3aed","#db2777"].includes(c) ? "#fff" : "#000" }}>
              {c}
            </option>
          ))}
          <option value="#000000">Reset black</option>
        </select>
      </div>

      {/* ── Find & Replace ── */}
      {showFind && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-zinc-800/80 border-b border-zinc-700 text-xs">
          <input
            autoFocus
            value={findText}
            onChange={e => setFindText(e.target.value)}
            placeholder="Find…"
            className="bg-zinc-700 text-zinc-200 rounded px-2 py-1.5 w-36 focus:outline-none focus:ring-1 ring-blue-500"
            onKeyDown={e => e.key === "Enter" && handleFind()}
          />
          <input
            value={replaceText}
            onChange={e => setReplaceText(e.target.value)}
            placeholder="Replace with…"
            className="bg-zinc-700 text-zinc-200 rounded px-2 py-1.5 w-36 focus:outline-none focus:ring-1 ring-blue-500"
          />
          <button onClick={handleFind} className="px-2.5 py-1.5 bg-zinc-600 hover:bg-zinc-500 text-zinc-200 rounded transition-colors">Find</button>
          <button onClick={handleReplaceAll} className="px-2.5 py-1.5 bg-zinc-600 hover:bg-zinc-500 text-zinc-200 rounded transition-colors">Replace All</button>
          <button onClick={() => setShowFind(false)} className="ml-auto text-zinc-400 hover:text-zinc-200 transition-colors">✕</button>
        </div>
      )}

      {/* ── Link modal ── */}
      {showLinkModal && (
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/80 border-b border-zinc-700 text-xs">
          <Link2 className="w-3.5 h-3.5 text-zinc-400" />
          <input
            autoFocus
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="bg-zinc-700 text-zinc-200 rounded px-2 py-1.5 w-56 focus:outline-none focus:ring-1 ring-blue-500"
            onKeyDown={e => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") setShowLinkModal(false); }}
          />
          <button onClick={applyLink} className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">Insert</button>
          <button onClick={() => setShowLinkModal(false)} className="text-zinc-400 hover:text-zinc-200 transition-colors">Cancel</button>
        </div>
      )}

      {/* AI Brochure error banner */}
      {aiError && (
        <div className="flex items-center gap-3 bg-red-900/30 border-b border-red-700/50 text-red-300 text-sm px-4 py-2.5">
          <span className="flex-1">{aiError}</span>
          {(aiError.includes("Pro") || aiError.includes("free")) && (
            <a
              href="/pricing"
              className="shrink-0 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-3 py-1 rounded transition-colors"
            >
              Upgrade to Pro
            </a>
          )}
          <button onClick={() => setAiError("")} className="shrink-0 text-red-400 hover:text-red-200 text-xl leading-none">×</button>
        </div>
      )}

      {/* ── Brochure template picker ── */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowBrochureModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-zinc-100 font-semibold text-base">Convert to Brochure</h3>
              <button onClick={() => setShowBrochureModal(false)} className="text-zinc-400 hover:text-zinc-200 text-lg leading-none">✕</button>
            </div>
            <p className="text-zinc-400 text-xs mb-5">Your document structure (H1 = title, H2 = sections) is automatically formatted into the template. A print dialog will open — save as PDF.</p>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(BROCHURE_TEMPLATES) as [BrochureKey, typeof BROCHURE_TEMPLATES[BrochureKey]][]).map(([key, tpl]) => (
                <button
                  key={key}
                  onClick={() => handleBrochure(key)}
                  className="group flex flex-col rounded-xl overflow-hidden border border-zinc-700 hover:border-zinc-400 transition-all hover:scale-[1.02] text-left"
                >
                  <div className="h-20 w-full flex items-center justify-center" style={{ background: tpl.accent }}>
                    <div className="w-10 h-8 bg-white/20 rounded-sm" />
                    <div className="absolute flex flex-col gap-1 opacity-60">
                      <div className="w-8 h-1 bg-white rounded" />
                      <div className="w-6 h-0.5 bg-white rounded" />
                      <div className="w-7 h-0.5 bg-white rounded" />
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-800 flex-1">
                    <div className="text-zinc-100 text-xs font-semibold mb-0.5">{tpl.label}</div>
                    <div className="text-zinc-400 text-[10px] leading-snug">{tpl.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-zinc-600 text-[10px] mt-4 text-center">Tip: Use H1 for your title, H2 for section headings for best results</p>
          </div>
        </div>
      )}

      {/* ── Editor ── */}
      <div className="flex-1 bg-zinc-600 overflow-y-auto py-8 px-4 min-h-[500px]">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={updateStats}
          onPaste={handlePaste}
          data-placeholder="Start typing your document…"
          className="relative bg-white text-zinc-900 min-h-[800px] mx-auto focus:outline-none"
          style={{
            maxWidth: "816px",
            padding: "96px 96px",
            fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
            fontSize: "12pt",
            lineHeight: "1.6",
            boxShadow: "0 2px 24px 0 rgba(0,0,0,0.45)",
            caretColor: "#1d4ed8",
          }}
        />
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-t border-zinc-700 text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <span>{stats.words.toLocaleString()} words</span>
          <span>{stats.chars.toLocaleString()} characters</span>
        </div>
        {importError && <span className="text-red-400">{importError}</span>}
        <span className="hidden sm:inline">100% local — nothing uploaded</span>
      </div>

      <style>{`
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }
        [contenteditable] h1 { font-size: 24pt; font-weight: bold; margin: 16pt 0 6pt; line-height: 1.3; }
        [contenteditable] h2 { font-size: 18pt; font-weight: bold; margin: 14pt 0 4pt; line-height: 1.3; }
        [contenteditable] h3 { font-size: 14pt; font-weight: bold; margin: 10pt 0 3pt; line-height: 1.3; }
        [contenteditable] p { margin: 0 0 8pt; }
        [contenteditable] ul { list-style: disc; padding-left: 24pt; margin: 6pt 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 24pt; margin: 6pt 0; }
        [contenteditable] li { margin: 2pt 0; }
        [contenteditable] a { color: #1d4ed8; text-decoration: underline; }
        [contenteditable] img { max-width: 100%; height: auto; cursor: default; }
        [contenteditable] table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
        [contenteditable] td, [contenteditable] th { border: 1px solid #d1d5db; padding: 4pt 8pt; }
      `}</style>
    </div>
  );
}
