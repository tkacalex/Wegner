"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { locales, localeNames, localeShort, type Locale } from "@/i18n/config";
import { GlobeIcon, ChevronDownIcon, CheckIcon } from "./icons";

type Props = {
  current: Locale;
  label: string;
  className?: string;
  compact?: boolean;
};

function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  // segments[0] === "" , segments[1] === aktuelle Locale
  if (segments.length > 1) {
    segments[1] = next;
  }
  const result = segments.join("/");
  return result || `/${next}`;
}

export function LanguageSwitcher({ current, label, className, compact = false }: Props) {
  const pathname = usePathname() || `/${current}`;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function select(next: Locale) {
    setOpen(false);
    if (next === current) return;
    router.push(swapLocale(pathname, next));
  }

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={clsx(
          "inline-flex items-center rounded-lg border border-brand-line font-semibold text-brand-ink transition-colors hover:border-brand-black hover:bg-brand-surface",
          compact
            ? "gap-0.5 px-1.5 py-1.5 text-xs sm:gap-1 sm:px-2 sm:py-1.5 sm:text-sm"
            : "gap-1.5 px-2.5 py-2 text-sm",
        )}
      >
        <GlobeIcon className={clsx(compact ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-4 w-4")} />
        <span>{localeShort[current]}</span>
        <ChevronDownIcon
          className={clsx(
            compact ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-4 w-4",
            "transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-brand-line bg-white py-1 shadow-card-lg"
        >
          {locales.map((loc) => (
            <li key={loc}>
              <button
                type="button"
                role="option"
                aria-selected={loc === current}
                onClick={() => select(loc)}
                className={clsx(
                  "flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-brand-surface",
                  loc === current ? "font-semibold text-brand-black" : "text-brand-gray",
                )}
              >
                <span>{localeNames[loc]}</span>
                {loc === current && <CheckIcon className="h-4 w-4 text-brand-red" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
