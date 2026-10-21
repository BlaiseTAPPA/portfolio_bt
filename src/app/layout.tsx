import type { ReactNode } from "react";

/** `<html>` lives in `[locale]/layout.tsx` so `lang` is server-rendered per locale. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
