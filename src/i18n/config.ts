export const locales = ["de", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  ru: "Русский",
  en: "English",
};

/** Kurzlabel für den Sprachumschalter. */
export const localeShort: Record<Locale, string> = {
  de: "DE",
  ru: "RU",
  en: "EN",
};

/** HTML lang / hreflang-Codes. */
export const localeHtmlLang: Record<Locale, string> = {
  de: "de-DE",
  ru: "ru-RU",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
