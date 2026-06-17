import type { Locale } from "@/i18n/config";

/** Routen (ohne Locale-Präfix). */
export const routes = {
  home: "",
  sell: "/auto-verkaufen",
  appointment: "/termin",
  contact: "/kontakt",
  privacy: "/datenschutz",
  imprint: "/impressum",
} as const;

/** Anker-IDs der Startseiten-Abschnitte. */
export const sections = {
  vehicles: "fahrzeuge",
  sell: "auto-verkaufen",
  appointment: "termin",
  about: "ueber-uns",
  contact: "kontakt",
  faq: "faq",
} as const;

/** Erzeugt einen locale-präfixierten Pfad, z. B. /de/kontakt */
export function localePath(locale: Locale, path = ""): string {
  return `/${locale}${path}`;
}

/** Link zu einem Abschnitt der Startseite (z. B. /de/#fahrzeuge). */
export function sectionPath(locale: Locale, id: string): string {
  return `/${locale}/#${id}`;
}
