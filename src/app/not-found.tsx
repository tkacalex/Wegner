import Link from "next/link";
import "./globals.css";
import { defaultLocale } from "@/i18n/config";

export default function NotFound() {
  return (
    <html lang="de">
      <body className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-6xl font-extrabold text-brand-red">404</p>
          <h1 className="mt-4 text-2xl font-semibold text-brand-black">
            Seite nicht gefunden
          </h1>
          <p className="mt-2 text-brand-gray">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          <Link href={`/${defaultLocale}`} className="btn-primary btn-lg mt-8">
            Zur Startseite
          </Link>
        </div>
      </body>
    </html>
  );
}
