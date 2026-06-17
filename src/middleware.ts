import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathnameHasLocale(pathname)) {
    return NextResponse.next();
  }

  // Auf Standardsprache (Deutsch) weiterleiten.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // API-Routen, Next-Interna und Dateien mit Endung (z. B. robots.txt,
  // sitemap.xml, Bilder) werden ausgeschlossen.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
