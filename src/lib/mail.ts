import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export type MailAttachment = {
  filename: string;
  content: Buffer;
};

export type SendWebsiteMailParams = {
  to?: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: MailAttachment[];
};

export type SendWebsiteMailResult =
  | { ok: true }
  | { ok: false; error: "mail_not_configured" | "send_failed" };

export function escMailHtml(value: string): string {
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

function getSmtpConfig() {
  const secureRaw = process.env.SMTP_SECURE;
  const secure = secureRaw === undefined ? true : secureRaw !== "false";

  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || "Wegner Automobile <noreply.wegner@gmail.com>",
    contactEmail: process.env.CONTACT_EMAIL || site.email,
  };
}

export async function sendWebsiteMail(
  params: SendWebsiteMailParams,
): Promise<SendWebsiteMailResult> {
  const config = getSmtpConfig();

  if (!config.user || !config.pass) {
    console.error("Mail not configured");
    return { ok: false, error: "mail_not_configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    await transporter.sendMail({
      from: config.from,
      to: params.to ?? config.contactEmail,
      subject: params.subject,
      text: params.text,
      html: params.html,
      replyTo: params.replyTo,
      attachments: params.attachments,
    });

    return { ok: true };
  } catch {
    console.error("SMTP send failed");
    return { ok: false, error: "send_failed" };
  }
}
