"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const intlLocale = { de: "de-DE", en: "en-GB", fr: "fr-FR" } as const;

/** "Germersheim, DE – 14:05 MESZ": local time in Germany, ticking on the client only. */
export function BerlinClock() {
  const t = useTranslations("common");
  const locale = useLocale();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const timeFmt = new Intl.DateTimeFormat(intlLocale[locale], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Berlin",
    });
    const zoneFmt = new Intl.DateTimeFormat(intlLocale[locale], {
      timeZone: "Europe/Berlin",
      timeZoneName: "short",
    });
    const tick = () => {
      const zone =
        zoneFmt.formatToParts(new Date()).find((part) => part.type === "timeZoneName")?.value ??
        "CET";
      setClock(`${timeFmt.format(new Date())} ${zone}`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [locale]);

  return (
    <span className="caption-mono text-muted-soft">{t("footerLocation", { time: clock })}</span>
  );
}

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="caption-mono transition-colors duration-300 hover:text-link"
    >
      {label}
    </button>
  );
}
