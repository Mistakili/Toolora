import { useEffect } from "react";

const BASE_URL = "https://toolora.replit.app";
const DEFAULT_IMAGE = `${BASE_URL}/opengraph.jpg`;
const SITE_NAME = "Toolora";

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.querySelector(`script[data-seo-id="${id}"]`)?.remove();
}

export function useSEO(options: SEOOptions) {
  useEffect(() => {
    const { title, description, canonical, image = DEFAULT_IMAGE, type = "website", jsonLd } = options;
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = canonical ?? window.location.href;

    document.title = fullTitle;

    setMeta("description", description);

    setMeta("og:type", type, "property");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", url, "property");
    setMeta("og:image", image, "property");
    setMeta("og:site_name", SITE_NAME, "property");

    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", fullTitle, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", image, "name");

    setLink("canonical", url);

    if (jsonLd) {
      setJsonLd("page", jsonLd);
    } else {
      removeJsonLd("page");
    }

    return () => {
      removeJsonLd("page");
    };
  }, [options.title, options.description, options.canonical, options.image, options.type]);
}
