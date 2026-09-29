import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const askAbout = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({ question: z.string().trim().min(5).max(500), lang: z.enum(["en", "de"]) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { answerAbout, QaError } = await import("./qa.server");
    try {
      return { ok: true as const, answer: await answerAbout(data.question, data.lang) };
    } catch (e) {
      const message = e instanceof QaError ? e.message : "Something went wrong.";
      console.error("askAbout failed", e);
      return { ok: false as const, error: message };
    }
  });
