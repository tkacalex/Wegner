"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { makeAppointmentSchema, type AppointmentType, type TimeSlot } from "@/lib/appointment";
import { TextField, SelectField, TextAreaField } from "./fields";
import { CheckIcon, MailIcon, PhoneIcon } from "@/components/icons";

type AppointmentFormDict = Dictionary["appointment"]["form"];
type AppointmentValidationDict = Dictionary["appointment"]["validation"];

type Props = {
  locale: Locale;
  t: AppointmentFormDict;
  validation: AppointmentValidationDict;
  optionalLabel: string;
  privacyHref: string;
  contact: { phone: string; email: string };
  fallbackLabels: { call: string; mail: string };
  phoneDisplay: string;
  emailDisplay: string;
  fallbackPhoneLabel: string;
  fallbackEmailLabel: string;
};

export function AppointmentForm({
  locale,
  t,
  validation,
  optionalLabel,
  privacyHref,
  contact,
  fallbackLabels,
  phoneDisplay,
  emailDisplay,
  fallbackPhoneLabel,
  fallbackEmailLabel,
}: Props) {
  const schema = useMemo(() => makeAppointmentSchema(validation), [validation]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      preferredContact: "phone" as const,
      appointmentType: "" as AppointmentType | "",
      preferredDate: "",
      preferredTime: "" as TimeSlot | "",
      vehicleOrSubject: "",
      message: "",
      privacy: false,
      locale,
    },
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorKind, setErrorKind] = useState<"generic" | "mailNotConfigured">("generic");

  const fieldErr = (name: string): string | undefined => {
    const e = (errors as Record<string, { message?: string }>)[name];
    return e?.message;
  };

  const onValid = handleSubmit(async (values) => {
    setStatus("submitting");

    const fd = new FormData();
    fd.append("locale", locale);
    for (const [key, value] of Object.entries(values)) {
      if (key === "privacy") {
        fd.append(key, value ? "true" : "false");
      } else {
        fd.append(key, String(value ?? ""));
      }
    }

    try {
      const res = await fetch("/api/appointment", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }

      setErrorKind(data.error === "mail_not_configured" ? "mailNotConfigured" : "generic");
      setStatus("error");
    } catch {
      setErrorKind("generic");
      setStatus("error");
    }
  });

  if (status === "success") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_8px_30px_rgba(22,23,26,0.06)]">
        <div className="h-1 bg-brand-red" aria-hidden />
        <div className="p-8 text-center sm:p-10">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
            <CheckIcon className="h-7 w-7" />
          </span>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-brand-gray">{t.success}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[0_8px_30px_rgba(22,23,26,0.06)]">
      <div className="h-1 bg-brand-red" aria-hidden />

      <div className="p-6 sm:p-8">
        <span className="eyebrow text-xs sm:text-sm">{t.badge}</span>
        <h3 className="mt-3 text-2xl font-semibold text-brand-black">{t.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-gray sm:text-base">{t.intro}</p>

        <form onSubmit={onValid} noValidate className="mt-8 grid gap-5">
          <TextField
            id="appointment-name"
            label={t.fields.name.label}
            placeholder={t.fields.name.placeholder}
            required
            autoComplete="name"
            registration={register("name")}
            error={fieldErr("name")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="appointment-phone"
              label={t.fields.phone.label}
              placeholder={t.fields.phone.placeholder}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              registration={register("phone")}
              error={fieldErr("phone")}
            />
            <TextField
              id="appointment-email"
              label={t.fields.email.label}
              placeholder={t.fields.email.placeholder}
              type="email"
              inputMode="email"
              autoComplete="email"
              registration={register("email")}
              error={fieldErr("email")}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              id="appointment-preferredContact"
              label={t.fields.preferredContact.label}
              required
              options={t.fields.preferredContact.options}
              registration={register("preferredContact")}
              error={fieldErr("preferredContact")}
            />
            <SelectField
              id="appointment-type"
              label={t.fields.appointmentType.label}
              placeholder={t.fields.appointmentType.placeholder}
              required
              options={t.fields.appointmentType.options}
              registration={register("appointmentType")}
              error={fieldErr("appointmentType")}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="appointment-date"
              label={t.fields.preferredDate.label}
              type="date"
              required
              registration={register("preferredDate")}
              error={fieldErr("preferredDate")}
            />
            <SelectField
              id="appointment-time"
              label={t.fields.preferredTime.label}
              placeholder={t.fields.preferredTime.placeholder}
              required
              options={t.fields.preferredTime.options}
              registration={register("preferredTime")}
              error={fieldErr("preferredTime")}
            />
          </div>

          <TextField
            id="appointment-vehicle"
            label={t.fields.vehicleOrSubject.label}
            placeholder={t.fields.vehicleOrSubject.placeholder}
            optionalLabel={optionalLabel}
            registration={register("vehicleOrSubject")}
            error={fieldErr("vehicleOrSubject")}
          />

          <TextAreaField
            id="appointment-message"
            label={t.fields.message.label}
            placeholder={t.fields.message.placeholder}
            optionalLabel={optionalLabel}
            registration={register("message")}
            error={fieldErr("message")}
          />

          <div className="rounded-xl border border-brand-line bg-brand-surface/60 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 shrink-0 rounded border-brand-line text-brand-red focus:ring-brand-red/40"
                {...register("privacy")}
              />
              <span className="text-sm leading-relaxed text-brand-gray">
                {t.privacy.label}{" "}
                <Link href={privacyHref} className="link-underline" target="_blank">
                  {t.privacy.link}
                </Link>
              </span>
            </label>
            {fieldErr("privacy") && (
              <p className="field-error" role="alert">
                {fieldErr("privacy")}
              </p>
            )}
          </div>

          {status === "error" && (
            <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-4">
              <p className="text-sm leading-relaxed text-brand-red">
                {errorKind === "mailNotConfigured" ? t.error.mailNotConfigured : t.error.generic}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a href={`tel:${contact.phone}`} className="btn-outline">
                  <PhoneIcon className="h-4 w-4" />
                  {fallbackLabels.call}
                </a>
                <a href={`mailto:${contact.email}`} className="btn-outline">
                  <MailIcon className="h-4 w-4" />
                  {fallbackLabels.mail}
                </a>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary btn-lg w-full sm:w-auto"
          >
            {status === "submitting" ? t.sending : t.submit}
          </button>
        </form>

        <div className="mt-8 border-t border-brand-line pt-6 text-sm text-brand-gray">
          <p>
            <span className="font-medium text-brand-ink">{fallbackPhoneLabel}:</span>{" "}
            <a href={`tel:${contact.phone}`} className="link-underline">
              {phoneDisplay}
            </a>
          </p>
          <p className="mt-1 break-all">
            <span className="font-medium text-brand-ink">{fallbackEmailLabel}:</span>{" "}
            <a href={`mailto:${contact.email}`} className="link-underline">
              {emailDisplay}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
