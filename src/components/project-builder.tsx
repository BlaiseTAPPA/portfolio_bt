import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { projects } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { buildSpec } from "@/lib/spec.functions";

type L = "en" | "de";

const copy = {
  en: {
    eyebrow: "Project builder",
    title: "Start from a case study",
    intro: "Pick a template, describe your idea, and get a first project spec to bring to our conversation.",
    template: "1. Template",
    idea: "2. Your idea",
    placeholder: "e.g. A booking platform for small yoga studios with reminders and payments…",
    output: "3. Spec language",
    submit: "Generate spec",
    loading: "Writing spec…",
    tooShort: "Please write at least 15 characters.",
    result: "Your spec",
    copy: "Copy",
    copied: "Copied",
  },
  de: {
    eyebrow: "Projekt-Builder",
    title: "Mit einer Fallstudie starten",
    intro: "Wählen Sie eine Vorlage, beschreiben Sie Ihre Idee und erhalten Sie eine erste Projektspezifikation für unser Gespräch.",
    template: "1. Vorlage",
    idea: "2. Ihre Idee",
    placeholder: "z. B. Eine Buchungsplattform für kleine Yogastudios mit Erinnerungen und Zahlungen…",
    output: "3. Sprache der Spezifikation",
    submit: "Spezifikation erstellen",
    loading: "Wird erstellt…",
    tooShort: "Bitte mindestens 15 Zeichen eingeben.",
    result: "Ihre Spezifikation",
    copy: "Kopieren",
    copied: "Kopiert",
  },
};

export function ProjectBuilder() {
  const { lang } = useLang();
  const c = copy[lang];
  const run = useServerFn(buildSpec);
  const [slug, setSlug] = useState(projects[0]?.slug ?? "");
  const [idea, setIdea] = useState("");
  const [specLang, setSpecLang] = useState<L | null>(null);
  const outLang = specLang ?? lang;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spec, setSpec] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (idea.trim().length < 15) return setError(c.tooShort);
    setLoading(true);
    setError(null);
    setSpec(null);
    setCopied(false);
    try {
      const res = await run({ data: { slug, idea, lang: outLang } });
      if (res.ok) setSpec(res.spec);
      else setError(res.error);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-y border-t border-hairline" aria-labelledby="builder-title">
      <div className="shell">
        <p className="caption-mono">{c.eyebrow}</p>
        <h2 id="builder-title" className="display-md mt-4">{c.title}</h2>
        <p className="body-md mt-6 max-w-2xl text-body">{c.intro}</p>

        <form onSubmit={onSubmit} noValidate className="mt-12 grid gap-12">
          <fieldset>
            <legend className="caption-mono">{c.template}</legend>
            <div className="mt-4 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-5">
              {projects.map((p) => (
                <label
                  key={p.slug}
                  className={`flex min-h-[88px] cursor-pointer flex-col justify-between gap-3 p-4 transition-colors ${
                    slug === p.slug ? "bg-ink text-canvas" : "bg-canvas hover:bg-surface-soft"
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    value={p.slug}
                    checked={slug === p.slug}
                    onChange={() => setSlug(p.slug)}
                    className="sr-only"
                  />
                  <span className={`title-md ${slug === p.slug ? "text-canvas" : ""}`}>{p.name}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[1px] opacity-70">
                    {p.stack.slice(0, 2).join(" · ")}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="builder-idea" className="caption-mono block">{c.idea}</label>
            <textarea
              id="builder-idea"
              rows={3}
              maxLength={1500}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={c.placeholder}
              className="field-line mt-3 w-full resize-none"
            />
          </div>

          <fieldset>
            <legend className="caption-mono">{c.output}</legend>
            <div className="mt-4 flex gap-3">
              {(["en", "de"] as L[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={outLang === l}
                  onClick={() => setSpecLang(l)}
                  className={outLang === l ? "btn-outline bg-ink text-canvas" : "btn-outline"}
                >
                  {l === "en" ? "English" : "Deutsch"}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            {error && <p role="alert" className="body-sm mb-4 text-warning">{error}</p>}
            <button type="submit" className="btn-outline" disabled={loading}>
              {loading ? c.loading : c.submit}
            </button>
          </div>
        </form>

        <div aria-live="polite">
          {spec && (
            <div className="mt-16 border border-hairline p-6 md:p-10">
              <div className="flex items-center justify-between gap-4">
                <p className="caption-mono">{c.result}</p>
                <button
                  type="button"
                  className="link-mono min-h-11"
                  onClick={() => {
                    navigator.clipboard.writeText(spec);
                    setCopied(true);
                  }}
                >
                  {copied ? c.copied : c.copy}
                </button>
              </div>
              <pre lang={outLang} className="body-sm mt-6 whitespace-pre-wrap font-body">{spec}</pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
