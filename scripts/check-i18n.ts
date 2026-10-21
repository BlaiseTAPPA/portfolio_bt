/**
 * Dev-only i18n check: `npm run check:i18n`.
 *
 * Walks every localized structure (UI dictionary, page copy, PDF copy and content data) and fails if
 * a locale is missing, a string is empty, locales disagree on keys / list length / {placeholders},
 * or a German string uses the informal "du" form.
 */
import * as content from "../src/lib/content.ts";
import { dict } from "../src/lib/i18n.tsx";
import * as pageCopy from "../src/lib/page-copy.ts";
import { cvPdfCopy } from "../src/lib/cv-pdf.ts";

const locales: readonly string[] = content.locales;
const DU_FORM = /\b(du|dich|dir|dein(e[mnrs]?)?|euch|eu(er|re[mnrs]?))\b/i;

const errors: string[] = [];
let checked = 0;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");

/** Same shape across locales: identical keys, list lengths and placeholders. */
function compareShape(a: unknown, b: unknown, path: string) {
  if (typeof a === "string" && typeof b === "string") {
    if (placeholders(a) !== placeholders(b)) errors.push(`${path}: placeholders differ`);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) errors.push(`${path}: list length ${a.length} vs ${b.length}`);
    a.forEach((item, i) => compareShape(item, b[i], `${path}[${i}]`));
  } else if (isPlainObject(a) && isPlainObject(b)) {
    const ka = Object.keys(a).sort().join(",");
    const kb = Object.keys(b).sort().join(",");
    if (ka !== kb) errors.push(`${path}: keys differ (${ka} vs ${kb})`);
    for (const k of Object.keys(a)) compareShape(a[k], b[k], `${path}.${k}`);
  } else if (typeof a !== typeof b) {
    errors.push(`${path}: type ${typeof a} vs ${typeof b}`);
  }
}

/** Every string under a locale branch must be non-empty; German must not use "du". */
function checkStrings(value: unknown, path: string, locale: string) {
  if (typeof value === "string") {
    checked++;
    if (!value.trim()) errors.push(`${path}: empty string`);
    if (locale === "de" && DU_FORM.test(value))
      errors.push(`${path}: informal "du" form: "${value}"`);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => checkStrings(item, `${path}[${i}]`, locale));
  } else if (isPlainObject(value)) {
    for (const [k, v] of Object.entries(value)) checkStrings(v, `${path}.${k}`, locale);
  }
}

function walk(value: unknown, path: string) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`));
    return;
  }
  if (!isPlainObject(value)) return;

  const keys = Object.keys(value);
  if (keys.some((k) => locales.includes(k))) {
    for (const locale of locales) {
      if (!(locale in value)) errors.push(`${path}: missing locale "${locale}"`);
      else checkStrings(value[locale], `${path}.${locale}`, locale);
    }
    const [base, ...rest] = locales.filter((l) => l in value);
    for (const locale of rest)
      compareShape(value[base!], value[locale], `${path}.${base}↔${locale}`);
    return;
  }
  for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
}

walk(dict, "dict");
walk(cvPdfCopy, "cvPdfCopy");
for (const [name, value] of Object.entries(pageCopy)) walk(value, `pageCopy.${name}`);
for (const [name, value] of Object.entries(content)) {
  if (typeof value !== "function") walk(value, `content.${name}`);
}

if (errors.length > 0) {
  console.error(
    `i18n check failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join("\n"),
  );
  process.exit(1);
}
console.log(`i18n check passed: ${checked} strings across ${locales.join(", ")}.`);
