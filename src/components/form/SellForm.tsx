"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { makeSellSchema, UPLOAD } from "@/lib/sell";
import { format } from "@/lib/format";
import { TextField, SelectField, TextAreaField } from "./fields";
import { Turnstile } from "@/components/Turnstile";
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  PhoneIcon,
  MailIcon,
} from "@/components/icons";

type SellDict = Dictionary["sell"];

type Props = {
  locale: Locale;
  t: SellDict;
  optionalLabel: string;
  privacyHref: string;
  contact: { phone: string; email: string };
  fallbackLabels: { call: string; mail: string };
  turnstileSiteKey: string;
};

type FileEntry = {
  id: string;
  slotKey: string;
  file: File;
  url: string;
};

const STEP_FIELDS: string[][] = [
  ["name", "phone", "email", "city", "preferredContact"],
  [
    "make",
    "model",
    "year",
    "mileage",
    "fuel",
    "transmission",
    "power",
    "huValid",
    "accidentFree",
    "serviceHistory",
    "previousOwners",
    "roadworthy",
    "priceExpectation",
  ],
  ["damages", "equipment", "lastService", "notes"],
  [],
];

export function SellForm({
  locale,
  t,
  optionalLabel,
  privacyHref,
  contact,
  fallbackLabels,
  turnstileSiteKey,
}: Props) {
  const schema = useMemo(() => makeSellSchema(t.validation), [t.validation]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      preferredContact: "phone" as const,
      make: "",
      model: "",
      year: "",
      mileage: "",
      fuel: "",
      transmission: "",
      power: "",
      huValid: "",
      accidentFree: "",
      serviceHistory: "",
      previousOwners: "",
      roadworthy: "",
      priceExpectation: "",
      damages: "",
      equipment: "",
      lastService: "",
      notes: "",
      privacy: false,
    },
  });

  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [fileError, setFileError] = useState("");
  const [token, setToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorKind, setErrorKind] = useState<"generic" | "mailNotConfigured">("generic");
  const topRef = useRef<HTMLDivElement>(null);

  const fieldErr = (name: string): string | undefined => {
    const e = (errors as Record<string, { message?: string }>)[name];
    return e?.message;
  };

  // Object-URLs aufräumen.
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as never[]);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, t.steps.length - 1));
    scrollTop();
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  };

  const addFiles = (slotKey: string, list: FileList | null) => {
    if (!list || list.length === 0) return;
    setFileError("");
    const accepted = UPLOAD.acceptedTypes as readonly string[];
    const next: FileEntry[] = [];

    for (const file of Array.from(list)) {
      if (!accepted.includes(file.type)) {
        setFileError(t.validation.fileType);
        continue;
      }
      if (file.size > UPLOAD.maxFileSizeBytes) {
        setFileError(format(t.validation.fileSize, { maxSize: UPLOAD.maxFileSizeMb }));
        continue;
      }
      next.push({
        id: crypto.randomUUID(),
        slotKey,
        file,
        url: URL.createObjectURL(file),
      });
    }

    setFiles((prev) => {
      const combined = [...prev, ...next];
      if (combined.length > UPLOAD.maxFiles) {
        setFileError(format(t.validation.fileCount, { maxFiles: UPLOAD.maxFiles }));
        return combined.slice(0, UPLOAD.maxFiles);
      }
      return combined;
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const onToken = useCallback((value: string) => {
    setToken(value);
    if (value) setTurnstileError(false);
  }, []);

  const onValid = handleSubmit(async (values) => {
    if (turnstileSiteKey && !token) {
      setTurnstileError(true);
      return;
    }

    setStatus("submitting");
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        fd.append(key, typeof val === "boolean" ? String(val) : (val as string));
      });
      fd.append("locale", locale);
      if (token) fd.append("turnstileToken", token);
      files.forEach((f) => {
        fd.append("files", f.file);
        fd.append("fileSlots", f.slotKey);
      });

      const res = await fetch("/api/sell", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        scrollTop();
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
      <div ref={topRef} className="card p-8 text-center sm:p-12">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
          <CheckIcon className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold text-brand-black">{t.success.title}</h2>
        <p className="mx-auto mt-3 max-w-md text-brand-gray">{t.success.text}</p>
      </div>
    );
  }

  return (
    <div ref={topRef} className="card overflow-hidden">
      {/* Fortschritt */}
      <div className="border-b border-brand-line bg-brand-surface px-5 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-brand-black">
            {format(t.stepProgress, { current: step + 1, total: t.steps.length })}
          </p>
          <p className="text-sm font-medium text-brand-red">{t.steps[step].title}</p>
        </div>
        <ol className="mt-4 flex gap-2">
          {t.steps.map((s, i) => (
            <li key={s.key} className="flex-1">
              <div
                className={clsx(
                  "h-1.5 rounded-full transition-colors",
                  i <= step ? "bg-brand-red" : "bg-brand-line",
                )}
              />
              <span
                className={clsx(
                  "mt-2 hidden text-xs font-medium sm:block",
                  i === step ? "text-brand-black" : "text-brand-mute",
                )}
              >
                {s.short}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <form onSubmit={onValid} noValidate className="p-5 sm:p-8">
        {/* Schritt 1 – Kontakt */}
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="name"
              label={t.fields.name.label}
              placeholder={t.fields.name.placeholder}
              required
              autoComplete="name"
              registration={register("name")}
              error={fieldErr("name")}
            />
            <TextField
              id="city"
              label={t.fields.city.label}
              placeholder={t.fields.city.placeholder}
              optionalLabel={optionalLabel}
              autoComplete="address-level2"
              registration={register("city")}
              error={fieldErr("city")}
            />
            <TextField
              id="phone"
              label={t.fields.phone.label}
              placeholder={t.fields.phone.placeholder}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              registration={register("phone")}
              error={fieldErr("phone")}
            />
            <TextField
              id="email"
              label={t.fields.email.label}
              placeholder={t.fields.email.placeholder}
              type="email"
              inputMode="email"
              autoComplete="email"
              registration={register("email")}
              error={fieldErr("email")}
            />
            <SelectField
              id="preferredContact"
              label={t.fields.preferredContact.label}
              options={t.fields.preferredContact.options}
              registration={register("preferredContact")}
              error={fieldErr("preferredContact")}
              className="sm:col-span-2 sm:max-w-xs"
            />
          </div>
        )}

        {/* Schritt 2 – Fahrzeug */}
        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="make" label={t.fields.make.label} placeholder={t.fields.make.placeholder} required registration={register("make")} error={fieldErr("make")} />
            <TextField id="model" label={t.fields.model.label} placeholder={t.fields.model.placeholder} required registration={register("model")} error={fieldErr("model")} />
            <TextField id="year" label={t.fields.year.label} placeholder={t.fields.year.placeholder} required inputMode="numeric" registration={register("year")} error={fieldErr("year")} />
            <TextField id="mileage" label={t.fields.mileage.label} placeholder={t.fields.mileage.placeholder} required inputMode="numeric" registration={register("mileage")} error={fieldErr("mileage")} />
            <SelectField id="fuel" label={t.fields.fuel.label} placeholder={t.fields.fuel.placeholder} options={t.fields.fuel.options} required registration={register("fuel")} error={fieldErr("fuel")} />
            <SelectField id="transmission" label={t.fields.transmission.label} placeholder={t.fields.transmission.placeholder} options={t.fields.transmission.options} required registration={register("transmission")} error={fieldErr("transmission")} />
            <TextField id="power" label={t.fields.power.label} placeholder={t.fields.power.placeholder} optionalLabel={optionalLabel} inputMode="numeric" registration={register("power")} error={fieldErr("power")} />
            <TextField id="huValid" label={t.fields.huValid.label} placeholder={t.fields.huValid.placeholder} optionalLabel={optionalLabel} registration={register("huValid")} error={fieldErr("huValid")} />
            <SelectField id="accidentFree" label={t.fields.accidentFree.label} placeholder={t.fields.accidentFree.placeholder} options={t.fields.accidentFree.options} required registration={register("accidentFree")} error={fieldErr("accidentFree")} />
            <SelectField id="serviceHistory" label={t.fields.serviceHistory.label} placeholder={t.fields.serviceHistory.placeholder} options={t.fields.serviceHistory.options} required registration={register("serviceHistory")} error={fieldErr("serviceHistory")} />
            <TextField id="previousOwners" label={t.fields.previousOwners.label} placeholder={t.fields.previousOwners.placeholder} optionalLabel={optionalLabel} inputMode="numeric" registration={register("previousOwners")} error={fieldErr("previousOwners")} />
            <SelectField id="roadworthy" label={t.fields.roadworthy.label} placeholder={t.fields.roadworthy.placeholder} options={t.fields.roadworthy.options} required registration={register("roadworthy")} error={fieldErr("roadworthy")} />
            <TextField id="priceExpectation" label={t.fields.priceExpectation.label} placeholder={t.fields.priceExpectation.placeholder} optionalLabel={optionalLabel} inputMode="numeric" registration={register("priceExpectation")} error={fieldErr("priceExpectation")} className="sm:col-span-2 sm:max-w-xs" />
          </div>
        )}

        {/* Schritt 3 – Zustand */}
        {step === 2 && (
          <div className="grid gap-5">
            <TextAreaField id="damages" label={t.fields.damages.label} placeholder={t.fields.damages.placeholder} optionalLabel={optionalLabel} registration={register("damages")} error={fieldErr("damages")} />
            <TextAreaField id="equipment" label={t.fields.equipment.label} placeholder={t.fields.equipment.placeholder} optionalLabel={optionalLabel} registration={register("equipment")} error={fieldErr("equipment")} />
            <TextAreaField id="lastService" label={t.fields.lastService.label} placeholder={t.fields.lastService.placeholder} optionalLabel={optionalLabel} registration={register("lastService")} error={fieldErr("lastService")} />
            <TextAreaField id="notes" label={t.fields.notes.label} placeholder={t.fields.notes.placeholder} optionalLabel={optionalLabel} registration={register("notes")} error={fieldErr("notes")} />
          </div>
        )}

        {/* Schritt 4 – Fotos + Einwilligung */}
        {step === 3 && (
          <div className="grid gap-6">
            <div className="rounded-xl border border-brand-line bg-brand-surface p-4 text-sm text-brand-gray">
              <p>{format(t.photos.intro, { maxFiles: UPLOAD.maxFiles, maxSize: UPLOAD.maxFileSizeMb })}</p>
              <p className="mt-2 text-brand-mute">{t.photos.note}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.photos.slots.map((slot) => {
                const slotFiles = files.filter((f) => f.slotKey === slot.key);
                return (
                  <div key={slot.key} className="rounded-xl border border-brand-line p-4">
                    <p className="text-sm font-medium text-brand-ink">{slot.label}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {slotFiles.map((f) => (
                        <div
                          key={f.id}
                          className="group relative h-16 w-16 overflow-hidden rounded-lg border border-brand-line"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.url} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile(f.id)}
                            aria-label={t.photos.remove}
                            className="absolute right-0.5 top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-black/80 text-white"
                          >
                            <CloseIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <label className="inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-brand-line text-2xl text-brand-mute transition-colors hover:border-brand-red hover:text-brand-red">
                        +
                        <input
                          type="file"
                          accept={UPLOAD.acceptAttr}
                          multiple={slot.key === "more"}
                          className="sr-only"
                          onChange={(e) => {
                            addFiles(slot.key, e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {fileError && (
              <p className="field-error" role="alert">
                {fileError}
              </p>
            )}

            {/* Einwilligung */}
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0 rounded border-brand-line text-brand-red focus:ring-brand-red/40"
                  {...register("privacy")}
                />
                <span className="text-sm text-brand-gray">
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

            {/* Turnstile */}
            {turnstileSiteKey && (
              <div>
                <Turnstile siteKey={turnstileSiteKey} onToken={onToken} />
                {turnstileError && (
                  <p className="field-error" role="alert">
                    {t.validation.turnstile}
                  </p>
                )}
              </div>
            )}

            {/* Fehler beim Senden */}
            {status === "error" && (
              <div className="rounded-xl border border-brand-red/30 bg-brand-red/5 p-4">
                <p className="text-sm text-brand-red">
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
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={goBack} className="btn-ghost">
              {t.buttons.back}
            </button>
          ) : (
            <span />
          )}

          {step < t.steps.length - 1 ? (
            <button type="button" onClick={goNext} className="btn-primary btn-lg">
              {t.buttons.next}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button type="submit" disabled={status === "submitting"} className="btn-primary btn-lg">
              {status === "submitting" ? t.buttons.sending : t.buttons.submit}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
