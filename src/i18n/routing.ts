import { defineRouting } from "next-intl/routing";
import { locales } from "@/lib/content";

/** D15: DE + EN + FR, D16: German by default. Every URL carries its locale (`/de/cv`). */
export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localePrefix: "always",
});
