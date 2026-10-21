import { ExternalLink, Linkedin, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CvDownloadButton } from "@/components/client-islands";
import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/site-chrome";
import { resolveLocale } from "@/i18n/locale";
import { identity } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const lang = await resolveLocale(params);
  const t = await getTranslations("common");
  const c = await getTranslations("contact");

  return (
    <>
      <PageHeader title={t("contactTitle")} intro={t("contactIntro")} />

      <section className="border-b border-hairline py-12 bg-surface-soft/30">
        <div className="shell">
          <div className="border border-hairline p-8 md:p-10 bg-canvas flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="caption-mono text-muted flex items-center gap-2 mb-2">
                <Mail className="size-4 text-ink" />
                {c("directEyebrow")}
              </span>
              <h2 className="display-sm">{c("directTitle")}</h2>
              <p className="body-md mt-3 text-body">{c("directIntro")}</p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a
                href={`mailto:${identity.email}`}
                className="btn-outline bg-ink text-canvas inline-flex items-center justify-center gap-2.5 py-4 px-6 text-center leading-normal"
              >
                <Mail className="size-4" />
                <span>{t("emailMe")}</span>
              </a>
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-outline inline-flex items-center justify-center gap-2.5 py-4 px-6 text-center leading-normal"
              >
                <Linkedin className="size-4" />
                <span>{t("linkedinProfile")}</span>
              </a>
              <CvDownloadButton
                label={c("cvDownloadBtn")}
                className="btn-outline inline-flex items-center justify-center gap-2.5 py-3 px-6 text-center leading-normal text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-16 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="caption-mono mb-8 text-muted">{c("orWriteForm")}</p>
            <ContactForm />
          </div>

          <aside>
            <p className="caption-mono">{t("direct")}</p>
            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href={`mailto:${identity.email}`}
                  className="body-md text-link hover:opacity-70 inline-flex items-center gap-2"
                >
                  <Mail className="size-4 opacity-70" />
                  <span>{identity.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={identity.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="body-md text-link hover:opacity-70 inline-flex items-center gap-2"
                >
                  <ExternalLink className="size-4 opacity-70" />
                  <span>linkedin.com/in/blaise-tappa</span>
                </a>
              </li>
              <li>
                <a
                  href={identity.github}
                  target="_blank"
                  rel="noreferrer"
                  className="body-md text-link hover:opacity-70 inline-flex items-center gap-2"
                >
                  <ExternalLink className="size-4 opacity-70" />
                  <span>github.com/BlaiseTAPPA</span>
                </a>
              </li>
            </ul>

            <div className="mt-12 border-t border-hairline pt-8">
              <p className="caption-mono text-muted mb-3">{c("cvDownloadTitle")}</p>
              <CvDownloadButton
                label={c("cvDownloadBtn")}
                iconClassName="size-3.5"
                className="btn-outline text-xs inline-flex items-center gap-2 w-full justify-center"
              />
            </div>

            <p className="body-sm mt-10 text-muted">{identity.location[lang]}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
