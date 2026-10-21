import type { Metadata } from "next";
import {
  education,
  identity,
  languages,
  locales,
  posts,
  projects,
  type Lang,
  type Post,
  type Project,
} from "./content";

/** Locale-free route paths: `""` is the home page, every other path starts with `/`. */
export const staticPaths = [
  "",
  "/about",
  "/projects",
  "/blog",
  "/hiring",
  "/cv",
  "/contact",
] as const;

export function localizedPath(locale: Lang, path: string): string {
  return `/${locale}${path}`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, identity.siteUrl).toString();
}

/** hreflang map for one page: every locale plus `x-default` (the default locale, D16). */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l) => [l, localizedPath(l, path)])),
    "x-default": localizedPath("de", path),
  };
}

const ogLocale: Record<Lang, string> = { de: "de_DE", en: "en_GB", fr: "fr_FR" };

type OgImage = { url: string; width: number; height: number };

export const defaultOgImage: OgImage = { url: "/og.png", width: 1200, height: 630 };
/** Every project and post image is a 1600×912 JPEG in /public/images. */
export const contentImage = (url: string): OgImage => ({ url, width: 1600, height: 912 });

type PageMetaInput = {
  locale: Lang;
  path: string;
  title: string;
  description: string;
  image?: OgImage;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
};

/** Title, description, canonical, hreflang, Open Graph and Twitter for one page in one locale. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = defaultOgImage,
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const url = localizedPath(locale, path);
  const images = [{ ...image, alt: title }];
  const base = {
    url,
    title,
    description,
    siteName: "Blaise Tappa — Portfolio",
    locale: ogLocale[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    images,
  };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph:
      type === "article"
        ? {
            ...base,
            type: "article",
            authors: [identity.name],
            ...(publishedTime ? { publishedTime } : {}),
          }
        : { ...base, type },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

/** Home page: the Person a recruiter is looking at (D5: no nationality). */
export function personJsonLd(locale: Lang) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": absoluteUrl("/#person"),
        name: identity.name,
        jobTitle: identity.role[locale],
        url: absoluteUrl(localizedPath(locale, "")),
        image: absoluteUrl("/images/portrait-896.webp"),
        email: `mailto:${identity.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Germersheim",
          addressRegion: "Rheinland-Pfalz",
          addressCountry: "DE",
        },
        alumniOf: education.map((e) => ({
          "@type": "EducationalOrganization",
          name: e.school.split(" · ")[0],
        })),
        knowsLanguage: languages.map((l) => l.name.en),
        sameAs: [identity.github, identity.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: "Blaise Tappa — Portfolio",
        url: absoluteUrl(localizedPath(locale, "")),
        inLanguage: locale,
        author: { "@id": absoluteUrl("/#person") },
      },
    ],
  };
}

export function projectJsonLd(project: Project, locale: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    applicationCategory: "WebApplication",
    operatingSystem: "All",
    description: project.excerpt[locale],
    image: absoluteUrl(project.image),
    url: absoluteUrl(localizedPath(locale, `/projects/${project.slug}`)),
    author: { "@type": "Person", name: identity.name, url: identity.siteUrl },
  };
}

export function postJsonLd(post: Post, locale: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title[locale],
    description: post.excerpt[locale],
    datePublished: post.date,
    inLanguage: locale,
    image: absoluteUrl(post.image),
    url: absoluteUrl(localizedPath(locale, `/blog/${post.slug}`)),
    author: { "@type": "Person", name: identity.name, url: identity.siteUrl },
  };
}

/** Every page path (locale-free), for the sitemap. */
export function allPaths(): string[] {
  return [
    ...staticPaths,
    ...projects.map((p) => `/projects/${p.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];
}
