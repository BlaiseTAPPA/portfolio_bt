import { Link } from "react-router-dom";
import { Download, Calendar, Printer, ExternalLink, ArrowLeft } from "lucide-react";
import { Page } from "@/components/site-chrome";
import { useLang } from "@/lib/i18n";
import { identity, skills, experience, education, languages, projects } from "@/lib/content";
import { downloadCvPdf } from "@/lib/cv-pdf";

const copy = {
  en: {
    eyebrow: "Curriculum vitae",
    experience: "Professional experience",
    skills: "Skills",
    projects: "Selected projects",
    education: "Education",
    languages: "Languages",
    contact: "Contact",
    print: "Print format",
    downloadPdf: "Download PDF",
    bookMeeting: "Book 15-min call",
    back: "Back to hiring",
    onlineProfile: "View on portfolio",
  },
  de: {
    eyebrow: "Lebenslauf",
    experience: "Berufserfahrung",
    skills: "Kenntnisse",
    projects: "Ausgewählte Projekte",
    education: "Ausbildung",
    languages: "Sprachen",
    contact: "Kontakt",
    print: "Druckansicht",
    downloadPdf: "PDF herunterladen",
    bookMeeting: "15-Min.-Termin buchen",
    back: "Zurück zu Recruiting",
    onlineProfile: "Im Portfolio ansehen",
  },
  fr: {
    eyebrow: "Curriculum vitæ",
    experience: "Expérience professionnelle",
    skills: "Compétences techniques",
    projects: "Projets sélectionnés",
    education: "Formation & Diplômes",
    languages: "Langues",
    contact: "Contact",
    print: "Format impression",
    downloadPdf: "Télécharger le PDF",
    bookMeeting: "Planifier 15 min d'échange",
    back: "Retour à l'espace recrutement",
    onlineProfile: "Voir sur le portfolio",
  },
};

function Row({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 grid gap-6 border-t border-hairline py-12 md:grid-cols-[220px_1fr]"
    >
      <h2 className="caption-mono">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function CvPage() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <Page>
      <div className="shell pt-40 pb-24">
        <p className="caption-mono">{c.eyebrow}</p>
        <h1 className="display-lg mt-4">{identity.name}</h1>
        <p className="title-md mt-4">{identity.role[lang]}</p>
        <p className="body-sm mt-2 text-muted">{identity.location}</p>

        {/* Action bar for recruiters & visitors */}
        <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => downloadCvPdf(lang)}
            className="btn-outline bg-ink text-canvas inline-flex items-center gap-2"
          >
            <Download className="size-4" />
            <span>{c.downloadPdf}</span>
          </button>
          <a
            href={identity.calendar}
            target="_blank"
            rel="noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <Calendar className="size-4" />
            <span>{c.bookMeeting}</span>
            <ExternalLink className="size-3.5 opacity-60" />
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-outline inline-flex items-center gap-2"
          >
            <Printer className="size-4" />
            <span>{c.print}</span>
          </button>
          <Link to="/hiring" className="btn-ghost inline-flex items-center gap-1.5 ml-auto">
            <ArrowLeft className="size-3.5" />
            <span>{c.back}</span>
          </Link>
        </div>

        <div className="mt-16">
          <Row id="experience" title={c.experience}>
            <ul className="space-y-10">
              {experience.map((r) => (
                <li key={r.company}>
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <p className="title-md">{r.company}</p>
                    <span className="caption-mono">{r.period}</span>
                  </div>
                  <p className="caption-mono mt-2 text-muted">{r.title[lang]}</p>
                  <ul className="mt-4 space-y-2">
                    {r.points[lang].map((p) => (
                      <li key={p} className="body-sm">
                        — {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Row>
          <Row id="skills" title={c.skills}>
            <ul className="flex flex-wrap gap-3">
              {skills.map((s) => (
                <li key={s} className="caption-mono border border-hairline-strong px-4 py-2">
                  {s}
                </li>
              ))}
            </ul>
          </Row>
          <Row id="projects" title={c.projects}>
            <ul className="space-y-6">
              {projects.map((p) => (
                <li key={p.slug}>
                  <div className="flex items-baseline justify-between gap-4">
                    <Link to={`/projects/${p.slug}`} className="title-md hover:underline">
                      {p.name}
                    </Link>
                    <span className="caption-mono">{p.year}</span>
                  </div>
                  <p className="body-sm mt-2">{p.excerpt[lang]}</p>
                  <p className="caption-mono mt-2 text-muted">{p.stack.slice(0, 5).join(" · ")}</p>
                </li>
              ))}
            </ul>
          </Row>
          <Row id="education" title={c.education}>
            <ul className="space-y-4">
              {education.map((e) => (
                <li key={e.school} className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="title-md">{e.school}</p>
                    <p className="body-sm mt-1">{e.detail[lang]}</p>
                  </div>
                  <span className="caption-mono">{e.period}</span>
                </li>
              ))}
            </ul>
          </Row>
          <Row id="languages" title={c.languages}>
            <ul className="space-y-3">
              {languages.map((l) => (
                <li key={l.name.en} className="flex items-baseline justify-between gap-4">
                  <span className="title-md">{l.name[lang]}</span>
                  <span className="caption-mono">{l.level[lang]}</span>
                </li>
              ))}
            </ul>
          </Row>
          <Row id="contact" title={c.contact}>
            <ul className="space-y-2">
              <li>
                <a className="link-mono" href={`mailto:${identity.email}`}>
                  {identity.email}
                </a>
              </li>
              <li>
                <a className="link-mono" href={identity.calendar} target="_blank" rel="noreferrer">
                  Cal.com (15 min call)
                </a>
              </li>
              <li>
                <a className="link-mono" href={identity.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a className="link-mono" href={identity.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </Row>
        </div>
      </div>
    </Page>
  );
}
