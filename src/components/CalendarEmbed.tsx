"use client";

import { useState } from "react";
import { CalendarIcon, ExternalIcon } from "./icons";

type Props = {
  url: string;
  isConfigured: boolean;
  labels: {
    title: string;
    embedNote: string;
    loadCalendar: string;
    fallbackCta: string;
    notConfigured: string;
  };
  fallback: { phone: string; email: string; callLabel: string; mailLabel: string };
};

export function CalendarEmbed({ url, isConfigured, labels, fallback }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (!isConfigured) {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface text-brand-red">
          <CalendarIcon className="h-6 w-6" />
        </span>
        <p className="mx-auto mt-4 max-w-md text-brand-gray">{labels.notConfigured}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={`tel:${fallback.phone}`} className="btn-primary">
            {fallback.callLabel}
          </a>
          <a href={`mailto:${fallback.email}`} className="btn-outline">
            {fallback.mailLabel}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line px-5 py-4">
        <span className="inline-flex items-center gap-2 font-semibold text-brand-black">
          <CalendarIcon className="h-5 w-5 text-brand-red" />
          {labels.title}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red hover:underline"
        >
          {labels.fallbackCta}
          <ExternalIcon className="h-4 w-4" />
        </a>
      </div>

      {loaded ? (
        <iframe
          src={url}
          title={labels.title}
          className="h-[620px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <p className="max-w-md text-sm text-brand-gray">{labels.embedNote}</p>
          <button type="button" onClick={() => setLoaded(true)} className="btn-dark">
            {labels.loadCalendar}
          </button>
        </div>
      )}
    </div>
  );
}
