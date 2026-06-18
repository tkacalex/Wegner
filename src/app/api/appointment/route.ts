import { NextResponse } from "next/server";
import { makeAppointmentSchema } from "@/lib/appointment";
import { renderAppointmentEmail } from "@/lib/emailTemplates";
import { sendWebsiteMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const V = {
  required: "Pflichtfeld",
  name: "Name fehlt",
  email: "E-Mail ungültig",
  phone: "Telefon ungültig",
  contact: "Telefon oder E-Mail erforderlich",
  select: "Auswahl fehlt",
  privacy: "Einwilligung fehlt",
  date: "Datum fehlt",
  time: "Zeitfenster fehlt",
};

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const raw: Record<string, unknown> = {
      name: (form.get("name") as string) ?? "",
      phone: (form.get("phone") as string) ?? "",
      email: (form.get("email") as string) ?? "",
      preferredContact: (form.get("preferredContact") as string) ?? "",
      appointmentType: (form.get("appointmentType") as string) ?? "",
      preferredDate: (form.get("preferredDate") as string) ?? "",
      preferredTime: (form.get("preferredTime") as string) ?? "",
      vehicleOrSubject: (form.get("vehicleOrSubject") as string) ?? "",
      message: (form.get("message") as string) ?? "",
      privacy: form.get("privacy") === "true",
      locale: (form.get("locale") as string) || "de",
    };

    const parsed = makeAppointmentSchema(V).safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
    }

    const data = parsed.data;
    const mail = renderAppointmentEmail(data);

    const result = await sendWebsiteMail({
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: data.email || undefined,
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
