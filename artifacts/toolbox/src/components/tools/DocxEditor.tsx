import { useRef, useState, useCallback, useEffect } from "react";
import {
  Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight,
  Download, Upload, FileText, Trash2, Heading1, Heading2, Heading3,
} from "lucide-react";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  LevelFormat, convertInchesToTwip,
} from "docx";

type Align = "left" | "center" | "right";

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

function getAlignment(value: Align): AlignmentType {
  if (value === "center") return AlignmentType.CENTER;
  if (value === "right") return AlignmentType.RIGHT;
  return AlignmentType.LEFT;
}

function getTextRuns(el: Element): TextRun[] {
  const runs: TextRun[] = [];
  function walk(node: Node, bold: boolean, italics: boolean, underline: boolean) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text) runs.push(new TextRun({ text, bold, italics, underline: underline ? {} : undefined }));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = (node as Element).tagName.toLowerCase();
      if (tag === "br") { runs.push(new TextRun({ text: "\n" })); return; }
      const b = bold || tag === "b" || tag === "strong";
      const i = italics || tag === "i" || tag === "em";
      const u = underline || tag === "u";
      for (const child of Array.from(node.childNodes)) walk(child, b, i, u);
    }
  }
  for (const child of Array.from(el.childNodes)) walk(child, false, false, false);
  return runs.length ? runs : [new TextRun("")];
}

function htmlToDocxParagraphs(html: string): Paragraph[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");
  const paras: Paragraph[] = [];

  function processEl(el: Element) {
    const tag = el.tagName?.toLowerCase();
    if (!tag) return;
    const style = el.getAttribute("style") ?? "";
    let align = AlignmentType.LEFT;
    if (style.includes("text-align: center")) align = AlignmentType.CENTER;
    else if (style.includes("text-align: right")) align = AlignmentType.RIGHT;

    if (tag === "h1") {
      paras.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: getTextRuns(el), alignment: align }));
    } else if (tag === "h2") {
      paras.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: getTextRuns(el), alignment: align }));
    } else if (tag === "h3") {
      paras.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: getTextRuns(el), alignment: align }));
    } else if (tag === "ul") {
      for (const li of Array.from(el.children)) {
        paras.push(new Paragraph({ bullet: { level: 0 }, children: getTextRuns(li as Element) }));
      }
    } else if (tag === "ol") {
      for (const li of Array.from(el.children)) {
        paras.push(new Paragraph({
          numbering: { reference: "num1", level: 0 },
          children: getTextRuns(li as Element),
        }));
      }
    } else if (tag === "div" || tag === "p") {
      const runs = getTextRuns(el);
      paras.push(new Paragraph({ children: runs, alignment: align }));
    }
  }

  for (const child of Array.from(doc.body.children)) processEl(child as Element);
  if (!paras.length) paras.push(new Paragraph({ children: [new TextRun("")] }));
  return paras;
}

