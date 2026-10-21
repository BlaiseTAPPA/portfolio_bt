import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { education, identity, keyFacts } from "@/lib/content";
import { BackToTop, BerlinClock } from "./footer-islands";

export function SiteFooter() {
  const t = useTranslations("common");

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
                        href={link.to}
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
              <BerlinClock />
            </div>
            <Link href="/contact" className="btn-ghost mt-8 md:mt-0">
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
            <BackToTop label={t("backToTop")} />
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

export function KeyFacts({
  className = "",
  hideTitle = false,
}: {
  className?: string;
  hideTitle?: boolean;
}) {
  const t = useTranslations("common");
  const lang = useLocale();
  return (
    <div className={`border border-hairline p-6 ${className}`}>
      {hideTitle ? null : <h2 className="caption-mono text-body-strong">{t("keyFactsTitle")}</h2>}
      <dl className={hideTitle ? "space-y-4" : "mt-5 space-y-4"}>
        {keyFacts.map((f) => (
          <div
            key={f.label.en}
            className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <dt className="caption-mono">{f.label[lang]}</dt>
            <dd className="body-sm text-body-strong sm:text-right">{f.value[lang]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function EducationList() {
  const lang = useLocale();
  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {education.map((item) => (
        <li
          key={item.school}
          className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between md:gap-6"
        >
          <div>
            <p className="title-md">{item.school}</p>
            <p className="body-sm mt-2">{item.detail[lang]}</p>
          </div>
          {item.period ? <span className="caption-mono shrink-0">{item.period[lang]}</span> : null}
        </li>
      ))}
    </ul>
  );
}
