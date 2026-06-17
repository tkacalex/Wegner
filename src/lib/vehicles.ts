import { DEALER_AUTOSCOUT24 } from "./site";

export type Vehicle = {
  id: string;
  url: string; // absolute AutoScout24-Detail-URL
  image: string; // absolute Bild-URL
  title: string; // "BMW 116i"
  price: string; // "€ 4.700"
  priceRaw: number;
  mileage: string; // "188.500 km"
  year: string; // "2008"
  fuel: string; // "Benzin"
  transmission: string; // "Schaltgetriebe"
  power: string; // "122 PS"
};

const AS24_ORIGIN = "https://www.autoscout24.de";

type Formatted = { raw?: number; formatted?: string };
interface AS24Price {
  price?: string;
  priceRaw?: number;
}
interface AS24Vehicle {
  make?: string;
  model?: string;
  modelVersionInput?: string;
  fuelCategory?: { formatted?: string };
  mileageInKm?: Formatted;
  transmissionType?: { formatted?: string };
  powerInHp?: Formatted;
  firstRegistrationDate?: string;
}
interface AS24Listing {
  id?: string;
  url?: string;
  images?: string[];
  prices?: { public?: AS24Price; dealer?: AS24Price };
  vehicle?: AS24Vehicle;
}

/** Bild auf eine größere Auflösung anheben ("/250x188.webp" -> "/640x480.webp"). */
function biggerImage(url: string): string {
  return url.replace(/\/\d+x\d+\.webp$/i, "/640x480.webp");
}

function yearFrom(reg: string | undefined): string {
  const m = reg ? String(reg).match(/(\d{4})/) : null;
  return m ? m[1] : "";
}

/**
 * Lädt die aktuellen Fahrzeuge vom AutoScout24-Händlerprofil.
 * ISR-gecacht (stündlich). Bei Fehler/Blockade: leeres Array -> die Seite
 * fällt automatisch auf den AutoScout24-Button zurück (kein kaputter Zustand).
 */
export async function getDealerListings(): Promise<Vehicle[]> {
  try {
    const res = await fetch(DEALER_AUTOSCOUT24, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "accept-language": "de-DE,de;q=0.9",
        accept: "text/html",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const html = await res.text();
    const match = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    );
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const listings = data?.props?.pageProps?.listings as AS24Listing[] | undefined;
    if (!Array.isArray(listings)) return [];

    const vehicles: Vehicle[] = [];
    for (const l of listings) {
      const v = l.vehicle ?? {};
      const image = l.images?.[0] ? biggerImage(l.images[0]) : "";
      const price = l.prices?.public?.price ?? l.prices?.dealer?.price ?? "";
      if (!image && !price) continue;

      const model = [v.model, v.modelVersionInput].filter(Boolean).join(" ").trim();
      const url = l.url
        ? l.url.startsWith("http")
          ? l.url
          : AS24_ORIGIN + l.url
        : DEALER_AUTOSCOUT24;

      vehicles.push({
        id: String(l.id ?? url),
        url,
        image,
        title: [v.make, model].filter(Boolean).join(" ").trim() || "Fahrzeug",
        price,
        priceRaw: l.prices?.public?.priceRaw ?? l.prices?.dealer?.priceRaw ?? 0,
        mileage: v.mileageInKm?.formatted ?? "",
        year: yearFrom(v.firstRegistrationDate),
        fuel: v.fuelCategory?.formatted ?? "",
        transmission: v.transmissionType?.formatted ?? "",
        power: v.powerInHp?.formatted ?? "",
      });
    }
    return vehicles;
  } catch {
    return [];
  }
}
