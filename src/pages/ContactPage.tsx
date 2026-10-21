import { useState, type FormEvent } from "react";
import { Download, Mail, ExternalLink, Linkedin } from "lucide-react";
import { Page, PageHeader } from "@/components/site-chrome";
import { identity } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { downloadCvPdf } from "@/lib/cv-pdf";
import { contactCopy } from "@/lib/page-copy";

export function ContactPage() {
  const { t, lang } = useLang();
  const c = contactCopy[lang];
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: { name?: string; email?: string; message?: string } = {};
    if (!values.name.trim()) next.name = t("validationName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t("validationEmail");
    if (values.message.trim().length < 10) next.message = t("validationMessage");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSent(true);
    window.location.href = `mailto:${identity.email}?subject=${encodeURIComponent(
      t("mailSubject").replace("{name}", values.name),
    )}&body=${encodeURIComponent(`${values.message}\n\n${values.name} — ${values.email}`)}`;
  }

  const field = "caption-mono block";

  return (
    <Page>
      <PageHeader title={t("contactTitle")} intro={t("contactIntro")} />

      <section className="border-b border-hairline py-12 bg-surface-soft/30">
        <div className="shell">
          <div className="border border-hairline p-8 md:p-10 bg-canvas flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="caption-mono text-muted flex items-center gap-2 mb-2">
                <Mail className="size-4 text-ink" />
                {c.directEyebrow}
              </span>
              <h2 className="display-sm">{c.directTitle}</h2>
              <p className="body-md mt-3 text-body">{c.directIntro}</p>
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
              <button
                type="button"
                onClick={() => downloadCvPdf(lang)}
                className="btn-outline inline-flex items-center justify-center gap-2.5 py-3 px-6 text-center leading-normal text-xs"
              >
                <Download className="size-4" />
                <span>{c.cvDownloadBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-16 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="caption-mono mb-8 text-muted">{c.orWriteForm}</p>
            <form onSubmit={onSubmit} noValidate className="max-w-xl">
              <div className="space-y-10">
                <div>
                  <label htmlFor="name" className={field}>
                    {t("fieldName")}
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="field-line"
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? (
                    <p className="caption-mono mt-2 text-warning">{errors.name}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="email" className={field}>
                    {t("fieldEmail")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="field-line"
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? (
                    <p className="caption-mono mt-2 text-warning">{errors.email}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="message" className={field}>
                    {t("fieldMessage")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="field-line resize-none"
                    value={values.message}
                    onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message ? (
                    <p className="caption-mono mt-2 text-warning">{errors.message}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-12 flex items-center gap-4">
                <button type="submit" className="btn-outline inline-flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>{t("send")}</span>
                </button>
              </div>
              <p aria-live="polite" className="caption-mono mt-5 text-success">
                {sent ? t("sent") : ""}
              </p>
            </form>
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
              <p className="caption-mono text-muted mb-3">{c.cvDownloadTitle}</p>
              <button
                type="button"
                onClick={() => downloadCvPdf(lang)}
                className="btn-outline text-xs inline-flex items-center gap-2 w-full justify-center"
              >
                <Download className="size-3.5" />
                <span>{c.cvDownloadBtn}</span>
              </button>
            </div>

            <p className="body-sm mt-10 text-muted">{identity.location[lang]}</p>
          </aside>
        </div>
      </section>
    </Page>
  );
}
