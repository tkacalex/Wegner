/**
 * Zentrale, sprachunabhängige Stammdaten und externe Links.
 * Übersetzbare Texte liegen in src/messages/*.json.
 */

export const site = {
  name: "Wegner Automobile",
  owner: "Anatoli Wegner",
  legalForm: "", // TODO: Rechtsform ergänzen (z. B. Einzelunternehmen)

  address: {
    street: "Boschring 7B",
    postalCode: "63329",
    city: "Egelsbach",
    region: "Hessen",
    country: "DE",
  },

  // Anzeige-Telefonnummer und klickbare tel:-Variante (E.164)
  phoneDisplay: "0174 4574455",
  phoneE164: "+491744574455",

  email: "wegnerautohaus@gmail.com",

  social: {
    instagram: "https://www.instagram.com/wegnerautomobile/",
    tiktok: "https://www.tiktok.com/@wegnerautomobile",
  },

  // Öffnungszeiten als strukturierte Daten (24h-Format).
  // Genutzt für Anzeige UND JSON-LD (openingHoursSpecification).
  openingHours: [
    { days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "15:30", closes: "18:30" },
    { days: ["Sa"], opens: "09:00", closes: "14:00" },
    // Sonntag: geschlossen
  ],

  // Geo-Koordinaten für Boschring 7B, 63329 Egelsbach.
  geo: {
    latitude: 49.9615936 as number | null,
    longitude: 8.6682666 as number | null,
  },
} as const;

/** AutoScout24-Händlerprofil von Wegner Automobile. */
export const DEALER_AUTOSCOUT24 = "https://www.autoscout24.de/haendler/wegner-automobile";

/** Direkter Google-Maps-Embed (zeigt exakt Boschring 7B, ohne API-Key). */
export const GOOGLE_MAPS_EMBED =
  "https://www.google.com/maps?q=Boschring%207B%2C%2063329%20Egelsbach&z=16&hl=de&output=embed";

/** Platzhalter-Strings, die signalisieren, dass ein Link noch fehlt. */
const PLACEHOLDERS = [
  "AUTO_SCOUT24_LINK_HIER_EINFUEGEN",
  "GOOGLE_CALENDAR_BOOKING_LINK_HIER_EINFUEGEN",
];

export function isConfigured(value: string | undefined | null): value is string {
  if (!value) return false;
  if (PLACEHOLDERS.includes(value)) return false;
  return /^https?:\/\//i.test(value);
}

const rawAutoScout = process.env.NEXT_PUBLIC_AUTOSCOUT24_URL;
const rawCalendar = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL;
const rawMaps = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

export const externalLinks = {
  /** AutoScout24-Händlerprofil (Standard: bekanntes Profil von Wegner Automobile). */
  autoScout24: {
    url: isConfigured(rawAutoScout) ? rawAutoScout : DEALER_AUTOSCOUT24,
    isConfigured: true,
  },
  /** Google-Kalender-Buchungslink. */
  googleCalendar: {
    url: isConfigured(rawCalendar) ? rawCalendar : "",
    isConfigured: isConfigured(rawCalendar),
  },
  /** Google-Maps-Embed-URL (iframe src) – wird direkt angezeigt. */
  googleMapsEmbed: {
    url: isConfigured(rawMaps) ? rawMaps : GOOGLE_MAPS_EMBED,
    isConfigured: true,
  },
} as const;

/** Direkter Link "Route planen" zu Google Maps (öffnet in neuem Tab). */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${site.address.street}, ${site.address.postalCode} ${site.address.city}`,
)}`;

/** Link zum Standort auf Google Maps. */
export const mapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`,
)}`;

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return fromEnv.replace(/\/$/, "");
  }
  // Vercel stellt diese Variable automatisch bereit.
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Echte Standort-Fotos. Solange leer, wird ein dezenter Platzhalter angezeigt.
 * Bild nach public/images/ legen und hier den Pfad eintragen, z. B.
 *   exterior: "/images/standort-egelsbach.jpg"
 */
export const photos = {
  // Echte Außenbilder des Standorts.
  hero: "/aussenansc2.jpeg" as string, // oben (Hero)
  about: "/aussenansc.png" as string, // weiter unten (Über uns)
} as const;

export const turnstile = {
  siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  get enabled() {
    return Boolean(this.siteKey);
  },
};
