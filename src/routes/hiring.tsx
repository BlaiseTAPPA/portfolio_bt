import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Page, PageHeader } from "@/components/site-chrome";
import { useLang } from "@/lib/i18n";
import { shortlistRole } from "@/lib/shortlist.functions";
import { experience, skills, languages, projects } from "@/lib/content";

export const Route = createFileRoute("/hiring")({
  head: () => ({
    meta: [
      { title: "Hiring — Blaise Tappa" },
      {
        name: "description",
        content:
          "Describe a role and get an AI-generated shortlist of Blaise Tappa's most relevant skills and experience, in English or German.",
      },
      { property: "og:title", content: "Hiring — Blaise Tappa" },
      {
        property: "og:description",
        content: "Describe a role and get a shortlist of the most relevant skills and experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Hiring,
});

type Kind = "experience" | "project" | "skill" | "education" | "language";
type Item = { kind: Kind; ref: string; label: string; why: string };

const kindLabel: Record<"en" | "de", Record<Kind, string>> = {
  en: { experience: "Experience", project: "Project", skill: "Skill", education: "Education", language: "Language" },
  de: { experience: "Erfahrung", project: "Projekt", skill: "Kenntnis", education: "Ausbildung", language: "Sprache" },
};
const cvHash: Record<Kind, string> = {
  experience: "experience", project: "projects", skill: "skills", education: "education", language: "languages",
};

const copy = {
  en: {
    eyebrow: "For recruiters",
    title: "Hiring",
    intro:
      "Describe the role you are filling — a Werkstudent position, a freelance project, anything. An AI shortlists the skills and experience from my background that fit it best, using only the facts on this site.",
    label: "The role",
    placeholder:
      "e.g. Werkstudent frontend developer, 20 h/week, React and TypeScript, German-speaking team…",
    submit: "Shortlist my fit",
    loading: "Shortlisting…",
    tooShort: "Please write at least 15 characters.",
    results: "Most relevant",
    none: "No close match in my background — but feel free to get in touch anyway.",
    cta: "Get in touch",
    cv: "View full CV",
    background: "Professional background",
    fullCv: "Full CV",
    skills: "Key skills",
    usedIn: "projects",
    projects: "Relevant case studies",
    allProjects: "All projects",
    viewCase: "View case study",
    viewCv: "See in CV",
  },
  de: {
    eyebrow: "Für Recruiter",
    title: "Einstellung",
    intro:
      "Beschreiben Sie die Rolle, die Sie besetzen möchten — Werkstudentenstelle, Freelance-Projekt, ganz gleich. Eine KI stellt eine Shortlist der passendsten Fähigkeiten und Erfahrungen aus meinem Werdegang zusammen — nur auf Basis der Fakten dieser Seite.",
    label: "Die Rolle",
    placeholder:
      "z. B. Werkstudent Frontend-Entwicklung, 20 Std./Woche, React und TypeScript, deutschsprachiges Team…",
    submit: "Passung prüfen",
    loading: "Shortlist wird erstellt…",
    tooShort: "Bitte mindestens 15 Zeichen eingeben.",
    results: "Am relevantesten",
    none: "Keine direkte Übereinstimmung in meinem Werdegang — melden Sie sich trotzdem gern.",
    cta: "Kontakt aufnehmen",
    cv: "Lebenslauf ansehen",
    background: "Beruflicher Werdegang",
    fullCv: "Vollständiger Lebenslauf",
    skills: "Kernkompetenzen",
    usedIn: "Projekte",
    projects: "Relevante Fallstudien",
    allProjects: "Alle Projekte",
    viewCase: "Fallstudie ansehen",
    viewCv: "Im Lebenslauf ansehen",
  },
};

function Hiring() {
  const { lang } = useLang();
  const c = copy[lang];
  const run = useServerFn(shortlistRole);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [summary, setSummary] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role.trim().length < 15) return setError(c.tooShort);
    setLoading(true);
    setError(null);
    setItems(null);
    setSummary("");
    try {
      const res = await run({ data: { role, lang } });
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

  return (
    <Page>
      <PageHeader title={c.title} intro={c.intro} eyebrow={c.eyebrow} />

      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <form onSubmit={onSubmit} noValidate>
              <label htmlFor="hiring-role" className="caption-mono block">
                {c.label}
              </label>
              <textarea
                id="hiring-role"
                rows={5}
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
              <button type="submit" className="btn-outline mt-8" disabled={loading}>
                {loading ? c.loading : c.submit}
              </button>
            </form>
          </div>

          <div aria-live="polite">
            {items && (
              <div>
                <p className="caption-mono">{c.results}</p>
                {summary && <p className="body-md mt-4">{summary}</p>}
                {items.length === 0 ? (
                  !summary && <p className="body-md mt-4">{c.none}</p>
                ) : (
                  <ol className="mt-6 border-y border-hairline">
                    {items.map((item, i) => (
                      <li
                        key={item.kind + item.ref}
                        className="rise grid gap-4 border-b border-hairline py-6 last:border-b-0 md:grid-cols-[48px_1fr]"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <span className="caption-mono text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="caption-mono text-muted">{kindLabel[lang][item.kind]}</p>
                          <p className="title-md mt-2">{item.label}</p>
                          <p className="body-sm mt-2">{item.why}</p>
                          {item.kind === "project" ? (
                            <Link to="/projects/$slug" params={{ slug: item.ref }} className="link-mono mt-3 inline-block">
                              {c.viewCase} →
                            </Link>
                          ) : (
                            <Link to="/cv" hash={cvHash[item.kind]} className="link-mono mt-3 inline-block">
                              {c.viewCv} →
                            </Link>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link to="/contact" className="btn-outline inline-block">
                    {c.cta}
                  </Link>
                  <Link to="/cv" className="btn-ghost inline-block">
                    {c.cv}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="caption-mono">01</p>
              <h2 className="display-sm mt-3">{c.background}</h2>
            </div>
            <Link to="/cv" hash="experience" className="link-mono">{c.fullCv} →</Link>
          </div>
          <ol className="mt-10 border-y border-hairline">
            {experience.map((r) => (
              <li key={r.company} className="grid gap-3 border-b border-hairline py-8 last:border-b-0 md:grid-cols-[1fr_2fr_auto]">
                <p className="title-md">{r.company}</p>
                <div>
                  <p className="caption-mono text-muted">{r.title[lang]}</p>
                  <p className="body-sm mt-2">{r.points[lang][0]}</p>
                </div>
                <span className="caption-mono md:text-right">{r.period}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="shell">
          <p className="caption-mono">02</p>
          <h2 className="display-sm mt-3">{c.skills}</h2>
          <ul className="mt-10 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s) => (
              <li key={s} className="bg-canvas p-6">
                <p className="title-md">{s}</p>
                <p className="caption-mono mt-3 text-muted">
                  {projects.filter((p) => p.stack.some((x) => s.toLowerCase().includes(x.toLowerCase()) || x.toLowerCase().includes(s.toLowerCase()))).length || "—"}{" "}
                  {c.usedIn}
                </p>
              </li>
            ))}
            {languages.map((l) => (
              <li key={l.name.en} className="bg-canvas p-6">
                <p className="title-md">{l.name[lang]}</p>
                <p className="caption-mono mt-3 text-muted">{l.level[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="shell">
          <p className="caption-mono">03</p>
          <h2 className="display-sm mt-3">{c.projects}</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <Link key={p.slug} to="/projects/$slug" params={{ slug: p.slug }} className="group block">
                <img src={p.image} alt={p.name} loading="lazy" width={1600} height={900} className="aspect-[16/9] w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="mt-4 flex items-baseline justify-between">
                  <p className="title-md">{p.name}</p>
                  <span className="caption-mono">{p.year}</span>
                </div>
                <p className="body-sm mt-2">{p.excerpt[lang]}</p>
                <p className="caption-mono mt-3 text-muted">{p.stack.slice(0, 3).join(" · ")}</p>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/projects" className="btn-outline">{c.allProjects}</Link>
            <Link to="/cv" className="btn-ghost">{c.fullCv}</Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
