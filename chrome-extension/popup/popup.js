const BASE = "https://toolora.dev";

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const TOOLS = [
  // Text
  { name: "Word Counter",           desc: "Count words, chars & reading time",  icon: "📝", cat: "text",        path: "/tools/text/word-counter" },
  { name: "Case Converter",         desc: "UPPER, lower, camelCase, snake_case", icon: "🔡", cat: "text",        path: "/tools/text/case-converter" },
  { name: "Lorem Ipsum Generator",  desc: "Generate placeholder text",           icon: "📄", cat: "text",        path: "/tools/text/lorem-ipsum" },
  { name: "Markdown Preview",       desc: "Live markdown editor & renderer",      icon: "✍️", cat: "text",        path: "/tools/text/markdown-preview" },
  { name: "Text Diff",              desc: "Compare two texts side-by-side",       icon: "🔍", cat: "text",        path: "/tools/text/text-diff" },
  // Developer
  { name: "JSON Formatter",         desc: "Pretty-print & validate JSON",         icon: "{ }", cat: "developer",  path: "/tools/developer/json-formatter" },
  { name: "Base64 Encoder/Decoder", desc: "Encode or decode Base64 strings",      icon: "🔐", cat: "developer",  path: "/tools/developer/base64" },
  { name: "URL Encoder/Decoder",    desc: "Encode/decode percent-encoded URLs",   icon: "🔗", cat: "developer",  path: "/tools/developer/url-encoder" },
  { name: "Hash Generator",         desc: "MD5, SHA-1, SHA-256 from any text",    icon: "#",  cat: "developer",  path: "/tools/developer/hash-generator" },
  { name: "UUID Generator",         desc: "Generate random UUID v4 strings",      icon: "🆔", cat: "developer",  path: "/tools/developer/uuid-generator" },
  // Productivity
  { name: "QR Code Generator",      desc: "Create custom QR codes instantly",     icon: "⬛", cat: "productivity",path: "/tools/productivity/qr-generator" },
  { name: "Password Generator",     desc: "Strong random passwords, in-browser",  icon: "🔑", cat: "productivity",path: "/tools/productivity/password-generator" },
  { name: "Unit Converter",         desc: "Length, weight, temperature & more",   icon: "📐", cat: "productivity",path: "/tools/productivity/unit-converter" },
  { name: "Color Converter",        desc: "HEX ↔ RGB ↔ HSL color picker",         icon: "🎨", cat: "productivity",path: "/tools/productivity/color-picker" },
  { name: "Timestamp Converter",    desc: "Convert Unix epoch to readable date",  icon: "⏱️", cat: "productivity",path: "/tools/productivity/timestamp-converter" },
  // Image
  { name: "Image Resizer",          desc: "Resize images — files stay local",     icon: "🖼️", cat: "image",       path: "/tools/image/image-resize" },
  { name: "Image Compressor",       desc: "Compress JPG, PNG, WebP privately",    icon: "📦", cat: "image",       path: "/tools/image/image-compress" },
  { name: "Image Converter",        desc: "Convert JPG ↔ PNG ↔ WebP",             icon: "🔄", cat: "image",       path: "/tools/image/image-convert" },
  // PDF
  { name: "Merge PDF",              desc: "Combine PDFs without uploading",       icon: "📎", cat: "pdf",         path: "/tools/pdf/pdf-merge" },
  { name: "Split PDF",              desc: "Extract pages — all in your browser",  icon: "✂️", cat: "pdf",         path: "/tools/pdf/pdf-split" },
];

let activeCat = "all";
let searchQuery = "";

function open(path) {
  chrome.tabs.create({ url: BASE + path });
  window.close();
}

function render() {
  const list = document.getElementById("tools-list");
  const q = searchQuery.toLowerCase();

  const filtered = TOOLS.filter((t) => {
    const matchCat = activeCat === "all" || t.cat === activeCat;
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="no-results">No tools found for "<strong>${escapeHtml(searchQuery)}</strong>"</div>`;
    return;
  }

  // Group by category when showing "all" and no search
  if (activeCat === "all" && !q) {
    const cats = [
      { id: "text",         label: "Text" },
      { id: "developer",    label: "Developer" },
      { id: "productivity", label: "Productivity" },
      { id: "image",        label: "Image" },
      { id: "pdf",          label: "PDF" },
    ];
    list.innerHTML = cats.map((c) => {
      const tools = filtered.filter((t) => t.cat === c.id);
      if (!tools.length) return "";
      return `
        <div class="cat-label">${c.label}</div>
        ${tools.map(toolHtml).join("")}
      `;
    }).join("");
  } else {
    list.innerHTML = filtered.map(toolHtml).join("");
  }

  // Bind clicks
  list.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.addEventListener("click", () => open(btn.dataset.path));
  });
}

function toolHtml(t) {
  return `
    <button class="tool-btn" data-path="${t.path}">
      <div class="tool-icon">${t.icon}</div>
      <div>
        <div class="tool-name">${t.name}</div>
        <div class="tool-desc">${t.desc}</div>
      </div>
    </button>
  `;
}

// Search
document.getElementById("search").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  render();
});

// Categories
document.getElementById("categories").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  activeCat = btn.dataset.cat;
  document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  render();
});

// Open site
document.getElementById("open-site").addEventListener("click", () => {
  chrome.tabs.create({ url: BASE });
  window.close();
});

document.getElementById("privacy-link").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: BASE + "/privacy" });
  window.close();
});

// Focus search on open
document.getElementById("search").focus();

render();
