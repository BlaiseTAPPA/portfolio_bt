import Link from "next/link";
import "../styles.css";

/** Only reached outside the locale routes (the proxy prefixes every page URL with a locale). */
export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="text-center">
          <h1 className="display-lg">404</h1>
          <p className="body-md mt-4">Seite nicht gefunden · Page not found</p>
          <Link href="/de" className="btn-outline mt-8">
            Zur Startseite
          </Link>
        </div>
      </body>
    </html>
  );
}
