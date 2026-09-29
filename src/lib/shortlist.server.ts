import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { education, experience, identity, languages, projects, skills } from "./content";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export type ShortlistKind = "experience" | "project" | "skill" | "education" | "language";
export type ShortlistItem = { kind: ShortlistKind; ref: string; label: string; why: string };
export type ShortlistResult = { summary: string; items: ShortlistItem[] };

const KINDS: ShortlistKind[] = ["experience", "project", "skill", "education", "language"];

export class ShortlistError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function shortlistForRole(role: string, lang: "en" | "de"): Promise<ShortlistResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new ShortlistError(500, "AI is not configured.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const cv = [
    `Candidate: ${identity.name} — ${identity.role.en}, based in ${identity.location}.`,
    "SKILLS (ref = exact skill name):",
    ...skills.map((s) => `- ref="${s}"`),
    "EXPERIENCE (ref = company):",
    ...experience.map((r) => `- ref="${r.company}": ${r.title.en} (${r.period}). ${r.points.en.join(" ")}`),
    "PROJECTS (ref = slug):",
    ...projects.map(
      (p) => `- ref="${p.slug}": ${p.name} (${p.year}). ${p.excerpt.en} Stack: ${p.stack.join(", ")}.`,
    ),
    "EDUCATION (ref = school):",
    ...education.map((e) => `- ref="${e.school}": ${e.detail.en} (${e.period})`),
    "LANGUAGES (ref = English name):",
    ...languages.map((l) => `- ref="${l.name.en}": ${l.level.en}`),
  ].join("\n");

  const system = `You shortlist a candidate's skills and experience against a role a visitor describes.
Use ONLY the facts below. Never invent skills, employers, metrics or clients. Be honest about gaps.
Return ONLY a JSON object, no markdown:
{"summary":string,"items":[{"kind":"experience"|"project"|"skill"|"education"|"language","ref":string,"label":string,"why":string}]}
- "summary": 1–2 sentences on overall fit, naming any clear gap.
- Pick the 3 to 6 most relevant facts, most relevant first, mixing kinds where sensible.
- "ref" must be copied exactly from the facts for that kind.
- "label": a few words; "why": one sentence tied to the role.
Write summary, label and why in ${lang === "de" ? "German" : "English"}.
If nothing is relevant, return an empty items array and say so in the summary.

FACTS:
${cv}`;

  let text = "";
  let failure: unknown;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system,
    prompt: role,
    onError: ({ error }) => {
      failure = error;
    },
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  for await (const chunk of result.textStream) text += chunk;

  if (failure) {
    const status = (failure as { statusCode?: number }).statusCode ?? 500;
    if (status === 429) throw new ShortlistError(429, "Too many requests — please try again in a moment.");
    if (status === 402 || status === 403) throw new ShortlistError(status, "The AI service is temporarily unavailable.");
    throw new ShortlistError(status, "The shortlist could not be generated.");
  }

  const valid: Record<ShortlistKind, Set<string>> = {
    skill: new Set(skills),
    experience: new Set(experience.map((r) => r.company)),
    project: new Set(projects.map((p) => p.slug)),
    education: new Set(education.map((e) => e.school)),
    language: new Set(languages.map((l) => l.name.en)),
  };

  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    const parsed = JSON.parse(json) as { summary?: string; items?: ShortlistItem[] };
    const items = (parsed.items ?? [])
      .filter(
        (i) =>
          KINDS.includes(i.kind) &&
          typeof i.label === "string" &&
          typeof i.why === "string" &&
          valid[i.kind].has(i.ref),
      )
      .slice(0, 6);
    return { summary: typeof parsed.summary === "string" ? parsed.summary : "", items };
  } catch {
    throw new ShortlistError(500, "The shortlist could not be read.");
  }
}
