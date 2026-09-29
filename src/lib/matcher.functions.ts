import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const matchProjects = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({ brief: z.string().trim().min(15).max(1500), lang: z.enum(["en", "de"]) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { recommendProjects, MatcherError } = await import("./matcher.server");
    try {
      return { ok: true as const, matches: await recommendProjects(data.brief, data.lang) };
    } catch (e) {
      const message = e instanceof MatcherError ? e.message : "Something went wrong.";
      console.error("matchProjects failed", e);
      return { ok: false as const, error: message };
    }
  });
