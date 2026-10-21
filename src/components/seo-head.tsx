import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLang } from "@/lib/i18n";
import { getSeoMetadata } from "@/lib/seo";

interface SeoHeadProps {
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
  customType?: "website" | "article" | "profile";
}

export function SeoHead({
  customTitle,
  customDescription,
  customImage,
  customType,
}: SeoHeadProps = {}) {
  const { pathname } = useLocation();
  const { lang } = useLang();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const origin = window.location.origin;
    const baseSeo = getSeoMetadata(pathname, lang, origin);

    const title = customTitle || baseSeo.title;
    const description = customDescription || baseSeo.description;
    const image = customImage || baseSeo.image;
    const type = customType || baseSeo.type;
    const url = window.location.href;

    // 1. Update <title>
    document.title = title;

    // Helper to set or create a meta tag
    function setMeta(selector: string, attrName: string, attrVal: string, content: string) {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }

    // 2. Standard Meta
    setMeta('meta[name="description"]', "name", "description", description);

    // 3. OpenGraph
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta(
      'meta[property="og:site_name"]',
      "property",
      "og:site_name",
      "Blaise Tappa — Portfolio",
    );

    // 4. Twitter / X
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    // 5. Canonical Link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url.split(/[?#]/)[0] ?? url);

    // 6. JSON-LD Structured Data
    const jsonLdId = "seo-json-ld";
    let scriptEl = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (baseSeo.jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = jsonLdId;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(baseSeo.jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [pathname, lang, customTitle, customDescription, customImage, customType]);

  return null;
}
