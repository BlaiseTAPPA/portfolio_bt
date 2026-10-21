"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { Download, Printer } from "lucide-react";
import { downloadCvPdf } from "@/lib/cv-download";

// Staggered entrance matching the design system's `rise` utility
// (0.8s, cubic-bezier(0.22, 1, 0.36, 1), 16px vertical translation).
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

/** `LazyMotion` + `m` loads only the DOM animation features, and only on the projects page. */
export function StaggerGrid({ className, children }: { className: string; children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div className={className} variants={containerVariants} initial="hidden" animate="visible">
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function StaggerItem({ className, children }: { className: string; children: ReactNode }) {
  return (
    <m.article variants={cardVariants} className={className}>
      {children}
    </m.article>
  );
}

/** jsPDF is imported only when this is clicked (see `cv-download.ts`). */
export function CvDownloadButton({
  label,
  className,
  iconClassName = "size-4",
}: {
  label: string;
  className: string;
  iconClassName?: string;
}) {
  const locale = useLocale();
  return (
    <button type="button" onClick={() => void downloadCvPdf(locale)} className={className}>
      <Download className={iconClassName} />
      <span>{label}</span>
    </button>
  );
}

export function PrintButton({ label, className }: { label: string; className: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <Printer className="size-4" />
      <span>{label}</span>
    </button>
  );
}
