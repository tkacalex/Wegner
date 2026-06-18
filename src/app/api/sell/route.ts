import { NextResponse } from "next/server";
import { makeSellSchema, UPLOAD } from "@/lib/sell";
import { renderSellEmail } from "@/lib/emailTemplates";
import { sendWebsiteMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

const TOTAL_MAX_BYTES = 22 * 1024 * 1024;

function label(group: string, value: string): string {
  return LABELS[group]?.[value] ?? value;
}

async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
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

    const parsed = makeSellSchema(V).safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
    }
    const data = parsed.data;

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const turnstileOk = await verifyTurnstile(
      (form.get("turnstileToken") as string) || null,
      ip,
    );
    if (!turnstileOk) {
      return NextResponse.json({ ok: false, error: "spam" }, { status: 400 });
    }

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

    const mail = renderSellEmail({
      locale,
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      preferredContact: label("preferredContact", data.preferredContact),
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      fuel: label("fuel", data.fuel),
      transmission: label("transmission", data.transmission),
      power: data.power || "–",
      huValid: data.huValid || "–",
      accidentFree: label("accidentFree", data.accidentFree),
      serviceHistory: label("serviceHistory", data.serviceHistory),
      previousOwners: data.previousOwners || "–",
      roadworthy: label("roadworthy", data.roadworthy),
      priceExpectation: data.priceExpectation ? `${data.priceExpectation} €` : "–",
      damages: data.damages || "–",
      equipment: data.equipment || "–",
      lastService: data.lastService || "–",
      notes: data.notes || "–",
      photoCount: attachments.length,
      photoSummary,
    });

    const result = await sendWebsiteMail({
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: data.email || undefined,
      attachments: attachments.length ? attachments : undefined,
    });

    if (!result.ok) {
      const status = result.error === "mail_not_configured" ? 200 : 502;
      return NextResponse.json({ ok: false, error: result.error }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Unexpected mail error");
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
