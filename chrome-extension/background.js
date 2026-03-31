const BASE = "https://toolora.dev";

const TEXT_TOOLS = [
  { id: "word-counter",     label: "Word Counter",          path: "/tools/text/word-counter" },
  { id: "case-converter",   label: "Case Converter",        path: "/tools/text/case-converter" },
  { id: "markdown-preview", label: "Markdown Preview",      path: "/tools/text/markdown-preview" },
  { id: "text-diff",        label: "Text Diff",             path: "/tools/text/text-diff" },
  { id: "lorem-ipsum",      label: "Lorem Ipsum Generator", path: "/tools/text/lorem-ipsum" },
];

const DEV_TOOLS = [
  { id: "json-formatter",   label: "JSON Formatter",        path: "/tools/developer/json-formatter" },
  { id: "base64",           label: "Base64 Encoder/Decoder",path: "/tools/developer/base64" },
  { id: "url-encoder",      label: "URL Encoder/Decoder",   path: "/tools/developer/url-encoder" },
  { id: "hash-generator",   label: "Hash Generator",        path: "/tools/developer/hash-generator" },
  { id: "uuid-generator",   label: "UUID Generator",        path: "/tools/developer/uuid-generator" },
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
