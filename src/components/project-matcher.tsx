import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    loading: "Analyzing architectures…",
    tooShort: "Please write at least 15 characters.",
    results: "Recommended case studies",
    none: "No close match — get in touch and let's talk it through.",
    view: "View case study",
    chipsLabel: "Try sample project briefs:",
    chips: [
      "Real-time financial dashboard with alerts and WebSocket feeds",
      "AI spatial floor plan visualizer with multimodal computer vision",
      "German fuel station finder with route corridor queries and maps",
      "SSR-first cohort learning platform with zero-dependency ICS export",
    ],
  },
  de: {
    eyebrow: "Projekt-Matcher",
    title: "Beschreiben Sie Ihr Vorhaben",
    intro:
      "Erzählen Sie in ein paar Sätzen von Ihrem Projekt. Ein KI-gestützter Matcher zeigt Ihnen die passendsten Fallstudien.",
    label: "Ihr Projekt",
    placeholder: "z. B. Wir brauchen ein Dashboard mit Live-Daten und KI-Zusammenfassungen…",
    submit: "Passende Arbeiten finden",
    loading: "Architekturen werden analysiert…",
    tooShort: "Bitte mindestens 15 Zeichen eingeben.",
    results: "Empfohlene Fallstudien",
    none: "Keine direkte Übereinstimmung — schreiben Sie mir, wir besprechen es.",
    view: "Fallstudie ansehen",
    chipsLabel: "Beispiel-Anforderungen ausprobieren:",
    chips: [
      "Echtzeit-Finanzdashboard mit Live-Alerts und WebSocket-Daten",
      "KI-Grundriss-Visualisierer mit multimodaler Bildanalyse",
      "Spritpreisfinder für Deutschland mit Routensuche und Karten",
      "E-Learning-Plattform mit SSR-first und ICS-Kalendergenerator",
    ],
  },
  fr: {
    eyebrow: "Sélecteur de projet",
    title: "Décrivez votre besoin",
    intro:
      "Expliquez votre projet en quelques phrases. Un système assisté par IA sélectionne les réalisations les plus adaptées de mon portfolio.",
    label: "Votre projet",
    placeholder:
      "ex. Nous avons besoin d'un dashboard de données en temps réel avec résumés intelligents générés par IA…",
    submit: "Trouver les projets pertinents",
    loading: "Analyse des architectures…",
    tooShort: "Veuillez saisir au moins 15 caractères.",
    results: "Études de cas recommandées",
    none: "Pas de correspondance directe — contactez-moi pour en discuter de vive voix.",
    view: "Voir l'étude de cas",
    chipsLabel: "Tester un cahier des charges type en 1 clic :",
    chips: [
      "Dashboard boursier temps réel avec alertes et WebSockets",
      "Visualiseur de plans d'étage par vision IA multimodale",
      "Comparateur de prix de carburant avec recherche par corridor routier",
      "Plateforme e-learning SSR-first avec générateur d'agendas ICS",
    ],
  },
};

export function ProjectMatcher() {
  const { lang } = useLang();
  const c = copy[lang];
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[] | null>(null);

  async function executeMatch(text: string) {
    if (text.trim().length < 15) return setError(c.tooShort);
    setLoading(true);
    setError(null);
    setMatches(null);
    try {
      const res = await matchProjects({ data: { brief: text, lang } });
      if (res.ok) setMatches(res.matches);
      else setError(res.error);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void executeMatch(brief);
  }

  function onChipClick(chipText: string) {
    setBrief(chipText);
    void executeMatch(chipText);
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

          <div className="mt-8">
            <span className="caption-mono text-muted block mb-3">{c.chipsLabel}</span>
            <div className="flex flex-col gap-2">
              {c.chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={loading}
                  onClick={() => onChipClick(chip)}
                  className={`text-left p-3 border text-xs font-mono transition-all duration-200 group flex items-start gap-2 ${
                    brief === chip
                      ? "border-ink bg-surface-card text-ink"
                      : "border-hairline text-muted hover:border-ink hover:text-ink bg-surface-soft/40"
                  }`}
                >
                  {/* <Sparkles className="size-3.5 mt-0.5 shrink-0 opacity-70 group-hover:opacity-100" /> */}
                  <span>{chip}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="matcher-brief" className="caption-mono block">
              {c.label}
            </label>
            <textarea
              id="matcher-brief"
              rows={4}
              maxLength={1000}
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
            <div className="mt-8 flex items-center gap-4">
              <button type="submit" className="btn-outline" disabled={loading}>
                {loading ? c.loading : c.submit}
              </button>
              {loading && (
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-widest animate-pulse">
                  <span className="size-2 rounded-full bg-ink inline-block" />
                  Gemini Flash Matching
                </span>
              )}
            </div>
          </form>

          <div aria-live="polite">
            <AnimatePresence mode="wait">
              {matches && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-12"
                >
                  <h3 className="caption-mono mb-6 text-muted">{c.results}</h3>
                  {matches.length === 0 ? (
                    <p className="body-md text-muted">{c.none}</p>
                  ) : (
                    <div className="space-y-6">
                      {matches.map((m, index) => {
                        const proj = projects.find((p) => p.slug === m.slug);
                        if (!proj) return null;
                        return (
                          <motion.article
                            key={m.slug}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.6,
                              delay: index * 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="border border-hairline p-6 hover:border-ink transition-colors bg-surface-soft/20"
                          >
                            <div className="flex items-baseline justify-between gap-4">
                              <h4 className="title-md">{proj.name}</h4>
                              <span className="caption-mono">{proj.year}</span>
                            </div>
                            <p className="body-sm mt-3 text-body-strong">{m.reason}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {proj.stack.slice(0, 4).map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 border border-hairline text-muted"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <Link
                              to={`/projects/${proj.slug}`}
                              className="link-mono mt-4 inline-flex items-center gap-1.5"
                            >
                              <span>{c.view}</span>
                              <ArrowRight className="size-3" />
                            </Link>
                          </motion.article>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