async function exportAsDocx(html: string, fileName: string) {
  const paragraphs = htmlToDocxParagraphs(html);
  const doc = new Document({
    numbering: {
      config: [{
        reference: "num1",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } },
          },
        }],
      }],
    },
    sections: [{ properties: {}, children: paragraphs }],
  });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".docx") ? fileName : `${fileName}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

const FONT_SIZES = ["10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48"];

export default function DocxEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("Untitled Document");
  const [wordCount, setWordCount] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const updateWordCount = useCallback(() => {
    if (editorRef.current) setWordCount(countWords(editorRef.current.innerHTML));
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const exec = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    updateWordCount();
  }, [updateWordCount]);

  const handleFormatBlock = (tag: string) => exec("formatBlock", tag);

  const handleFontSize = (size: string) => {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    exec("fontSize", "7");
    const spans = el.querySelectorAll("font[size='7']");
    spans.forEach(s => {
      const span = document.createElement("span");
      span.style.fontSize = `${size}pt`;
      span.innerHTML = s.innerHTML;
      s.replaceWith(span);
    });
    updateWordCount();
  };

  const handleAlign = (align: Align) => {
    const cmd = align === "center" ? "justifyCenter" : align === "right" ? "justifyRight" : "justifyLeft";
    exec(cmd);
  };

  const handleNew = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      updateWordCount();
    }
    setFileName("Untitled Document");
    setImportError("");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportError("");
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      if (editorRef.current) {
        editorRef.current.innerHTML = result.value;
        updateWordCount();
      }
      setFileName(file.name.replace(/\.docx$/i, ""));
    } catch {
      setImportError("Could not read this file. Make sure it is a valid .docx file.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = async () => {
    const html = editorRef.current?.innerHTML ?? "";
    await exportAsDocx(html, fileName);
  };

  const ToolbarBtn = ({
    onClick, title, children, active,
  }: { onClick: () => void; title: string; children: React.ReactNode; active?: boolean }) => (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded hover:bg-zinc-700 transition-colors ${active ? "bg-zinc-700 text-white" : "text-zinc-300"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col gap-0 h-full min-h-[600px]">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-900 border border-zinc-700 rounded-t-xl">
        <FileText className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          className="bg-transparent text-zinc-200 text-sm font-medium focus:outline-none border-b border-transparent focus:border-zinc-500 min-w-0 flex-1 max-w-[200px]"
          placeholder="Document name"
        />
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={handleNew}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1.5 rounded hover:bg-zinc-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> New
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded border border-zinc-600 hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            {importing ? "Opening…" : "Open .docx"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors font-semibold"
          >
            <Download className="w-3.5 h-3.5" /> Save as .docx
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept=".docx" className="hidden" onChange={handleImport} />
      </div>

      {/* Formatting toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-zinc-800 border-x border-zinc-700">
        <ToolbarBtn onClick={() => exec("bold")} title="Bold (Ctrl+B)">
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("italic")} title="Italic (Ctrl+I)">
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("underline")} title="Underline (Ctrl+U)">
          <Underline className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-zinc-600 mx-1" />

        <ToolbarBtn onClick={() => handleFormatBlock("h1")} title="Heading 1">
          <Heading1 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => handleFormatBlock("h2")} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => handleFormatBlock("h3")} title="Heading 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => handleFormatBlock("p")} title="Normal paragraph">
          <span className="text-xs font-medium px-0.5">¶</span>
        </ToolbarBtn>

        <span className="w-px h-5 bg-zinc-600 mx-1" />

        <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Bullet list">
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec("insertOrderedList")} title="Numbered list">
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-zinc-600 mx-1" />

        <ToolbarBtn onClick={() => handleAlign("left")} title="Align left">
          <AlignLeft className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => handleAlign("center")} title="Align center">
          <AlignCenter className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => handleAlign("right")} title="Align right">
          <AlignRight className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-zinc-600 mx-1" />

        <select
          onChange={e => handleFontSize(e.target.value)}
          defaultValue="12"
          className="text-xs bg-zinc-700 text-zinc-200 border border-zinc-600 rounded px-1.5 py-1 focus:outline-none"
          title="Font size"
        >
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}pt</option>)}
        </select>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateWordCount}
        onKeyDown={updateWordCount}
        className="flex-1 min-h-[480px] bg-white text-zinc-900 p-8 border-x border-b border-zinc-700 rounded-b-xl focus:outline-none overflow-y-auto"
        style={{
          fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif",
          fontSize: "12pt",
          lineHeight: "1.6",
          caretColor: "#1d4ed8",
        }}
        data-placeholder="Start typing your document…"
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-1.5 px-1 text-xs text-zinc-500">
        <span>{wordCount.toLocaleString()} word{wordCount !== 1 ? "s" : ""}</span>
        {importError && <span className="text-red-400">{importError}</span>}
        <span className="text-zinc-600">All processing is 100% local — your document never leaves your device</span>
      </div>

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        [contenteditable] h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
        [contenteditable] h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        [contenteditable] ul { list-style: disc; padding-left: 2em; margin: 0.5em 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 2em; margin: 0.5em 0; }
        [contenteditable] li { margin: 0.2em 0; }
        [contenteditable] p { margin: 0.5em 0; }
      `}</style>
    </div>
  );
}
