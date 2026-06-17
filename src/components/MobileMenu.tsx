"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { MenuIcon, CloseIcon, ArrowRightIcon } from "./icons";
import { SocialIcons } from "./SocialIcons";

export type NavItem = { label: string; href: string };

type Props = {
  items: NavItem[];
  labels: { open: string; close: string };
  cta: { sell: { label: string; href: string }; appointment: { label: string; href: string } };
};

export function MobileMenu({ items, labels, cta }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Bei Navigation schließen.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Body-Scroll sperren, wenn offen.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labels.open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-line text-brand-black"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-brand-black/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Panel */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col bg-white shadow-card-lg transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-mute">
            Menü
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={labels.close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-line text-brand-black"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-3 py-3.5 text-lg font-medium text-brand-ink transition-colors hover:bg-brand-surface"
                >
                  {item.label}
                  <ArrowRightIcon className="h-5 w-5 text-brand-mute" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-brand-line px-5 py-5">
          <Link href={cta.sell.href} className="btn-primary btn-lg w-full">
            {cta.sell.label}
          </Link>
          <Link href={cta.appointment.href} className="btn-outline btn-lg w-full">
            {cta.appointment.label}
          </Link>
          <div className="flex justify-center pt-1">
            <SocialIcons />
          </div>
        </div>
      </div>
    </div>
  );
}
