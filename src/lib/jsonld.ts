import { site, externalLinks } from "./site";
import type { Dictionary } from "@/i18n/dictionaries";

const DAY_MAP: Record<string, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

function sameAs(): string[] {
  const links: string[] = [site.social.instagram, site.social.tiktok];
  if (externalLinks.autoScout24.isConfigured) {
    links.push(externalLinks.autoScout24.url);
  }
  return links;
}

function openingHoursSpecification() {
  return site.openingHours.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days.map((d) => DAY_MAP[d]).filter(Boolean),
    opens: slot.opens,
    closes: slot.closes,
  }));
}

/** AutoDealer / LocalBusiness – Kerndaten des Betriebs. */
export function autoDealerJsonLd(siteUrl: string, logoUrl: string) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["AutoDealer", "LocalBusiness"],
    "@id": `${siteUrl}/#business`,
    name: site.name,
    description:
      "Inhabergeführter Gebrauchtwagenhändler in Egelsbach. Gebrauchtwagen kaufen, Auto verkaufen und Termin vereinbaren.",
    url: siteUrl,
    telephone: site.phoneE164,
    email: site.email,
    image: logoUrl,
    logo: logoUrl,
    founder: { "@type": "Person", name: site.owner },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: [
      "Egelsbach",
      "Langen",
      "Dreieich",
      "Darmstadt",
      "Frankfurt-Süd",
      "Rhein-Main",
    ],
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: sameAs(),
    priceRange: "€€",
  };

  // Geo nur einfügen, wenn echte Koordinaten vorhanden sind (nicht raten!).
  if (site.geo.latitude !== null && site.geo.longitude !== null) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    };
  }

  return data;
}

/** Organization. */
export function organizationJsonLd(siteUrl: string, logoUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: siteUrl,
    logo: logoUrl,
    email: site.email,
    telephone: site.phoneE164,
    sameAs: sameAs(),
  };
}

/** WebSite. */
export function websiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    inLanguage: ["de", "ru", "en"],
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

/** FAQPage aus den übersetzten FAQ-Inhalten. */
export function faqJsonLd(dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
