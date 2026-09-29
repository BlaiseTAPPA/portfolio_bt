import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { projects } from "./content";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export async function generateSpec(slug: string, idea: string, lang: "en" | "de"): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured.");
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error("Unknown template.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const system = `You write concise project specifications, using a case study from Blaise Tappa's portfolio as the template.
Write entirely in ${lang === "de" ? "German" : "English"}. Plain text only: no markdown symbols (#, *, **). Use these section headings in uppercase on their own lines: ${
    lang === "de"
      ? "ÜBERBLICK, ZIELGRUPPE, KERNFUNKTIONEN, TECH-STACK, ARCHITEKTUR, MEILENSTEINE, OFFENE FRAGEN"
      : "OVERVIEW, AUDIENCE, CORE FEATURES, TECH STACK, ARCHITECTURE, MILESTONES, OPEN QUESTIONS"
  }. Use "- " for list items. Max 450 words. Don't invent budgets, prices, metrics or clients. Milestones are phases without dates.

TEMPLATE: ${p.name}
Stack: ${p.stack.join(", ")}
Summary: ${p.excerpt.en}
Problem: ${p.problem.en}
Approach: ${p.approach.en}`;

  let text = "";
  let failure: unknown;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system,
    prompt: idea,
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
    const status = (failure as { statusCode?: number }).statusCode;
    if (status === 429) throw new Error("Too many requests — please try again in a moment.");
    throw new Error("The spec could not be generated.");
  }
  return text.trim();
}
