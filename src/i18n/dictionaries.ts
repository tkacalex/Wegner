import de from "@/messages/de.json";
import ru from "@/messages/ru.json";
import en from "@/messages/en.json";
import type { Locale } from "./config";

/**
 * de.json ist die "Quelle der Wahrheit" für die Typstruktur.
 * ru.json und en.json müssen dieselbe Struktur haben.
 */
export type Dictionary = typeof de;

const dictionaries: Record<Locale, Dictionary> = {
  de,
  ru: ru as Dictionary,
  en: en as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.de;
}
