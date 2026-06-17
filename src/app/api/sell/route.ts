import { NextResponse } from "next/server";
import { Resend } from "resend";
import { makeSellSchema, UPLOAD } from "@/lib/sell";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serverseitige (deutsche) Validierungsmeldungen – nur für die Logik relevant.
const V = {
  required: "Pflichtfeld",
  name: "Name fehlt",
  email: "E-Mail ungültig",
  phone: "Telefon ungültig",
  contact: "Telefon oder E-Mail erforderlich",
  year: "Baujahr ungültig",
  mileage: "Kilometerstand fehlt",
  select: "Auswahl fehlt",
  privacy: "Einwilligung fehlt",
};

const LABELS: Record<string, Record<string, string>> = {
  preferredContact: { phone: "Telefon", email: "E-Mail" },
  fuel: {
    petrol: "Benzin",
    diesel: "Diesel",
    electric: "Elektro",
    hybrid: "Hybrid",
    lpg_cng: "Autogas / Erdgas",
    other: "Sonstiges",
  },
  transmission: { manual: "Schaltgetriebe", automatic: "Automatik" },
  accidentFree: { yes: "Ja", no: "Nein", unknown: "Unbekannt" },
  serviceHistory: { yes: "Ja", no: "Nein", partial: "Teilweise" },
  roadworthy: { yes: "Ja", no: "Nein" },
};

const SLOT_LABELS: Record<string, string> = {
  front: "Außen vorne",
  back: "Außen hinten",
  interior: "Innenraum",
  odometer: "Tacho / Kilometerstand",
  damage: "Schäden",
  more: "Weitere Bilder",
};

const TOTAL_MAX_BYTES = 22 * 1024 * 1024; // Gesamt-Anhangsgrenze

function label(group: string, value: string): string {
  return LABELS[group]?.[value] ?? value;
}

function esc(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string);
}

async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // nicht konfiguriert -> überspringen
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const raw: Record<string, unknown> = {};
    for (const key of [
      "name", "phone", "email", "city", "preferredContact",
      "make", "model", "year", "mileage", "fuel", "transmission",
      "power", "huValid", "accidentFree", "serviceHistory",
      "previousOwners", "roadworthy", "priceExpectation",
      "damages", "equipment", "lastService", "notes",
    ]) {
      raw[key] = (form.get(key) as string) ?? "";
    }
    raw.privacy = form.get("privacy") === "true";

    // Validierung (gleiches Schema wie im Client)
    const parsed = makeSellSchema(V).safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
    }
    const data = parsed.data;

    // Spam-Schutz
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const turnstileOk = await verifyTurnstile(
      (form.get("turnstileToken") as string) || null,
      ip,
    );
    if (!turnstileOk) {
      return NextResponse.json({ ok: false, error: "spam" }, { status: 400 });
    }

    // Dateien einsammeln & prüfen
    const fileList = form.getAll("files").filter((f): f is File => f instanceof File);
    const slotList = form.getAll("fileSlots").map((s) => String(s));
    const attachments: { filename: string; content: Buffer }[] = [];
    const photoSummary: string[] = [];
    let totalBytes = 0;

    for (let i = 0; i < fileList.length && attachments.length < UPLOAD.maxFiles; i++) {
      const file = fileList[i];
      if (!(UPLOAD.acceptedTypes as readonly string[]).includes(file.type)) continue;
      if (file.size > UPLOAD.maxFileSizeBytes) continue;
      if (totalBytes + file.size > TOTAL_MAX_BYTES) break;
      totalBytes += file.size;

      const slotKey = slotList[i] ?? "more";
      const slotLabel = SLOT_LABELS[slotKey] ?? slotKey;
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${String(attachments.length + 1).padStart(2, "0")}_${slotKey}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({ filename, content: buffer });
      photoSummary.push(`${slotLabel}: ${filename}`);
    }

    const locale = (form.get("locale") as string) || "de";

    // E-Mail zusammenbauen (deutsch, für den Inhaber)
    const rows: [string, string][] = [
      ["Name", data.name],
      ["Telefon", data.phone || "–"],
      ["E-Mail", data.email || "–"],
      ["Wohnort", data.city || "–"],
      ["Bevorzugter Kontakt", label("preferredContact", data.preferredContact)],
      ["—", "—"],
      ["Marke", data.make],
      ["Modell", data.model],
      ["Baujahr", data.year],
      ["Kilometerstand", data.mileage],
      ["Kraftstoff", label("fuel", data.fuel)],
      ["Getriebe", label("transmission", data.transmission)],
      ["Leistung (PS)", data.power || "–"],
      ["HU/TÜV bis", data.huValid || "–"],
      ["Unfallfrei", label("accidentFree", data.accidentFree)],
      ["Scheckheft", label("serviceHistory", data.serviceHistory)],
      ["Vorbesitzer", data.previousOwners || "–"],
      ["Fahrbereit", label("roadworthy", data.roadworthy)],
      ["Preisvorstellung", data.priceExpectation ? `${data.priceExpectation} €` : "–"],
      ["—", "—"],
      ["Schäden/Mängel", data.damages || "–"],
      ["Ausstattung", data.equipment || "–"],
      ["Zuletzt gemacht", data.lastService || "–"],
      ["Sonstiges", data.notes || "–"],
    ];

    const textBody = [
      "Neue Fahrzeuganfrage über die Website (Auto verkaufen)",
      `Sprache der Anfrage: ${locale.toUpperCase()}`,
      "",
      ...rows.map(([k, v]) => (k === "—" ? "" : `${k}: ${v}`)),
      "",
      photoSummary.length
        ? `Fotos (${photoSummary.length}):\n${photoSummary.join("\n")}`
        : "Keine Fotos übermittelt.",
    ].join("\n");

    const htmlBody = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#16171A;max-width:640px">
        <h2 style="margin:0 0 4px">Neue Fahrzeuganfrage</h2>
        <p style="margin:0 0 16px;color:#6B7280">Eingang über die Website · Sprache: ${esc(locale.toUpperCase())}</p>
        <table style="border-collapse:collapse;width:100%">
          ${rows
            .map(([k, v]) =>
              k === "—"
                ? `<tr><td colspan="2" style="padding:6px 0"><hr style="border:none;border-top:1px solid #E6E7EA"/></td></tr>`
                : `<tr>
                     <td style="padding:6px 12px 6px 0;color:#6B7280;vertical-align:top;white-space:nowrap">${esc(k)}</td>
                     <td style="padding:6px 0;font-weight:600">${esc(v)}</td>
                   </tr>`,
            )
            .join("")}
        </table>
        <p style="margin:16px 0 0;color:#6B7280">Fotos im Anhang: ${attachments.length}</p>
      </div>`;

    const recipient = process.env.CONTACT_EMAIL || site.email;
    const from = process.env.MAIL_FROM || "Wegner Automobile <onboarding@resend.dev>";
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 200 });
    }

    const resend = new Resend(apiKey);
    const subject = `Fahrzeuganfrage: ${data.make} ${data.model} (${data.year}) – ${data.name}`;

    const { error } = await resend.emails.send({
      from,
      to: recipient,
      subject,
      text: textBody,
      html: htmlBody,
      replyTo: data.email || undefined,
      attachments: attachments.length
        ? attachments.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
    });

    if (error) {
      // Kein Loggen personenbezogener Daten – nur der Provider-Fehler.
      console.error("Resend send failed:", error.name ?? "unknown_error");
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Bewusst keine Roh-/PII-Daten loggen.
    console.error("Sell route: unexpected error");
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
