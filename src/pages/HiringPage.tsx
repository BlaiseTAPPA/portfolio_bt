import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Calendar, Download, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Page, PageHeader } from "@/components/site-chrome";
import { useLang } from "@/lib/i18n";
import { shortlistRole, type ShortlistKind, type ShortlistItem } from "@/lib/shortlist.functions";
import { experience, skills, languages, projects, identity } from "@/lib/content";
import { downloadCvPdf } from "@/lib/cv-pdf";

const kindLabel: Record<"en" | "de" | "fr", Record<ShortlistKind, string>> = {
  en: {
    experience: "Experience",
    project: "Project",
    skill: "Skill",
    education: "Education",
    language: "Language",
  },
  de: {
    experience: "Erfahrung",
    project: "Projekt",
    skill: "Kenntnis",
    education: "Ausbildung",
    language: "Sprache",
  },
  fr: {
    experience: "Expérience",
    project: "Projet",
    skill: "Compétence",
    education: "Formation",
    language: "Langue",
  },
};

const cvHash: Record<ShortlistKind, string> = {
  experience: "experience",
  project: "projects",
  skill: "skills",
  education: "education",
  language: "languages",
};

const copy = {
  en: {
    eyebrow: "For recruiters",
    title: "Hiring",
    intro:
      "Describe the role you are filling — a Werkstudent position, a freelance project, anything. An AI shortlists the skills and experience from my background that fit it best, using only the facts on this site.",
    label: "The role description",
    placeholder:
      "e.g. Werkstudent frontend developer, 20 h/week, React and TypeScript, German-speaking team…",
    submit: "Shortlist my fit",
    loading: "Shortlisting qualifications…",
    tooShort: "Please write at least 15 characters.",
    results: "Most relevant qualifications",
    none: "No close match in my background — but feel free to get in touch anyway.",
    cta: "Contact form",
    cv: "View online CV",
    bookMeeting: "Book 15-min call",
    downloadPdf: "Download CV (PDF)",
    background: "Professional background",
    fullCv: "Full CV",
    skills: "Key skills",
    usedIn: "projects",
    projects: "Relevant case studies",
    allProjects: "All projects",
    viewCase: "View case study",
    viewCv: "See in CV",
    chipsLabel: "1-Click recruiter presets:",
    chips: [
      "Werkstudent Frontend Developer (React, TypeScript, 20h/week)",
      "Full-Stack Next.js Developer for real-time dashboards & AI",
      "Frontend Engineer focused on Web Vitals, a11y & design systems",
      "Freelance mission: Interface redesign & component architecture",
    ],
  },
  de: {
    eyebrow: "Für Recruiter",
    title: "Einstellung",
    intro:
      "Beschreiben Sie die Rolle, die Sie besetzen möchten — Werkstudentenstelle, Freelance-Projekt, ganz gleich. Eine KI stellt eine Shortlist der passendsten Fähigkeiten und Erfahrungen aus meinem Werdegang zusammen — nur auf Basis der Fakten dieser Seite.",
    label: "Die Stellenbeschreibung",
    placeholder:
      "z. B. Werkstudent Frontend-Entwicklung, 20 Std./Woche, React und TypeScript, deutschsprachiges Team…",
    submit: "Passung prüfen",
    loading: "Qualifikationen werden abgeglichen…",
    tooShort: "Bitte mindestens 15 Zeichen eingeben.",
    results: "Am relevantesten",
    none: "Keine direkte Übereinstimmung in meinem Werdegang — melden Sie sich trotzdem gern.",
    cta: "Kontaktformular",
    cv: "Online-Lebenslauf",
    bookMeeting: "15-Min.-Termin buchen",
    downloadPdf: "Lebenslauf als PDF",
    background: "Beruflicher Werdegang",
    fullCv: "Vollständiger Lebenslauf",
    skills: "Kernkompetenzen",
    usedIn: "Projekte",
    projects: "Relevante Fallstudien",
    allProjects: "Alle Projekte",
    viewCase: "Fallstudie ansehen",
    viewCv: "Im Lebenslauf ansehen",
    chipsLabel: "Recruiter-Presets mit 1 Klick:",
    chips: [
      "Werkstudent Frontend-Entwicklung (React, TypeScript, 20 Std./Woche)",
      "Full-Stack Next.js Entwickler für Echtzeit-Dashboards & KI",
      "Frontend Engineer mit Fokus auf Performance & Design-Systeme",
      "Freelance-Projekt: Interface-Redesign und Architektur-Modernisierung",
    ],
  },
  fr: {
    eyebrow: "Pour recruteurs",
    title: "Recrutement",
    intro:
      "Décrivez le poste ou la mission à pourvoir — contrat étudiant (Werkstudent), mission freelance ou rôle frontend. Une IA sélectionne les compétences et réalisations les plus adaptées de mon parcours, uniquement d'après les faits de ce site.",
    label: "La fiche de poste ou besoin",
    placeholder:
      "ex. Développeur Frontend React / TypeScript en contrat étudiant 20h/semaine, équipe internationale...",
    submit: "Évaluer l'adéquation",
    loading: "Évaluation des compétences…",
    tooShort: "Veuillez saisir au moins 15 caractères.",
    results: "Profil & compétences les plus pertinents",
    none: "Pas de correspondance directe dans mon parcours — contactez-moi tout de même pour échanger.",
    cta: "Formulaire de contact",
    cv: "Voir le CV en ligne",
    bookMeeting: "Planifier un échange de 15 min",
    downloadPdf: "Télécharger le CV (PDF)",
    background: "Parcours professionnel",
    fullCv: "CV complet",
    skills: "Compétences clés",
    usedIn: "projets",
    projects: "Études de cas pertinentes",
    allProjects: "Tous les projets",
    viewCase: "Voir l'étude de cas",
    viewCv: "Voir dans le CV",
    chipsLabel: "Profils types pour recruteurs :",
    chips: [
      "Werkstudent Développeur Frontend React / TypeScript (20h/semaine)",
      "Développeur Full-Stack Next.js (Dashboard temps réel & IA)",
      "Ingénieur Frontend (Performance web, accessibilité & Design System)",
      "Mission freelance : Refonte d'interface et modernisation de stack",
    ],
  },
};

