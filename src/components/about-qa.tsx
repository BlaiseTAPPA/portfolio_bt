import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { askAboutStream } from "@/lib/qa.functions";

const copy = {
  en: {
    eyebrow: "Ask me anything",
    title: "Questions about my background?",
    intro:
      "Ask about my experience, education, languages or projects. An AI answers using only the facts on this page — nothing invented.",
    label: "Your question",
    placeholder: "e.g. Has he worked with AI in production?",
    submit: "Ask",
    loading: "Thinking…",
    streaming: "Streaming answer…",
    tooShort: "Please write at least 5 characters.",
    chipsLabel: "Suggested questions:",
    suggestions: [
      "Which languages does he speak?",
      "What is his exact availability for Werkstudent roles?",
      "What did he do at OMOA Group?",
      "Has he worked with AI in production?",
    ],
  },
  de: {
    eyebrow: "Frag mich alles",
    title: "Fragen zu meinem Werdegang?",
    intro:
      "Fragen Sie zu Erfahrung, Ausbildung, Sprachen oder Projekten. Eine KI antwortet nur mit den Fakten dieser Seite — nichts wird erfunden.",
    label: "Ihre Frage",
    placeholder: "z. B. Hat er mit KI in der Produktion gearbeitet?",
    submit: "Fragen",
    loading: "Denke nach…",
    streaming: "Antwort wird generiert…",
    tooShort: "Bitte mindestens 5 Zeichen eingeben.",
    chipsLabel: "Vorgeschlagene Fragen:",
    suggestions: [
      "Welche Sprachen spricht er?",
      "Wie sieht seine Verfügbarkeit als Werkstudent aus?",
      "Was hat er bei der OMOA Group gemacht?",
      "Hat er mit KI in der Produktion gearbeitet?",
    ],
  },
  fr: {
    eyebrow: "Posez-moi vos questions",
    title: "Des questions sur mon parcours ?",
    intro:
      "Interrogez l'IA sur mon expérience, mes études, mes langues ou mes projets. Elle répond strictement à partir des faits documentés sur ce site.",
    label: "Votre question",
    placeholder: "ex. A-t-il déjà intégré de l'IA en production ?",
    submit: "Poser la question",
    loading: "Réflexion en cours…",
    streaming: "Génération en direct…",
    tooShort: "Veuillez saisir au moins 5 caractères.",
    chipsLabel: "Questions suggérées :",
    suggestions: [
      "Quelles langues maîtrise-t-il ?",
      "Quelle est sa disponibilité exacte en Werkstudent ?",
      "Quel était son rôle chez OMOA Group ?",
      "A-t-il déjà intégré de l'IA en production ?",
    ],
  },
};

export function AboutQa() {
  const { lang } = useLang();
  const c = copy[lang];
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  async function submit(q: string) {
    if (q.trim().length < 5) return setError(c.tooShort);
    setLoading(true);
    setStreaming(true);
    setError(null);
    setAnswer("");

    try {
      const res = await askAboutStream({ data: { question: q, lang } }, (chunk) => {
        setAnswer(chunk);
      });
      if (!res.ok && res.error) {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void submit(question);
  }

  return (
    <section className="section-y border-t border-hairline" aria-labelledby="qa-title">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="caption-mono">{c.eyebrow}</p>
          <h2 id="qa-title" className="display-md mt-4">
            {c.title}
          </h2>
          <p className="body-md mt-6 text-body">{c.intro}</p>
          <div className="mt-8">
            <span className="caption-mono text-muted block mb-3">{c.chipsLabel}</span>
            <ul className="space-y-2.5">
              {c.suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className="link-mono text-left inline-flex items-center gap-2 group transition-colors"
                    disabled={loading}
                    onClick={() => {
                      setQuestion(s);
                      void submit(s);
                    }}
                  >
                    <span className="text-muted group-hover:text-ink transition-colors">→</span>
                    <span>{s}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <form onSubmit={onSubmit} noValidate>
            <div className="mb-4">
              <span className="caption-mono block mb-2">{c.chipsLabel}</span>
              <div className="flex flex-wrap gap-2">
                {c.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setQuestion(s);
                      void submit(s);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs tracking-wider uppercase font-mono transition-all duration-200 ${
                      question === s
                        ? "border-ink bg-ink text-canvas"
                        : "border-hairline text-muted hover:border-ink hover:text-ink bg-surface-soft/60"
                    }`}
                  >
                    <Sparkles className="size-3 opacity-70" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>

            <label htmlFor="qa-question" className="caption-mono block mt-6">
              {c.label}
            </label>
            <textarea
              id="qa-question"
              rows={3}
              maxLength={500}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
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
                {streaming ? c.streaming : loading ? c.loading : c.submit}
              </button>
              {streaming && (
                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-widest animate-pulse">
                  <span className="size-2 rounded-full bg-emerald-400 inline-block" />
                  SSE Live
                </span>
              )}
            </div>
          </form>

          <div aria-live="polite">
            {answer !== null && answer.length > 0 && (
              <div className="mt-12 border border-hairline p-8 relative bg-surface-soft/30">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline">
                  <span className="caption-mono text-muted flex items-center gap-2">
                    <Sparkles className="size-3 text-ink" />
                    AI Answer · Gemini
                  </span>
                  {streaming && (
                    <span className="caption-mono text-emerald-400 animate-pulse">● Streaming</span>
                  )}
                </div>
                <p className="body-md whitespace-pre-line text-body-strong">
                  {answer}
                  {streaming && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-ink animate-pulse align-middle" />
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
