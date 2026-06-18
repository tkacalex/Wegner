import { z } from "zod";
import type { Locale } from "@/i18n/config";

export const APPOINTMENT_TYPES = [
  "vehicle_viewing",
  "test_drive",
  "sell_vehicle",
  "consultation",
  "callback",
] as const;

export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];

export const TIME_SLOTS = [
  "weekday_1530_1630",
  "weekday_1630_1730",
  "weekday_1730_1830",
  "saturday_0900_1100",
  "saturday_1100_1400",
  "flexible",
] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

export const APPOINTMENT_TYPE_LABELS_DE: Record<AppointmentType, string> = {
  vehicle_viewing: "Fahrzeugbesichtigung",
  test_drive: "Probefahrt",
  sell_vehicle: "Auto verkaufen / Fahrzeugbewertung",
  consultation: "Allgemeine Beratung",
  callback: "Rückruf",
};

export const TIME_SLOT_LABELS_DE: Record<TimeSlot, string> = {
  weekday_1530_1630: "Mo–Fr: 15:30–16:30",
  weekday_1630_1730: "Mo–Fr: 16:30–17:30",
  weekday_1730_1830: "Mo–Fr: 17:30–18:30",
  saturday_0900_1100: "Samstag: 09:00–11:00",
  saturday_1100_1400: "Samstag: 11:00–14:00",
  flexible: "Flexibel",
};

const LOCALES = ["de", "en", "ru"] as const satisfies readonly Locale[];

export type AppointmentValidationMessages = {
  required: string;
  name: string;
  email: string;
  phone: string;
  contact: string;
  select: string;
  privacy: string;
  date: string;
  time: string;
};

export function makeAppointmentSchema(messages: AppointmentValidationMessages) {
  return z
    .object({
      name: z.string().trim().min(2, { message: messages.name }),
      phone: z.string().trim().optional().default(""),
      email: z
        .string()
        .trim()
        .optional()
        .default("")
        .refine((value) => value === "" || z.string().email().safeParse(value).success, {
          message: messages.email,
        }),
      preferredContact: z.enum(["phone", "email"]),
      appointmentType: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.enum(APPOINTMENT_TYPES, { message: messages.select }),
      ),
      preferredDate: z.string().trim().min(1, { message: messages.date }),
      preferredTime: z.preprocess(
        (value) => (value === "" ? undefined : value),
        z.enum(TIME_SLOTS, { message: messages.time }),
      ),
      vehicleOrSubject: z.string().trim().optional().default(""),
      message: z.string().trim().optional().default(""),
      privacy: z.boolean().refine((value) => value === true, { message: messages.privacy }),
      locale: z.enum(LOCALES).optional().default("de"),
    })
    .refine((data) => data.phone.trim() !== "" || data.email.trim() !== "", {
      message: messages.contact,
      path: ["phone"],
    });
}

export type AppointmentFormValues = z.input<ReturnType<typeof makeAppointmentSchema>>;
export type AppointmentFormOutput = z.output<ReturnType<typeof makeAppointmentSchema>>;
