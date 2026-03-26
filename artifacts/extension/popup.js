const TOOLORA_BASE = "https://toolora.app";

const TOOLS = [
  { name: "Word Counter", slug: "word-counter", category: "text", icon: "T" },
  { name: "Case Converter", slug: "case-converter", category: "text", icon: "Aa" },
  { name: "Lorem Ipsum", slug: "lorem-ipsum", category: "text", icon: "¶" },
  { name: "Markdown Preview", slug: "markdown-preview", category: "text", icon: "M↓" },
  { name: "Text Diff", slug: "text-diff", category: "text", icon: "±" },
  { name: "JSON Formatter", slug: "json-formatter", category: "developer", icon: "{}" },
  { name: "Base64 Encode/Decode", slug: "base64", category: "developer", icon: "64" },
  { name: "URL Encoder/Decoder", slug: "url-encoder", category: "developer", icon: "%" },
  { name: "Hash Generator", slug: "hash-generator", category: "developer", icon: "#" },
  { name: "UUID Generator", slug: "uuid-generator", category: "developer", icon: "⊞" },
  { name: "QR Code Generator", slug: "qr-generator", category: "productivity", icon: "▦" },
  { name: "Password Generator", slug: "password-generator", category: "productivity", icon: "🔑" },
  { name: "Unit Converter", slug: "unit-converter", category: "productivity", icon: "⇄" },
  { name: "Color Converter", slug: "color-picker", category: "productivity", icon: "●" },
  { name: "Timestamp Converter", slug: "timestamp-converter", category: "productivity", icon: "⏱" },
  { name: "Image Resizer", slug: "image-resize", category: "image", icon: "⊡" },
  { name: "Image Compressor", slug: "image-compress", category: "image", icon: "⇙" },
  { name: "Image Converter", slug: "image-convert", category: "image", icon: "⇌" },
  { name: "Merge PDF", slug: "pdf-merge", category: "pdf", icon: "⊕" },
  { name: "Split PDF", slug: "pdf-split", category: "pdf", icon: "⊢" },
];

function renderTools(query) {
  const filtered = query
    ? TOOLS.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.category.includes(query.toLowerCase()))
    : TOOLS;

  const categories = [...new Set(filtered.map(t => t.category))];
  const container = document.getElementById("tools-container");
  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding:20px;text-align:center;color:#6b7280;font-size:13px">No tools found</div>`;
    return;
  }

  categories.forEach(cat => {
    const catTools = filtered.filter(t => t.category === cat);
    const section = document.createElement("div");
    section.innerHTML = `<div class="section-title">${cat}</div>`;
    const list = document.createElement("div");
    list.className = "tools";
    catTools.forEach(tool => {
      const a = document.createElement("a");
      a.className = "tool-btn";
      a.href = `${TOOLORA_BASE}/tools/${tool.category}/${tool.slug}`;
      a.target = "_blank";
      a.innerHTML = `
        <div class="tool-icon">${tool.icon}</div>
        <div class="tool-info">
          <div class="name">${tool.name}</div>
          <div class="cat">${tool.category}</div>
        </div>`;
      list.appendChild(a);
    });
    section.appendChild(list);
    container.appendChild(section);
  });
}

renderTools("");

document.getElementById("search").addEventListener("input", e => {
  renderTools(e.target.value.trim());
});
