import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { projects } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { matchProjects } from "@/lib/matcher.functions";

type Match = { slug: string; reason: string };

const copy = {
  en: {
    eyebrow: "Project matcher",
    title: "Describe what you need",
    intro:
      "Tell me about your project in a few sentences. An AI-powered matcher will point you to the most relevant case studies.",
    label: "Your project",
    placeholder: "e.g. We need a dashboard that shows live data and uses AI to summarise it…",
    submit: "Find relevant work",
    loading: "Matching…",
    tooShort: "Please write at least 15 characters.",
    results: "Recommended case studies",
    none: "No close match — get in touch and let's talk it through.",
    view: "View case study",
  },
  de: {
    eyebrow: "Projekt-Matcher",
    title: "Beschreiben Sie Ihr Vorhaben",
    intro:
      "Erzählen Sie in ein paar Sätzen von Ihrem Projekt. Ein KI-gestützter Matcher zeigt Ihnen die passendsten Fallstudien.",
    label: "Ihr Projekt",
    placeholder: "z. B. Wir brauchen ein Dashboard mit Live-Daten und KI-Zusammenfassungen…",
    submit: "Passende Arbeiten finden",
    loading: "Suche läuft…",
    tooShort: "Bitte mindestens 15 Zeichen eingeben.",
    results: "Empfohlene Fallstudien",
    none: "Keine direkte Übereinstimmung — schreiben Sie mir, wir besprechen es.",
    view: "Fallstudie ansehen",
  },
};

export function ProjectMatcher() {
  const { lang } = useLang();
  const c = copy[lang];
  const run = useServerFn(matchProjects);
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[] | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (brief.trim().length < 15) return setError(c.tooShort);
    setLoading(true);
    setError(null);
    setMatches(null);
    try {
      const res = await run({ data: { brief, lang } });
      if (res.ok) setMatches(res.matches);
      else setError(res.error);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-y border-t border-hairline" aria-labelledby="matcher-title">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="caption-mono">{c.eyebrow}</p>
          <h2 id="matcher-title" className="display-md mt-4">
            {c.title}
          </h2>
          <p className="body-md mt-6 text-body">{c.intro}</p>
        </div>
        <div>
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="matcher-brief" className="caption-mono block">
              {c.label}
            </label>
            <textarea
              id="matcher-brief"
              rows={4}
              maxLength={1500}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
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

          <div aria-live="polite">
            {matches && (
              <div className="mt-12">
                <p className="caption-mono">{c.results}</p>
                {matches.length === 0 ? (
                  <p className="body-md mt-4">
                    {c.none}{" "}
                  </p>
                ) : (
                  <ul className="mt-4">
                    {matches.map((m) => {
                      const p = projects.find((x) => x.slug === m.slug)!;
                      return (
                        <li key={m.slug} className="border-b border-hairline py-6">
                          <div className="flex items-baseline justify-between gap-4">
                            <h3 className="title-md">{p.name}</h3>
                            <span className="caption-mono">{p.year}</span>
                          </div>
                          <p className="body-sm mt-3">{m.reason}</p>
                          <Link
                            to="/projects/$slug"
                            params={{ slug: m.slug }}
                            className="link-mono mt-4 inline-block"
                          >
                            {c.view}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
