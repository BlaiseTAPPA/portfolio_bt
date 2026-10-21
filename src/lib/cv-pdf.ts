import { jsPDF } from "jspdf";
import { education, experience, identity, languages, projects, skills, type Lang } from "./content";

const stripScheme = (url: string) => url.replace(/^https?:\/\//, "");
const siteHost = stripScheme(identity.siteUrl);

export const cvPdfCopy = {
  en: {
    docTitle: "CURRICULUM VITAE",
    availability:
      "Available immediately for Werkstudent roles: 20 h/week during semester, full-time during semester breaks, remote or hybrid.",
    experience: "PROFESSIONAL EXPERIENCE",
    skills: "TECHNICAL TOOLKIT",
    projects: "FEATURED CASE STUDIES",
    education: "EDUCATION",
    languages: "LANGUAGES",
    links: "ONLINE & PORTFOLIO",
    stack: "Stack",
    footer: `Generated from ${siteHost} — Contact: ${identity.email}`,
  },
  de: {
    docTitle: "LEBENSLAUF",
    availability:
      "Ab sofort verfügbar als Werkstudent: 20 Std./Woche im Semester, Vollzeit in den Semesterferien, remote oder hybrid.",
    experience: "BERUFSERFAHRUNG",
    skills: "TECHNISCHE KENNTNISSE",
    projects: "AUSGEWÄHLTE PROJEKTE",
    education: "STUDIUM",
    languages: "SPRACHEN",
    links: "LINKS & PORTFOLIO",
    stack: "Tech-Stack",
    footer: `Online-Version: ${siteHost} – Kontakt: ${identity.email}`,
  },
  fr: {
    docTitle: "CURRICULUM VITÆ",
    availability:
      "Disponible immédiatement en Werkstudent : 20 h/semaine pendant le semestre, temps plein pendant les vacances universitaires, à distance ou hybride.",
    experience: "EXPÉRIENCE PROFESSIONNELLE",
    skills: "COMPÉTENCES TECHNIQUES",
    projects: "PROJETS & ÉTUDES DE CAS",
    education: "FORMATION & DIPLÔMES",
    languages: "LANGUES",
    links: "PORTFOLIO & CONTACT",
    stack: "Technologies",
    footer: `Généré depuis ${siteHost} — Contact : ${identity.email}`,
  },
};

export function createCvPdf(lang: Lang): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  }

  const t = cvPdfCopy[lang];

  // Header: Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 20);
  doc.text(identity.name.toUpperCase(), margin, y);
  y += 7;

  // Header: Role & Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(identity.headline[lang], margin, y);
  y += 6;

  // Header: Coordinates, split over two lines so each fits the content width
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const contactLines = [
    `${identity.location[lang]}   |   ${identity.email}`,
    `${siteHost}   |   ${stripScheme(identity.github)}   |   ${stripScheme(identity.linkedin)}`,
  ];
  for (const line of contactLines) {
    for (const wrapped of doc.splitTextToSize(line, contentWidth) as string[]) {
      doc.text(wrapped, margin, y);
      y += 4.2;
    }
  }
  y += 1;

  // Divider line
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  // Availability banner box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  const availabilityLines = doc.splitTextToSize(t.availability, contentWidth - 8) as string[];
  const bannerHeight = 4.6 + availabilityLines.length * 3.6;
  doc.setFillColor(246, 246, 244);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(margin, y, contentWidth, bannerHeight, 1, 1, "FD");
  doc.setTextColor(40, 40, 40);
  doc.text(availabilityLines, margin + 4, y + 5.2);
  y += bannerHeight + 5;

  function renderSectionHeader(title: string) {
    checkPageBreak(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(title, margin, y);
    y += 2;
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;
  }

  // 1. Education (student status first: the core Werkstudent requirement)
  renderSectionHeader(t.education);
  for (const edu of education) {
    checkPageBreak(10);
    const period = edu.period?.[lang];
    const periodWidth = period ? doc.getTextWidth(period) + 6 : 0;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    const schoolLines = doc.splitTextToSize(edu.school, contentWidth - periodWidth) as string[];
    doc.text(schoolLines, margin, y);
    if (period) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(110, 110, 110);
      doc.text(period, margin + contentWidth - doc.getTextWidth(period), y);
    }
    y += schoolLines.length * 4.2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(70, 70, 70);
    doc.text(edu.detail[lang], margin, y);
    y += 5.5;
  }
  y += 2;

  // 2. Experience
  renderSectionHeader(t.experience);
  for (const exp of experience) {
    checkPageBreak(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(exp.company, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    const periodWidth = doc.getTextWidth(exp.period);
    doc.text(exp.period, margin + contentWidth - periodWidth, y);
    y += 4.5;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(exp.title[lang], margin, y);
    y += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    for (const pt of exp.points[lang]) {
      checkPageBreak(6);
      const bullet = "• ";
      const textLines = doc.splitTextToSize(pt, contentWidth - 6);
      doc.text(bullet, margin + 2, y);
      doc.text(textLines, margin + 6, y);
      y += textLines.length * 3.8 + 0.8;
    }
    y += 2.5;
  }

  y += 2;

  // 3. Technical Toolkit
  renderSectionHeader(t.skills);
  checkPageBreak(12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const skillsText = skills[lang].join("   ·   ");
  doc.text(skillsText, margin, y);
  y += 8;

  // 4. Featured Case Studies
  renderSectionHeader(t.projects);
  for (const proj of projects.slice(0, 4)) {
    checkPageBreak(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text(proj.name, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 110);
    const yearWidth = doc.getTextWidth(proj.year);
    doc.text(proj.year, margin + contentWidth - yearWidth, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(70, 70, 70);
    const excerptLines = doc.splitTextToSize(proj.excerpt[lang], contentWidth);
    doc.text(excerptLines, margin, y);
    y += excerptLines.length * 3.8;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(`${t.stack}: ${proj.stack.join(", ")}`, margin, y);
    y += 5.5;
  }

  y += 2;

  // 5. Languages
  renderSectionHeader(t.languages);
  for (const langItem of languages) {
    checkPageBreak(6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    const name = langItem.name[lang];
    doc.text(name, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(langItem.level[lang], margin + 32, y);
    y += 4.5;
  }

  // Footer on each page
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text(t.footer, margin, pageHeight - 7.5);
    const pageStr = `${i} / ${totalPages}`;
    const pageNumWidth = doc.getTextWidth(pageStr);
    doc.text(pageStr, margin + contentWidth - pageNumWidth, pageHeight - 7.5);
  }

  return doc;
}

export function downloadCvPdf(lang: Lang) {
  const doc = createCvPdf(lang);
  const fileName = `CV_Blaise_Tappa_${lang.toUpperCase()}.pdf`;
  doc.save(fileName);
}
