import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Page, PageHeader } from "@/components/site-chrome";
import { identity } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Blaise Tappa" },
      {
        name: "description",
        content:
          "Contact Blaise Tappa: Werkstudent position 20 h/week, remote or hybrid, available immediately. Freelance enquiries welcome.",
      },
      { property: "og:title", content: "Contact — Blaise Tappa" },
      {
        property: "og:description",
        content: "Available immediately for Werkstudent roles and freelance work in Germany.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useLang();
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
      `Portfolio enquiry — ${values.name}`,
    )}&body=${encodeURIComponent(`${values.message}\n\n${values.name} — ${values.email}`)}`;
  }

  const field = "caption-mono block";

  return (
    <Page>
      <PageHeader title={t("contactTitle")} intro={t("contactIntro")} />

      <section className="section-y">
        <div className="shell grid gap-16 lg:grid-cols-[1fr_320px]">
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
                {errors.name ? <p className="caption-mono mt-2 text-warning">{errors.name}</p> : null}
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
                {errors.email ? <p className="caption-mono mt-2 text-warning">{errors.email}</p> : null}
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

            <button type="submit" className="btn-outline mt-12">
              {t("send")}
            </button>
            <p aria-live="polite" className="caption-mono mt-5 text-success">
              {sent ? t("sent") : ""}
            </p>
          </form>

          <aside>
            <p className="caption-mono">{t("direct")}</p>
            <ul className="mt-6 space-y-4">
              <li>
                <a href={`mailto:${identity.email}`} className="body-md text-link hover:opacity-70">
                  {identity.email}
                </a>
              </li>
              <li>
                <a
                  href={identity.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="body-md text-link hover:opacity-70"
                >
                  linkedin.com/in/blaise-tappa
                </a>
              </li>
              <li>
                <a
                  href={identity.github}
                  target="_blank"
                  rel="noreferrer"
                  className="body-md text-link hover:opacity-70"
                >
                  github.com/BlaiseTAPPA
                </a>
              </li>
            </ul>
            <p className="body-sm mt-10">{identity.location}</p>
          </aside>
        </div>
      </section>
    </Page>
  );
}
