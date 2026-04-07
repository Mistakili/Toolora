const BASE = "https://toolora.dev";

const TEXT_TOOLS = [
  { id: "word-counter",     label: "Word Counter",          path: "/tools/text/word-counter" },
  { id: "case-converter",   label: "Case Converter",        path: "/tools/text/case-converter" },
  { id: "text-diff",        label: "Text Diff",             path: "/tools/text/text-diff" },
  { id: "markdown-preview", label: "Markdown Preview",      path: "/tools/text/markdown-preview" },
  { id: "text-chunker",     label: "Text Chunker (RAG)",    path: "/tools/developer/text-chunker" },
  { id: "html-to-markdown", label: "HTML to Markdown",      path: "/tools/developer/html-to-markdown" },
];

const DEV_TOOLS = [
  { id: "json-formatter",     label: "JSON Formatter",          path: "/tools/developer/json-formatter" },
  { id: "base64",             label: "Base64 Encoder/Decoder",  path: "/tools/developer/base64" },
  { id: "url-encoder",        label: "URL Encoder/Decoder",     path: "/tools/developer/url-encoder" },
  { id: "hash-generator",     label: "Hash Generator",          path: "/tools/developer/hash-generator" },
  { id: "jwt-decoder",        label: "JWT Decoder",             path: "/tools/developer/jwt-decoder" },
  { id: "regex-tester",       label: "Regex Tester",            path: "/tools/developer/regex-tester" },
  { id: "token-counter",      label: "Token Counter",           path: "/tools/developer/token-counter" },
  { id: "yaml-json-converter",label: "YAML ↔ JSON Converter",   path: "/tools/developer/yaml-json-converter" },
  { id: "string-escape",      label: "String Escape Tool",      path: "/tools/developer/string-escape" },
  { id: "data-extractor",     label: "AI Data Extractor",       path: "/tools/developer/data-extractor" },
];

chrome.runtime.onInstalled.addListener(() => {
  // Root menu (on any selection)
  chrome.contextMenus.create({
    id: "toolora-root",
    title: "Send to Toolora",
    contexts: ["selection"],
  });

  // Text tools submenu
  for (const tool of TEXT_TOOLS) {
    chrome.contextMenus.create({
      id: `toolora-${tool.id}`,
      parentId: "toolora-root",
      title: tool.label,
      contexts: ["selection"],
    });
  }

  chrome.contextMenus.create({
    id: "toolora-sep1",
    parentId: "toolora-root",
    type: "separator",
    contexts: ["selection"],
  });

  // Dev tools submenu
  for (const tool of DEV_TOOLS) {
    chrome.contextMenus.create({
      id: `toolora-${tool.id}`,
      parentId: "toolora-root",
      title: tool.label,
      contexts: ["selection"],
    });
  }

  chrome.contextMenus.create({
    id: "toolora-sep2",
    parentId: "toolora-root",
    type: "separator",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "toolora-open-site",
    parentId: "toolora-root",
    title: "Open Toolora →",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toolora-open-site") {
    chrome.tabs.create({ url: BASE });
    return;
  }

  const allTools = [...TEXT_TOOLS, ...DEV_TOOLS];
  const toolId = String(info.menuItemId).replace("toolora-", "");
  const tool = allTools.find((t) => t.id === toolId);

  if (tool) {
    const selectedText = info.selectionText || "";
    const url = `${BASE}${tool.path}${selectedText ? `?text=${encodeURIComponent(selectedText)}` : ""}`;
    chrome.tabs.create({ url });
  }
});
