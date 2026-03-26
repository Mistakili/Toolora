const TOOLORA_BASE = "https://toolora.app";

const TEXT_TOOLS = [
  { slug: "word-counter", category: "text", label: "Word Counter" },
  { slug: "case-converter", category: "text", label: "Case Converter" },
  { slug: "markdown-preview", category: "text", label: "Markdown Preview" },
  { slug: "text-diff", category: "text", label: "Text Diff" },
  { slug: "json-formatter", category: "developer", label: "JSON Formatter" },
  { slug: "base64", category: "developer", label: "Base64 Encode/Decode" },
  { slug: "url-encoder", category: "developer", label: "URL Encode/Decode" },
  { slug: "hash-generator", category: "developer", label: "Hash Generator" },
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "toolora-root",
    title: "Open in Toolora →",
    contexts: ["selection"],
  });

  TEXT_TOOLS.forEach(tool => {
    chrome.contextMenus.create({
      id: `toolora-${tool.slug}`,
      parentId: "toolora-root",
      title: tool.label,
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const tool = TEXT_TOOLS.find(t => `toolora-${t.slug}` === info.menuItemId);
  if (!tool || !info.selectionText) return;
  const encoded = encodeURIComponent(info.selectionText.slice(0, 4000));
  const url = `${TOOLORA_BASE}/tools/${tool.category}/${tool.slug}?input=${encoded}`;
  chrome.tabs.create({ url });
});
