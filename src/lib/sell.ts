import { z } from "zod";

/** Datei-Beschränkungen für den Foto-Upload (Client + Server identisch). */
export const UPLOAD = {
  maxFiles: 8,
  maxFileSizeMb: 5,
  maxFileSizeBytes: 5 * 1024 * 1024,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  acceptAttr: "image/jpeg,image/png,image/webp",
} as const;

/** Übersetzbare Validierungsmeldungen, die das Formular liefert. */
export type ValidationMessages = {
  required: string;
  name: string;
  email: string;
  phone: string;
  contact: string;
  year: string;
  mileage: string;
  select: string;
  privacy: string;
};

const currentYear = new Date().getFullYear();

export function makeSellSchema(v: ValidationMessages) {
  return z
    .object({
      // Schritt 1 – Kontakt
      name: z.string().trim().min(2, { message: v.name }),
      phone: z.string().trim().optional().default(""),
      email: z
        .string()
        .trim()
        .optional()
        .default("")
        .refine((val) => val === "" || z.string().email().safeParse(val).success, {
          message: v.email,
        }),
      city: z.string().trim().optional().default(""),
      preferredContact: z.enum(["phone", "email"]).default("phone"),

      // Schritt 2 – Fahrzeug
      make: z.string().trim().min(1, { message: v.required }),
      model: z.string().trim().min(1, { message: v.required }),
      year: z
        .string()
        .trim()
        .regex(/^\d{4}$/, { message: v.year })
        .refine((val) => {
          const n = Number(val);
          return n >= 1950 && n <= currentYear + 1;
        }, { message: v.year }),
      mileage: z
        .string()
        .trim()
        .min(1, { message: v.mileage })
        .regex(/^[\d.\s]+$/, { message: v.mileage }),
      fuel: z.string().min(1, { message: v.select }),
      transmission: z.string().min(1, { message: v.select }),
      power: z.string().trim().optional().default(""),
      huValid: z.string().trim().optional().default(""),
      accidentFree: z.string().min(1, { message: v.select }),
      serviceHistory: z.string().min(1, { message: v.select }),
      previousOwners: z.string().trim().optional().default(""),
      roadworthy: z.string().min(1, { message: v.select }),
      priceExpectation: z.string().trim().optional().default(""),

      // Schritt 3 – Zustand
      damages: z.string().trim().optional().default(""),
      equipment: z.string().trim().optional().default(""),
      lastService: z.string().trim().optional().default(""),
      notes: z.string().trim().optional().default(""),

      // Einwilligung
      privacy: z.boolean().refine((val) => val === true, { message: v.privacy }),
    })
    .refine((data) => data.phone.trim() !== "" || data.email.trim() !== "", {
      message: v.contact,
      path: ["phone"],
    });
}

export type SellFormValues = z.input<ReturnType<typeof makeSellSchema>>;
export type SellFormOutput = z.output<ReturnType<typeof makeSellSchema>>;
