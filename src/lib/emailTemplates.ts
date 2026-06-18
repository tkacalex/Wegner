import { site, getSiteUrl } from "@/lib/site";
import {
  APPOINTMENT_TYPE_LABELS_DE,
  TIME_SLOT_LABELS_DE,
  type AppointmentType,
  type TimeSlot,
} from "@/lib/appointment";

const BRAND = {
  red: "#E11122",
  black: "#16171A",
  gray: "#6B7280",
  line: "#E6E7EA",
  bg: "#f4f4f5",
} as const;

export function escapeHtml(value: string): string {
  return value.replace(/[<>&"']/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

export function formatRows(rows: { label: string; value: string }[]): string {
  return rows
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:10px 16px 10px 0;color:${BRAND.gray};vertical-align:top;white-space:nowrap;font-size:14px;line-height:1.5;width:38%">${escapeHtml(label)}</td>
          <td style="padding:10px 0;color:${BRAND.black};font-size:14px;line-height:1.5;font-weight:600">${escapeHtml(value || "–")}</td>
        </tr>`,
    )
    .join("");
}

type EmailSection = {
  heading: string;
  rows: { label: string; value: string }[];
};

type BaseEmailLayoutOptions = {
  preheader: string;
  badge: string;
  title: string;
  notice?: string;
  sections: EmailSection[];
  ctaButtons?: { label: string; href: string }[];
  footer: string;
};

export function renderBaseEmailLayout(options: BaseEmailLayoutOptions): string {
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/wegnerlogo.png`;
  const addressLine = `${site.address.street} · ${site.address.postalCode} ${site.address.city}`;

  const ctaHtml =
    options.ctaButtons && options.ctaButtons.length > 0
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0">
          <tr>
            ${options.ctaButtons
              .map(
                (btn) => `
              <td style="padding-right:12px;padding-bottom:8px">
                <a href="${escapeHtml(btn.href)}" style="display:inline-block;background:${BRAND.red};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:12px">${escapeHtml(btn.label)}</a>
              </td>`,
              )
              .join("")}
          </tr>
        </table>`
      : "";

  const sectionsHtml = options.sections
    .map(
      (section) => `
        <div style="margin-top:28px">
          <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.gray}">${escapeHtml(section.heading)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
            ${formatRows(section.rows)}
          </table>
        </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND.black}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(options.preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND.bg};padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px;background:#ffffff;border:1px solid ${BRAND.line};border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(22,23,26,0.08)">
          <tr>
            <td style="height:4px;background:${BRAND.red};font-size:0;line-height:0">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 32px 28px">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:16px">
                    <img src="${escapeHtml(logoUrl)}" alt="Wegner Automobile" width="120" height="auto" style="display:block;max-width:120px;height:auto;border:0" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:24px">
                    <p style="margin:0;font-size:18px;font-weight:700;color:${BRAND.black}">${escapeHtml(site.name)}</p>
                    <p style="margin:6px 0 0;font-size:13px;color:${BRAND.gray}">${escapeHtml(addressLine)}</p>
                  </td>
                </tr>
              </table>
              <span style="display:inline-block;background:rgba(225,17,34,0.08);color:${BRAND.red};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:6px 12px;border-radius:999px">${escapeHtml(options.badge)}</span>
              <h1 style="margin:16px 0 0;font-size:26px;line-height:1.25;color:${BRAND.black}">${escapeHtml(options.title)}</h1>
              ${
                options.notice
                  ? `<p style="margin:14px 0 0;padding:14px 16px;background:#FFF7F7;border:1px solid rgba(225,17,34,0.15);border-radius:12px;font-size:14px;line-height:1.55;color:${BRAND.black}">${escapeHtml(options.notice)}</p>`
                  : ""
              }
              ${sectionsHtml}
              ${ctaHtml}
              <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid ${BRAND.line};font-size:12px;line-height:1.6;color:${BRAND.gray}">${escapeHtml(options.footer)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function formatLocale(locale: string): string {
  switch (locale.toLowerCase()) {
    case "de":
      return "Deutsch";
    case "en":
      return "Englisch";
    case "ru":
      return "Russisch";
    default:
      return locale.toUpperCase();
  }
}

function phoneToTel(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return null;
  return digits.startsWith("0") ? `tel:+49${digits.slice(1)}` : `tel:+${digits}`;
}

function buildCtaButtons(phone: string, email: string): { label: string; href: string }[] {
  const buttons: { label: string; href: string }[] = [];
  const tel = phoneToTel(phone);
  if (tel) buttons.push({ label: "Kunde anrufen", href: tel });
  if (email.trim()) {
    buttons.push({
      label: "Per E-Mail antworten",
      href: `mailto:${encodeURIComponent(email.trim())}`,
    });
  }
  return buttons;
}

export type AppointmentEmailData = {
  name: string;
  phone: string;
  email: string;
  preferredContact: "phone" | "email";
  appointmentType: AppointmentType;
  preferredDate: string;
  preferredTime: TimeSlot;
  vehicleOrSubject: string;
  message: string;
  locale: string;
};

const CONTACT_LABELS: Record<string, string> = {
  phone: "Telefon",
  email: "E-Mail",
};

export function renderAppointmentEmail(data: AppointmentEmailData): {
  subject: string;
  text: string;
  html: string;
} {
  const typeLabel = APPOINTMENT_TYPE_LABELS_DE[data.appointmentType];
  const timeLabel = TIME_SLOT_LABELS_DE[data.preferredTime];
  const contactLabel = CONTACT_LABELS[data.preferredContact] ?? data.preferredContact;
  const localeLabel = formatLocale(data.locale);

  const contactRows = [
    { label: "Name", value: data.name },
    { label: "Telefon", value: data.phone },
    { label: "E-Mail", value: data.email },
    { label: "Bevorzugter Kontakt", value: contactLabel },
  ];

  const appointmentRows = [
    { label: "Terminart", value: typeLabel },
    { label: "Gewünschter Tag", value: data.preferredDate },
    { label: "Gewünschtes Zeitfenster", value: timeLabel },
    { label: "Fahrzeug oder Anliegen", value: data.vehicleOrSubject },
    { label: "Nachricht", value: data.message },
    { label: "Sprache der Anfrage", value: localeLabel },
  ];

  const text = [
    "Neue Terminanfrage über die Website",
    "",
    "Hinweis: Das ist noch kein bestätigter Termin. Bitte den Termin telefonisch oder per E-Mail bestätigen.",
    "",
    "Kontakt",
    ...contactRows.map((r) => `${r.label}: ${r.value || "–"}`),
    "",
    "Terminwunsch",
    ...appointmentRows.map((r) => `${r.label}: ${r.value || "–"}`),
  ].join("\n");

  const html = renderBaseEmailLayout({
    preheader: "Neue Terminanfrage über die Website.",
    badge: "Termin vereinbaren",
    title: "Neue Terminanfrage",
    notice:
      "Das ist noch kein bestätigter Termin. Bitte den Termin telefonisch oder per E-Mail bestätigen.",
    sections: [
      { heading: "Kontakt", rows: contactRows },
      { heading: "Terminwunsch", rows: appointmentRows },
    ],
    ctaButtons: buildCtaButtons(data.phone, data.email),
    footer:
      "Diese Anfrage wurde über die Website von Wegner Automobile gesendet. Bitte Kundendaten vertraulich behandeln.",
  });

  return {
    subject: `Terminanfrage: ${typeLabel} – ${data.name}`,
    text,
    html,
  };
}

export type SellEmailData = {
  locale: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  preferredContact: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  power: string;
  huValid: string;
  accidentFree: string;
  serviceHistory: string;
  previousOwners: string;
  roadworthy: string;
  priceExpectation: string;
  damages: string;
  equipment: string;
  lastService: string;
  notes: string;
  photoCount: number;
  photoSummary: string[];
};

export function renderSellEmail(data: SellEmailData): {
  subject: string;
  text: string;
  html: string;
} {
  const contactRows = [
    { label: "Name", value: data.name },
    { label: "Telefon", value: data.phone },
    { label: "E-Mail", value: data.email },
    { label: "Wohnort", value: data.city },
    { label: "Bevorzugter Kontakt", value: data.preferredContact },
  ];

  const vehicleRows = [
    { label: "Marke", value: data.make },
    { label: "Modell", value: data.model },
    { label: "Baujahr", value: data.year },
    { label: "Kilometerstand", value: data.mileage },
    { label: "Kraftstoff", value: data.fuel },
    { label: "Getriebe", value: data.transmission },
    { label: "Leistung (PS)", value: data.power },
    { label: "HU/TÜV bis", value: data.huValid },
    { label: "Unfallfrei", value: data.accidentFree },
    { label: "Scheckheft", value: data.serviceHistory },
    { label: "Vorbesitzer", value: data.previousOwners },
    { label: "Fahrbereit", value: data.roadworthy },
    { label: "Preisvorstellung", value: data.priceExpectation },
  ];

  const conditionRows = [
    { label: "Schäden/Mängel", value: data.damages },
    { label: "Ausstattung", value: data.equipment },
    { label: "Zuletzt gemacht", value: data.lastService },
    { label: "Sonstiges", value: data.notes },
    { label: "Sprache der Anfrage", value: formatLocale(data.locale) },
  ];

  const photoRows = [
    { label: "Anzahl Fotos", value: String(data.photoCount) },
    {
      label: "Anhänge nach Kategorie",
      value: data.photoSummary.length ? data.photoSummary.join(" · ") : "Keine Fotos übermittelt",
    },
  ];

  const text = [
    "Neue Fahrzeuganfrage über die Website (Auto verkaufen)",
    "",
    "Kontakt",
    ...contactRows.map((r) => `${r.label}: ${r.value || "–"}`),
    "",
    "Fahrzeug",
    ...vehicleRows.map((r) => `${r.label}: ${r.value || "–"}`),
    "",
    "Zustand & Hinweise",
    ...conditionRows.map((r) => `${r.label}: ${r.value || "–"}`),
    "",
    "Fotos",
    ...photoRows.map((r) => `${r.label}: ${r.value || "–"}`),
  ].join("\n");

  const html = renderBaseEmailLayout({
    preheader: "Neue Fahrzeuganfrage über die Website.",
    badge: "Auto verkaufen",
    title: "Neue Fahrzeuganfrage",
    sections: [
      { heading: "Kontakt", rows: contactRows },
      { heading: "Fahrzeug", rows: vehicleRows },
      { heading: "Zustand & Hinweise", rows: conditionRows },
      { heading: "Fotos", rows: photoRows },
    ],
    ctaButtons: buildCtaButtons(data.phone, data.email),
    footer:
      "Diese Anfrage wurde über die Website von Wegner Automobile gesendet. Bitte Kundendaten vertraulich behandeln.",
  });

  return {
    subject: `Fahrzeuganfrage: ${data.make} ${data.model} (${data.year}) – ${data.name}`,
    text,
    html,
  };
}
