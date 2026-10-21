import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Lang } from "@/lib/content";
import { routing } from "./routing";

/** Validates the `[locale]` segment and enables static rendering for it. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Lang> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
