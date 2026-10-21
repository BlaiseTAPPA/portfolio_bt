import { Link } from "react-router-dom";
import { Page } from "@/components/site-chrome";
import { useLang } from "@/lib/i18n";

export function NotFoundPage() {
  const { t } = useLang();

  return (
    <Page>
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">{t("notFoundTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("notFoundBody")}</p>
          <div className="mt-6">
            <Link to="/" className="btn-outline inline-flex items-center justify-center px-4 py-2">
              {t("goHome")}
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
