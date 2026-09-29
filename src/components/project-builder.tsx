import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { projects, type Lang } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { buildSpecStream } from "@/lib/spec.functions";

type L = Lang;

const copy = {
  en: {
    eyebrow: "Project builder",
    title: "Start from a case study",
    intro:
      "Pick a template, describe your idea, and get a first project spec to bring to our conversation.",
    template: "1. Template",
    idea: "2. Your idea",
    placeholder: "e.g. A booking platform for small yoga studios with reminders and payments…",
    output: "3. Spec language",
    submit: "Generate spec",
    loading: "Preparing spec…",
    streaming: "Writing spec live…",
    tooShort: "Please write at least 15 characters.",
    result: "Your spec",
    copy: "Copy",
    copied: "Copied",
    chipsLabel: "Quick templates / ideas:",
    chips: [
      {
        slug: "femmes-daudace",
        text: "Booking platform for yoga studios with automated reminders and Stripe payments",
      },
      {
        slug: "signalist",
        text: "SaaS financial analytics dashboard with custom webhook alerts and MRR metrics",
      },
      {
        slug: "roomify",
        text: "Generative 3D floor plan visualizer for real estate brokers with schema validation",
      },
      {
        slug: "tankstellen-finder",
        text: "EV charging station locator along European highway corridors with live pricing",
      },
    ],
  },
  de: {
    eyebrow: "Projekt-Builder",
    title: "Mit einer Fallstudie starten",
    intro:
      "Wählen Sie eine Vorlage, beschreiben Sie Ihre Idee und erhalten Sie eine erste Projektspezifikation für unser Gespräch.",
    template: "1. Vorlage",
    idea: "2. Ihre Idee",
    placeholder:
      "z. B. Eine Buchungsplattform für kleine Yogastudios mit Erinnerungen und Zahlungen…",
    output: "3. Sprache der Spezifikation",
    submit: "Spezifikation erstellen",
    loading: "Vorbereitung…",
    streaming: "Spezifikation wird live geschrieben…",
    tooShort: "Bitte mindestens 15 Zeichen eingeben.",
    result: "Ihre Spezifikation",
    copy: "Kopieren",
    copied: "Kopiert",
    chipsLabel: "Schnellvorlagen / Ideen:",
    chips: [
      {
        slug: "femmes-daudace",
        text: "Buchungsplattform für Yogastudios mit automatisierten Erinnerungen und Stripe-Zahlungen",
      },
      {
        slug: "signalist",
        text: "SaaS-Finanz-Dashboard mit benutzerdefinierten Webhook-Alerts und MRR-Metriken",
      },
      {
        slug: "roomify",
        text: "Generativer 3D-Grundriss-Visualisierer für Immobilienmakler mit Schema-Validierung",
      },
      {
        slug: "tankstellen-finder",
        text: "E-Ladestationsfinder entlang europäischer Autobahnkorridore mit Live-Preisen",
      },
    ],
  },
  fr: {
    eyebrow: "Générateur de spécification",
    title: "Partir d'une étude de cas",
    intro:
      "Choisissez un modèle, décrivez votre idée et obtenez une première spécification technique pour notre échange.",
    template: "1. Modèle d'inspiration",
    idea: "2. Votre idée ou besoin",
    placeholder:
      "ex. Une plateforme de réservation pour studios de yoga avec rappels automatiques et paiement en ligne…",
    output: "3. Langue du document",
    submit: "Générer la spécification",
    loading: "Initialisation…",
    streaming: "Rédaction en direct (SSE)…",
    tooShort: "Veuillez saisir au moins 15 caractères.",
    result: "Votre spécification technique",
    copy: "Copier",
    copied: "Copié !",
    chipsLabel: "Modèles d'idées en 1 clic :",
    chips: [
      {
        slug: "femmes-daudace",
        text: "Plateforme de réservation pour studios de yoga avec rappels automatiques et paiement Stripe",
      },
      {
        slug: "signalist",
        text: "Dashboard financier d'abonnements SaaS avec pipeline d'alertes webhook et métriques MRR",
      },
      {
        slug: "roomify",
        text: "Visualiseur de plans d'étage génératif pour agences immobilières avec analyse multimodale",
      },
      {
        slug: "tankstellen-finder",
        text: "Comparateur de bornes de recharge pour véhicules électriques le long d'autoroutes européennes",
      },
    ],
  },
};

