import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { education, experience, identity, languages, projects, skills } from "./content";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export class QaError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function answerAbout(question: string, lang: "en" | "de"): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new QaError(500, "AI is not configured.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const cv = [
    `Name: ${identity.name} — ${identity.role.en}, based in ${identity.location}.`,
    `Skills: ${skills.join(", ")}.`,
    "Experience:",
    ...experience.map(
      (r) =>
        `- ${r.company}, ${r.title.en} (${r.period}): ${r.points.en.join(" ")}`,
    ),
    "Education:",
    ...education.map((e) => `- ${e.school} (${e.period}): ${e.detail.en}`),
    "Languages:",
    ...languages.map((l) => `- ${l.name.en}: ${l.level.en}`),
    "Projects:",
    ...projects.map((p) => `- ${p.name} (${p.year}): ${p.excerpt.en} Stack: ${p.stack.join(", ")}.`),
  ].join("\n");

  const system = `You answer visitors' questions about Blaise Tappa, a developer, using ONLY the facts below.
Never invent employers, dates, metrics, clients or skills. If the facts do not cover the question, say so honestly and suggest getting in touch.
Answer in ${lang === "de" ? "German" : "English"}, in at most 3 short sentences, plain text, no markdown, no lists.

FACTS:
${cv}`;

  let text = "";
  let failure: unknown;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system,
    prompt: question,
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
    if (status === 429) throw new QaError(429, "Too many requests — please try again in a moment.");
    if (status === 402) throw new QaError(402, "The AI service is temporarily unavailable.");
    throw new QaError(status, "The answer could not be generated.");
  }
  return text.trim();
}
