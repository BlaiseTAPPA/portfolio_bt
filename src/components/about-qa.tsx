import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { askAbout } from "@/lib/qa.functions";

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
    tooShort: "Please write at least 5 characters.",
    suggestions: [
      "What did he do at OMOA Group?",
      "Which languages does he speak?",
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
    tooShort: "Bitte mindestens 5 Zeichen eingeben.",
    suggestions: [
      "Was hat er bei der OMOA Group gemacht?",
      "Welche Sprachen spricht er?",
      "Hat er mit KI in der Produktion gearbeitet?",
    ],
  },
};

export function AboutQa() {
  const { lang } = useLang();
  const c = copy[lang];
  const run = useServerFn(askAbout);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  async function submit(q: string) {
    if (q.trim().length < 5) return setError(c.tooShort);
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await run({ data: { question: q, lang } });
      if (res.ok) setAnswer(res.answer);
      else setError(res.error);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
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
          <ul className="mt-8 space-y-3">
            {c.suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="link-mono text-left"
                  disabled={loading}
                  onClick={() => {
                    setQuestion(s);
                    void submit(s);
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="qa-question" className="caption-mono block">
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
            <button type="submit" className="btn-outline mt-8" disabled={loading}>
              {loading ? c.loading : c.submit}
            </button>
          </form>
          <div aria-live="polite">
            {answer && (
              <div className="mt-12 border border-hairline p-8">
                <p className="body-md">{answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
