import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { projects } from "./content";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export type Match = { slug: string; reason: string };

export class MatcherError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function recommendProjects(brief: string, lang: "en" | "de"): Promise<Match[]> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new MatcherError(500, "AI is not configured.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const catalog = projects
    .map(
      (p) =>
        `slug: ${p.slug}\nname: ${p.name}\nstack: ${p.stack.join(", ")}\nsummary: ${p.excerpt.en}\nproblem: ${p.problem.en}`,
    )
    .join("\n\n");

  const system = `You match a visitor's project needs to case studies from Blaise Tappa's portfolio.
Only use the case studies listed below. Never invent projects, metrics or clients.
Return ONLY a JSON object, no markdown: {"matches":[{"slug":string,"reason":string}]}
Pick the 1 to 3 most relevant, best first. Each reason is one or two sentences (max 40 words) written in ${lang === "de" ? "German" : "English"}, addressed to the visitor, explaining why that case study is relevant to their needs.

CASE STUDIES:
${catalog}`;

  let text = "";
  let failure: unknown;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system,
    prompt: brief,
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
    if (status === 429) throw new MatcherError(429, "Too many requests — please try again in a moment.");
    if (status === 402) throw new MatcherError(402, "The AI service is temporarily unavailable.");
    throw new MatcherError(status, "The recommendation could not be generated.");
  }

  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    const parsed = JSON.parse(json) as { matches?: Match[] };
    const valid = new Set(projects.map((p) => p.slug));
    return (parsed.matches ?? [])
      .filter((m) => valid.has(m.slug) && typeof m.reason === "string")
      .slice(0, 3);
  } catch {
    throw new MatcherError(500, "The recommendation could not be read.");
  }
}
