import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const buildSpec = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        slug: z.string().min(1).max(60),
        idea: z.string().trim().min(15).max(1500),
        lang: z.enum(["en", "de"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { generateSpec } = await import("./spec.server");
    try {
      return { ok: true as const, spec: await generateSpec(data.slug, data.idea, data.lang) };
    } catch (e) {
      console.error("buildSpec failed", e);
      return { ok: false as const, error: e instanceof Error ? e.message : "Something went wrong." };
    }
  });
