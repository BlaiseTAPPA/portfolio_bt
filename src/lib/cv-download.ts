import type { Lang } from "./content";

/** Loads jsPDF only when a visitor asks for the PDF, keeping it out of the main bundle. */
export async function downloadCvPdf(lang: Lang): Promise<void> {
  const { downloadCvPdf: download } = await import("./cv-pdf");
  download(lang);
}
