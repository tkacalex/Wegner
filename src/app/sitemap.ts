import type { MetadataRoute } from "next";
import { locales, defaultLocale, localeHtmlLang } from "@/i18n/config";
import { getSiteUrl } from "@/lib/site";

const PATHS = ["", "/auto-verkaufen", "/termin", "/kontakt"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PATHS) {
    const languages: Record<string, string> = {};
    for (const loc of locales) {
      languages[localeHtmlLang[loc]] = `${siteUrl}/${loc}${path}`;
    }
    languages["x-default"] = `${siteUrl}/${defaultLocale}${path}`;

    for (const loc of locales) {
      entries.push({
        url: `${siteUrl}/${loc}${path}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: { languages },
      });
    }
  }

  return entries;
}
