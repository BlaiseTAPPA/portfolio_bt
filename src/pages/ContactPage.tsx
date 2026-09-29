import { useState, type FormEvent } from "react";
import { Calendar, Download, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { Page, PageHeader } from "@/components/site-chrome";
import { identity } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { downloadCvPdf } from "@/lib/cv-pdf";

const copy = {
  en: {
    bookingEyebrow: "Fastest way to connect",
    bookingTitle: "Schedule a 15-min intro call",
    bookingIntro:
      "Skip the back-and-forth emails. Pick a 15-minute slot directly on my calendar for an informal introduction, Werkstudent opportunity, or project briefing.",
    bookingBtn: "Book 15-min meeting",
    bookingDetails: "15 min · Video call (Google Meet) · No commitment",
    cvDownloadTitle: "Need my résumé right away?",
    cvDownloadBtn: "Download CV (PDF)",
    orWriteForm: "Or send a message below:",
  },
  de: {
    bookingEyebrow: "Schnellster Weg zum Austausch",
    bookingTitle: "15-Minuten-Kennenlerngespräch vereinbaren",
    bookingIntro:
      "Sparen Sie sich das E-Mail-Pingpong. Wählen Sie direkt einen passenden 15-Minuten-Slot in meinem Kalender für ein erstes Kennenlernen oder Projekt-Briefing.",
    bookingBtn: "15-Minuten-Termin buchen",
    bookingDetails: "15 Min. · Videocall (Google Meet) · Unverbindlich",
    cvDownloadTitle: "Lebenslauf direkt herunterladen?",
    cvDownloadBtn: "Lebenslauf als PDF laden",
    orWriteForm: "Oder schreiben Sie mir über das Formular:",
  },
  fr: {
    bookingEyebrow: "Le moyen le plus rapide d'échanger",
    bookingTitle: "Planifier un échange de 15 minutes",
    bookingIntro:
      "Évitez les allers-retours par e-mail. Réservez directement un créneau de 15 minutes dans mon agenda pour faire connaissance, échanger sur un poste étudiant ou cadrer un projet.",
    bookingBtn: "Choisir un créneau de 15 min",
    bookingDetails: "15 min · Visioconférence (Google Meet) · Sans engagement",
    cvDownloadTitle: "Besoin de mon CV immédiatement ?",
    cvDownloadBtn: "Télécharger le CV (PDF)",
    orWriteForm: "Ou envoyez-moi un message via le formulaire :",
  },
};

export function ContactPage() {
  const { t, lang } = useLang();
  const c = copy[lang];
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

      {/* Prominent Direct Calendar Booking Banner */}
      <section className="border-b border-hairline py-12 bg-surface-soft/30">
        <div className="shell">
          <div className="border border-hairline p-8 md:p-10 bg-canvas flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="caption-mono text-muted flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-ink" />
                {c.bookingEyebrow}
              </span>
              <h2 className="display-sm">{c.bookingTitle}</h2>
              <p className="body-md mt-3 text-body">{c.bookingIntro}</p>
              <p className="caption-mono mt-4 text-muted">{c.bookingDetails}</p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4">
              <a
                href={identity.calendar}
                target="_blank"
                rel="noreferrer"
                className="btn-outline bg-ink text-canvas inline-flex items-center justify-center gap-2.5 py-4 px-6 text-center leading-normal"
              >
                <span>{c.bookingBtn}</span>
                <ExternalLink className="size-4" />
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
                  href={identity.calendar}
                  target="_blank"
                  rel="noreferrer"
                  className="body-md text-link hover:opacity-70 inline-flex items-center gap-2"
                >
                  <Calendar className="size-4 opacity-70" />
                  <span>cal.com/blaise-tappa</span>
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

            <p className="body-sm mt-10 text-muted">{identity.location}</p>
          </aside>
        </div>
      </section>
    </Page>
  );
}