export function ProjectBuilder() {
  const { lang } = useLang();
  const c = copy[lang];
  const [slug, setSlug] = useState(projects[0]?.slug ?? "");
  const [idea, setIdea] = useState("");
  const [specLang, setSpecLang] = useState<L | null>(null);
  const outLang = specLang ?? lang;
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spec, setSpec] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function executeBuild(currentSlug: string, currentIdea: string) {
    if (currentIdea.trim().length < 15) return setError(c.tooShort);
    setLoading(true);
    setStreaming(true);
    setError(null);
    setSpec("");
    setCopied(false);

    try {
      const res = await buildSpecStream(
        { data: { slug: currentSlug, idea: currentIdea, lang: outLang } },
        (accumulated) => {
          setSpec(accumulated);
        },
      );
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
    void executeBuild(slug, idea);
  }

  function onSelectChip(item: { slug: string; text: string }) {
    setSlug(item.slug);
    setIdea(item.text);
    void executeBuild(item.slug, item.text);
  }

  function copySpec() {
    if (!spec) return;
    navigator.clipboard.writeText(spec).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="section-y border-t border-hairline" aria-labelledby="builder-title">
      <div className="shell">
        <p className="caption-mono">{c.eyebrow}</p>
        <h2 id="builder-title" className="display-md mt-4">
          {c.title}
        </h2>
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
                  <span className={`title-md ${slug === p.slug ? "text-canvas" : ""}`}>
                    {p.name}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[1px] opacity-70">
                    {p.stack.slice(0, 2).join(" · ")}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label htmlFor="builder-idea" className="caption-mono block">
                {c.idea}
              </label>
              <span className="caption-mono text-muted">{c.chipsLabel}</span>
            </div>

            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              {c.chips.map((item) => (
                <button
                  key={item.text}
                  type="button"
                  disabled={loading}
                  onClick={() => onSelectChip(item)}
                  className={`text-left p-2.5 border text-xs font-mono transition-all flex items-start gap-2 ${
                    idea === item.text
                      ? "border-ink bg-surface-card text-ink"
                      : "border-hairline text-muted hover:border-ink hover:text-ink bg-surface-soft/40"
                  }`}
                >
                  <Sparkles className="size-3.5 mt-0.5 shrink-0 opacity-70" />
                  <span className="line-clamp-2">{item.text}</span>
                </button>
              ))}
            </div>

            <textarea
              id="builder-idea"
              rows={3}
              maxLength={1500}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={c.placeholder}
              className="field-line mt-1 w-full resize-none"
            />
          </div>

          <fieldset>
            <legend className="caption-mono">{c.output}</legend>
            <div className="mt-4 flex gap-3">
              {(["en", "de", "fr"] as L[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={outLang === l}
                  onClick={() => setSpecLang(l)}
                  className={outLang === l ? "btn-outline bg-ink text-canvas" : "btn-outline"}
                >
                  {l === "en" ? "English" : l === "de" ? "Deutsch" : "Français"}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-4">
            <button type="submit" className="btn-outline" disabled={loading}>
              {streaming ? c.streaming : loading ? c.loading : c.submit}
            </button>
            {streaming && (
              <span className="inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-widest animate-pulse">
                <span className="size-2 rounded-full bg-emerald-400 inline-block" />
                Live Architecture Stream
              </span>
            )}
          </div>
          {error && (
            <p role="alert" className="body-sm -mt-6 text-warning">
              {error}
            </p>
          )}
        </form>

        <div aria-live="polite">
          {spec !== null && spec.length > 0 && (
            <div className="mt-16 border border-hairline p-6 md:p-10 bg-surface-soft/20">
              <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4 mb-6">
                <span className="caption-mono flex items-center gap-2">
                  <Sparkles className="size-3.5 text-ink" />
                  {c.result} · {projects.find((p) => p.slug === slug)?.name} Blueprint
                </span>
                <div className="flex items-center gap-3">
                  {streaming && (
                    <span className="caption-mono text-emerald-400 animate-pulse">
                      ● Generating Spec…
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={copySpec}
                    className="inline-flex items-center gap-1.5 link-mono"
                    aria-label="Copy specification"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span>{c.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>{c.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <pre className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-body-strong overflow-x-auto">
                {spec}
                {streaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-ink animate-pulse align-middle" />
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
