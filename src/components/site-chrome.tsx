import { Link, NavLink } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { identity } from "@/lib/content";
import { useLang } from "@/lib/i18n";

const navItems = [
  { to: "/", key: "navHome" },
  { to: "/projects", key: "navProjects" },
  { to: "/about", key: "navAbout" },
  { to: "/blog", key: "navBlog" },
  { to: "/hiring", key: "navHiring" },
  { to: "/contact", key: "navContact" },
] as const;

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-2 nav-mono text-muted">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={lang === "en" ? "text-ink" : "hover:text-ink transition-colors"}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <span aria-hidden="true" className="text-muted-soft">
        |
      </span>
      <button
        type="button"
        onClick={() => setLang("de")}
        className={lang === "de" ? "text-ink" : "hover:text-ink transition-colors"}
        aria-pressed={lang === "de"}
      >
        DE
      </button>
      <span aria-hidden="true" className="text-muted-soft">
        |
      </span>
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={lang === "fr" ? "text-ink" : "hover:text-ink transition-colors"}
        aria-pressed={lang === "fr"}
      >
        FR
      </button>
    </div>
  );
}

export function SiteHeader() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="shell flex h-14 items-center justify-between">
        <Link to="/" className="wordmark" onClick={() => setOpen(false)}>
          Blaise Tappa
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-mono transition-colors ${isActive ? "text-ink" : "text-muted hover:text-ink"}`
              }
            >
              {t(item.key)}
            </NavLink>
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
        <nav className="border-y border-hairline bg-canvas md:hidden" aria-label="Mobile">
          <div className="shell flex flex-col py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `nav-mono py-4 ${isActive ? "text-ink" : "text-muted"}`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { t, lang } = useLang();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const locale = lang === "de" ? "de-DE" : lang === "fr" ? "fr-FR" : "en-GB";
    const timeFmt = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Berlin",
    });
    const zoneFmt = new Intl.DateTimeFormat(locale, {
      timeZone: "Europe/Berlin",
      timeZoneName: "short",
    });
    const tick = () => {
      const zone =
        zoneFmt.formatToParts(new Date()).find((part) => part.type === "timeZoneName")?.value ??
        "CET";
      setClock(`${timeFmt.format(new Date())} ${zone}`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [lang]);

  const columns: { heading: string; links: { label: string; to?: string; href?: string }[] }[] = [
    {
      heading: t("footerWork"),
      links: [
        { label: t("navProjects"), to: "/projects" },
        { label: t("navBlog"), to: "/blog" },
      ],
    },
    {
      heading: t("footerAbout"),
      links: [
        { label: t("navAbout"), to: "/about" },
        { label: t("navHiring"), to: "/hiring" },
        { label: t("navContact"), to: "/contact" },
      ],
    },
    {
      heading: t("footerConnect"),
      links: [
        { label: identity.email, href: `mailto:${identity.email}` },
        { label: "LinkedIn", href: identity.linkedin },
        { label: "GitHub", href: identity.github },
      ],
    },
  ];

  return (
    <footer className="border-t border-hairline-strong">
      <div className="shell pt-10 md:pt-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-8">
          {columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4 md:col-span-3">
              <h3 className="text-xs tracking-[0.3em]">{column.heading}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="body-md italic text-body transition-colors duration-300 hover:text-link"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        {...(link.href?.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                        className="body-md italic text-body transition-colors duration-300 hover:text-link"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-6 md:col-span-3 md:items-end md:text-right">
            <div className="flex flex-col gap-2">
              <span className="caption-mono flex items-center gap-2 text-link md:justify-end">
                <span aria-hidden="true" className="size-1.5 bg-link" />
                {t("footerStatus")}
              </span>
              <span className="caption-mono text-muted-soft">
                {t("footerLocation").replace("{time}", clock)}
              </span>
            </div>
            <Link to="/contact" className="btn-ghost mt-8 md:mt-0">
              {t("getInTouch")}
            </Link>
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-4">
          <div aria-hidden="true" className="overflow-hidden">
            <p className="wordmark-ghost translate-y-[18%]">Blaise Tappa</p>
          </div>

          <div className="flex flex-col items-center gap-4 border-t border-hairline pt-8 md:flex-row md:justify-between">
            <p className="caption-mono">
              © {new Date().getFullYear()} {identity.name}. {t("rights")}
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="caption-mono transition-colors duration-300 hover:text-link"
            >
              {t("backToTop")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageHeader({
  title,
  intro,
  eyebrow,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
}) {
  return (
    <section className="border-b border-hairline pt-36 pb-16 md:pt-44 md:pb-24">
      <div className="shell rise">
        {eyebrow ? <p className="caption-mono mb-6">{eyebrow}</p> : null}
        <h1 className="display-lg">{title}</h1>
        {intro ? <p className="body-md mt-6 max-w-2xl">{intro}</p> : null}
      </div>
    </section>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((tag) => (
        <li key={tag} className="caption-mono">
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