export function HiringPage() {
  const { lang } = useLang();
  const c = copy[lang];
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ShortlistItem[] | null>(null);
  const [summary, setSummary] = useState("");

  async function executeShortlist(targetRole: string) {
    if (targetRole.trim().length < 15) return setError(c.tooShort);
    setLoading(true);
    setError(null);
    setItems(null);
    setSummary("");
    try {
      const res = await shortlistRole({ data: { role: targetRole, lang } });
      if (res.ok) {
        setSummary(res.summary);
        setItems(res.items);
      } else setError(res.error);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void executeShortlist(role);
  }

  function onChipSelect(chip: string) {
    setRole(chip);
    void executeShortlist(chip);
  }

  return (
    <Page>
      <PageHeader title={c.title} intro={c.intro} eyebrow={c.eyebrow} />

      {/* Recruiter Quick Actions Bar */}
      <section className="border-b border-hairline py-6 bg-surface-soft/40">
        <div className="shell flex flex-wrap items-center justify-between gap-4">
          <p className="caption-mono text-muted flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>20 h / week · Werkstudent & Freelance · Germersheim / Remote</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={identity.calendar}
              target="_blank"
              rel="noreferrer"
              className="btn-outline bg-ink text-canvas text-xs inline-flex items-center gap-2 py-2 px-4"
            >
              <Calendar className="size-3.5" />
              <span>{c.bookMeeting}</span>
              <ExternalLink className="size-3 opacity-60" />
            </a>
            <button
              type="button"
              onClick={() => downloadCvPdf(lang)}
              className="btn-outline text-xs inline-flex items-center gap-2 py-2 px-4"
            >
              <Download className="size-3.5" />
              <span>{c.downloadPdf}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="mb-6">
              <span className="caption-mono block mb-2">{c.chipsLabel}</span>
              <div className="flex flex-col gap-2">
                {c.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={loading}
                    onClick={() => onChipSelect(chip)}
                    className={`text-left p-2.5 border text-xs font-mono transition-all flex items-start gap-2 ${
                      role === chip
                        ? "border-ink bg-surface-card text-ink"
                        : "border-hairline text-muted hover:border-ink hover:text-ink bg-surface-soft/40"
                    }`}
                  >
                    <Sparkles className="size-3.5 mt-0.5 shrink-0 opacity-70" />
                    <span>{chip}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate>
              <label htmlFor="hiring-role" className="caption-mono block">
                {c.label}
              </label>
              <textarea
                id="hiring-role"
                rows={4}
                maxLength={1500}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder={c.placeholder}
                className="field-line mt-3 w-full resize-none"
              />
              {error && (
                <p role="alert" className="body-sm mt-3 text-warning">
                  {error}
                </p>
              )}
              <div className="mt-8 flex items-center gap-4">
                <button type="submit" className="btn-outline" disabled={loading}>
                  {loading ? c.loading : c.submit}
                </button>
                {loading && (
                  <span className="inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-widest animate-pulse">
                    <span className="size-2 rounded-full bg-emerald-400 inline-block" />
                    AI Analyzing Fit…
                  </span>
                )}
              </div>
            </form>
          </div>

          <div aria-live="polite">
            <AnimatePresence mode="wait">
              {items && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="caption-mono text-muted flex items-center gap-2">
                    <Sparkles className="size-3 text-ink" />
                    {c.results}
                  </p>
                  {summary && (
                    <div className="mt-4 p-5 border border-hairline bg-surface-soft/30">
                      <p className="body-md text-body-strong leading-relaxed">{summary}</p>
                    </div>
                  )}
                  {items.length === 0 ? (
                    !summary && <p className="body-md mt-4">{c.none}</p>
                  ) : (
                    <ol className="mt-6 border-y border-hairline">
                      {items.map((item, i) => (
                        <motion.li
                          key={item.kind + item.ref}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          className="grid gap-4 border-b border-hairline py-6 last:border-b-0 md:grid-cols-[48px_1fr]"
                        >
                          <span className="caption-mono text-muted">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="caption-mono text-muted">{kindLabel[lang][item.kind]}</p>
                            <p className="title-md mt-2">{item.label}</p>
                            <p className="body-sm mt-2">{item.why}</p>
                            {item.kind === "project" ? (
                              <Link
                                to={`/projects/${item.ref}`}
                                className="link-mono mt-3 inline-flex items-center gap-1.5"
                              >
                                <span>{c.viewCase}</span>
                                <ArrowRight className="size-3" />
                              </Link>
                            ) : (
                              <Link
                                to={`/cv#${cvHash[item.kind]}`}
                                className="link-mono mt-3 inline-flex items-center gap-1.5"
                              >
                                <span>{c.viewCv}</span>
                                <ArrowRight className="size-3" />
                              </Link>
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  )}
                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <a
                      href={identity.calendar}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline bg-ink text-canvas inline-flex items-center justify-center gap-2 px-6 py-3 text-center leading-normal"
                    >
                      <Calendar className="size-4" />
                      <span>{c.bookMeeting}</span>
                      <ExternalLink className="size-3.5 opacity-60" />
                    </a>
                    <button
                      type="button"
                      onClick={() => downloadCvPdf(lang)}
                      className="btn-outline inline-flex items-center justify-center gap-2 px-6 py-3 text-center leading-normal"
                    >
                      <Download className="size-4" />
                      <span>{c.downloadPdf}</span>
                    </button>
                    <Link
                      to="/contact"
                      className="btn-outline inline-flex items-center justify-center px-6 py-3 text-center leading-normal"
                    >
                      {c.cta}
                    </Link>
                    <Link
                      to="/cv"
                      className="btn-ghost inline-flex items-center justify-center px-6 py-3 text-center leading-normal"
                    >
                      {c.cv}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Static quick view sections for reference */}
      <section className="section-y border-t border-hairline">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="caption-mono">01</p>
            <h2 className="display-sm mt-4">{c.background}</h2>
          </div>
          <div>
            <ol className="border-t border-hairline">
              {experience.map((role_) => (
                <li
                  key={role_.company}
                  className="grid gap-4 border-b border-hairline py-6 md:grid-cols-[200px_1fr]"
                >
                  <div>
                    <p className="title-md">{role_.company}</p>
                    <p className="caption-mono mt-1">{role_.period}</p>
                  </div>
                  <div>
                    <p className="body-md text-ink">{role_.title[lang]}</p>
                    <ul className="mt-4 space-y-2">
                      {role_.points[lang].map((pt) => (
                        <li key={pt} className="body-sm text-body">
                          • {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/cv#experience" className="link-mono mt-6 inline-block">
              {c.fullCv} →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="caption-mono">02</p>
            <h2 className="display-sm mt-4">{c.skills}</h2>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="border border-hairline px-3 py-1 font-mono text-xs">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-8 border-t border-hairline pt-6">
              <p className="caption-mono text-muted mb-4">{"Languages"}</p>
              <div className="flex flex-wrap gap-4">
                {languages.map((l) => (
                  <span key={l.name.en} className="body-sm">
                    <strong>{l.name[lang]}:</strong> {l.level[lang]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="caption-mono">03</p>
            <h2 className="display-sm mt-4">{c.projects}</h2>
          </div>
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="group block border border-hairline p-5 transition-colors hover:border-ink"
                >
                  <p className="title-md">{p.name}</p>
                  <p className="caption-mono mt-1">{p.year}</p>
                  <p className="body-sm mt-3 text-muted">{p.excerpt[lang]}</p>
                  <span className="link-mono mt-4 inline-block group-hover:text-ink">
                    {c.viewCase} →
                  </span>
                </Link>
              ))}
            </div>
            <Link to="/projects" className="link-mono mt-6 inline-block">
              {c.allProjects} →
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
