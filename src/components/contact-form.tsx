"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { identity } from "@/lib/content";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Fields>;

/** Validates, then hands the message to the visitor's mail client (D20: mailto). */
export function ContactForm() {
  const t = useTranslations("common");
  const [values, setValues] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = t("validationName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t("validationEmail");
    if (values.message.trim().length < 10) next.message = t("validationMessage");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSent(true);
    window.location.href = `mailto:${identity.email}?subject=${encodeURIComponent(
      t("mailSubject", { name: values.name }),
    )}&body=${encodeURIComponent(`${values.message}\n\n${values.name} — ${values.email}`)}`;
  }

  const field = "caption-mono block";

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      <div className="space-y-10">
        <div>
          <label htmlFor="name" className={field}>
            {t("fieldName")}
          </label>
          <input
            id="name"
            name="name"
            className="field-line"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="caption-mono mt-2 text-warning">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="email" className={field}>
            {t("fieldEmail")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field-line"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="caption-mono mt-2 text-warning">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="message" className={field}>
            {t("fieldMessage")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="field-line resize-none"
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message ? (
            <p className="caption-mono mt-2 text-warning">{errors.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-4">
        <button type="submit" className="btn-outline inline-flex items-center gap-2">
          <Mail className="size-4" />
          <span>{t("send")}</span>
        </button>
      </div>
      <p aria-live="polite" className="caption-mono mt-5 text-success">
        {sent ? t("sent") : ""}
      </p>
    </form>
  );
}
