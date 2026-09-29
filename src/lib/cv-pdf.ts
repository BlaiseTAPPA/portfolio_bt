import { jsPDF } from "jspdf";
import { education, experience, identity, languages, projects, skills, type Lang } from "./content";

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

  const translations = {
    en: {
      docTitle: "CURRICULUM VITAE",
      availability:
        "Available immediately for Werkstudent roles (20h/week, remote/hybrid) and freelance missions.",
      experience: "PROFESSIONAL EXPERIENCE",
      skills: "TECHNICAL TOOLKIT",
      projects: "FEATURED CASE STUDIES",
      education: "EDUCATION",
      languages: "LANGUAGES",
      links: "ONLINE & PORTFOLIO",
      footer: "Generated from blaisetappa.dev — Contact: hello@blaisetappa.dev",
    },
    de: {
      docTitle: "LEBENSLAUF",
      availability:
        "Ab sofort verfügbar für Werkstudentenstellen (20 Std./Woche, remote/hybrid) und Freelance-Projekte.",
      experience: "BERUFSERFAHRUNG",
      skills: "TECHNISCHE KENNTNISSE",
      projects: "AUSGEWÄHLTE PROJEKTE",
      education: "AUSBILDUNG",
      languages: "SPRACHEN",
      links: "LINKS & PORTFOLIO",
      footer: "Erstellt auf blaisetappa.dev — Kontakt: hello@blaisetappa.dev",
    },
    fr: {
      docTitle: "CURRICULUM VITÆ",
      availability:
        "Disponible immédiatement pour contrat étudiant / Werkstudent (20h/semaine, remote/hybride) et missions freelance.",
      experience: "EXPÉRIENCE PROFESSIONNELLE",
      skills: "COMPÉTENCES TECHNIQUES",
      projects: "PROJETS & ÉTUDES DE CAS",
      education: "FORMATION & DIPLÔMES",
      languages: "LANGUES",
      links: "PORTFOLIO & CONTACT",
      footer: "Généré depuis blaisetappa.dev — Contact : hello@blaisetappa.dev",
    },
  };

  const t = translations[lang];

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
  doc.text(identity.role[lang], margin, y);
  y += 6;

  // Header: Coordinates
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const contactLine = `${identity.location}   |   ${identity.email}   |   github.com/BlaiseTAPPA   |   linkedin.com/in/blaise-tappa`;
  doc.text(contactLine, margin, y);
  y += 5;

  // Divider line
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  // Availability banner box
  doc.setFillColor(246, 246, 244);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(margin, y, contentWidth, 8, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text(t.availability, margin + 4, y + 5.2);
  y += 13;

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

  // 1. Experience
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

  // 2. Technical Toolkit
  renderSectionHeader(t.skills);
  checkPageBreak(12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const skillsText = skills.join("   ·   ");
  doc.text(skillsText, margin, y);
  y += 8;

  // 3. Featured Case Studies
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
    doc.text(`Stack: ${proj.stack.join(", ")}`, margin, y);
    y += 5.5;
  }

  y += 2;

  // 4. Education & Languages in 2 columns
  checkPageBreak(25);
  renderSectionHeader(t.education + " & " + t.languages);

  const colWidth = (contentWidth - 10) / 2;
  const startY = y;

  // Left col: Education
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(t.education, margin, y);
  y += 4.5;

  for (const edu of education) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.text(edu.school, margin, y);
    y += 3.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(`${edu.detail[lang]} (${edu.period})`, margin, y);
    y += 4.5;
  }

  const endEduY = y;
  y = startY;

  // Right col: Languages
  const rightMargin = margin + colWidth + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(t.languages, rightMargin, y);
  y += 4.5;

  for (const langItem of languages) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.text(langItem.name[lang], rightMargin, y);
    y += 3.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(langItem.level[lang], rightMargin, y);
    y += 4.5;
  }

  y = Math.max(endEduY, y) + 4;

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
