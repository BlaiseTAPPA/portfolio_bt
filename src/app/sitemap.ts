import type { MetadataRoute } from "next";
import { locales, posts } from "@/lib/content";
import { absoluteUrl, allPaths, languageAlternates, localizedPath } from "@/lib/seo";

/** Every page in every locale, each listing its hreflang siblings. */
export default function sitemap(): MetadataRoute.Sitemap {
  const postDates = new Map(posts.map((p) => [`/blog/${p.slug}`, p.date]));

  return allPaths().flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([l, href]) => [l, absoluteUrl(href)]),
    );
    const lastModified = postDates.get(path);
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages },
    }));
  });
}
