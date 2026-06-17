import type { Metadata } from "next";
import { locales, defaultLocale, localeHtmlLang, type Locale } from "@/i18n/config";
import { getSiteUrl, site } from "./site";

const OG_LOCALE: Record<Locale, string> = {
  de: "de_DE",
  ru: "ru_RU",
  en: "en_US",
};

/**
 * Baut Metadaten inkl. hreflang-Alternates für eine Seite.
 * @param path Pfad ohne Locale-Präfix, z. B. "" oder "/kontakt".
 */
export function buildMetadata(
  locale: Locale,
  path: string,
  meta: { title: string; description: string },
): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/${locale}${path}`;

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[localeHtmlLang[loc]] = `${siteUrl}/${loc}${path}`;
  }
  languages["x-default"] = `${siteUrl}/${defaultLocale}${path}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      url: canonical,
      locale: OG_LOCALE[locale],
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og.png"],
    },
  };
}
