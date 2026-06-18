/**
 * Generates static HTML previews for internal email templates.
 * Uses fake sample data only – no real customer data, no SMTP, no secrets.
 *
 * Run: npm run gen:email-preview
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderAppointmentEmail, renderSellEmail } from "../src/lib/emailTemplates";

process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wegner.vercel.app";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = join(root, "..", "docs", "email-preview");

const appointment = renderAppointmentEmail({
  name: "Max Mustermann",
  phone: "0174 4574455",
  email: "max.mustermann@beispiel.de",
  preferredContact: "phone",
  appointmentType: "test_drive",
  preferredDate: "2026-06-25",
  preferredTime: "weekday_1630_1730",
  vehicleOrSubject: "BMW 320d (G20), Kennzeichen OF-WG 123",
  message: "Ich hätte gern eine Probefahrt am Nachmittag. Bitte kurz zurückrufen.",
  locale: "de",
});

const sell = renderSellEmail({
  locale: "de",
  name: "Max Mustermann",
  phone: "0174 4574455",
  email: "max.mustermann@beispiel.de",
  city: "Egelsbach",
  preferredContact: "Telefon",
  make: "Volkswagen",
  model: "Golf VII",
  year: "2017",
  mileage: "95.000 km",
  fuel: "Benzin",
  transmission: "Schaltgetriebe",
  power: "150",
  huValid: "09/2026",
  accidentFree: "Ja",
  serviceHistory: "Ja",
  previousOwners: "2",
  roadworthy: "Ja",
  priceExpectation: "12.500 €",
  damages: "Kleine Parkrempler an der Stoßstange hinten",
  equipment: "Klimaautomatik, Navi, Sitzheizung",
  lastService: "Ölwechsel 03/2025",
  notes: "Fahrzeug steht in Egelsbach, Besichtigung jederzeit möglich.",
  photoCount: 4,
  photoSummary: [
    "Außen vorne: 01_front.jpg",
    "Außen hinten: 02_back.jpg",
    "Innenraum: 03_interior.jpg",
    "Tacho / Kilometerstand: 04_odometer.jpg",
  ],
});

mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "appointment.html"), appointment.html, "utf8");
writeFileSync(join(outDir, "sell.html"), sell.html, "utf8");

console.log("Wrote docs/email-preview/appointment.html");
console.log("Wrote docs/email-preview/sell.html");
