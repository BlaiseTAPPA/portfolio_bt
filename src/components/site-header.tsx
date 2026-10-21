"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Lang } from "@/lib/content";

const navItems = [
  { to: "/", key: "navHome" },
  { to: "/projects", key: "navProjects" },
  { to: "/about", key: "navAbout" },
  { to: "/blog", key: "navBlog" },
  { to: "/hiring", key: "navHiring" },
  { to: "/contact", key: "navContact" },
] as const;

const languageNames = { de: "Deutsch", en: "English", fr: "Français" } as const;
const switchOrder: Lang[] = ["en", "de", "fr"];

/** Links to the same page in each locale, so a shared URL always matches its language. */
function LangSwitch() {
  const current = useLocale();
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-2 nav-mono text-muted">
      {switchOrder.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 ? (
            <span aria-hidden="true" className="text-muted-soft">
              |
            </span>
          ) : null}
          <Link
            href={pathname}
            locale={l}
            hrefLang={l}
            lang={l}
            aria-label={languageNames[l]}
            aria-current={l === current ? "true" : undefined}
            className={l === current ? "text-ink" : "hover:text-ink transition-colors"}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="shell flex h-14 items-center justify-between">
        <Link href="/" className="wordmark" onClick={() => setOpen(false)}>
          Blaise Tappa
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label={t("navPrimary")}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              aria-current={isActive(item.to) ? "page" : undefined}
              className={`nav-mono transition-colors ${isActive(item.to) ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {t(item.key)}
            </Link>
          ))}
          <LangSwitch />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <LangSwitch />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t("close") : t("menu")}
            className="flex size-11 items-center justify-center rounded-full border border-hairline-strong text-ink"
          >
            <span aria-hidden="true" className="nav-mono">
              {open ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-y border-hairline bg-canvas md:hidden" aria-label={t("navMobile")}>
          <div className="shell flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.to) ? "page" : undefined}
                className={`nav-mono py-4 ${isActive(item.to) ? "text-ink" : "text-muted"}`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
