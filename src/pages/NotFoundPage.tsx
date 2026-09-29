import { Link } from "react-router-dom";
import { Page } from "@/components/site-chrome";

export function NotFoundPage() {
  return (
    <Page>
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Link to="/" className="btn-outline inline-flex items-center justify-center px-4 py-2">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
