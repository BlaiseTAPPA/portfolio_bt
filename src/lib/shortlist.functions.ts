import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const shortlistRole = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({ role: z.string().trim().min(15).max(1500), lang: z.enum(["en", "de"]) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { shortlistForRole, ShortlistError } = await import("./shortlist.server");
    try {
      const r = await shortlistForRole(data.role, data.lang);
      return { ok: true as const, summary: r.summary, items: r.items };
    } catch (e) {
      const message = e instanceof ShortlistError ? e.message : "Something went wrong.";
      console.error("shortlistRole failed", e);
      return { ok: false as const, error: message };
    }
  });
