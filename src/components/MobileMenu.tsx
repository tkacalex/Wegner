"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { MenuIcon, CloseIcon } from "./icons";

type CtaLink = { label: string; href: string };

type Props = {
  labels: { open: string; close: string; title: string };
  ctas: {
    vehicles: CtaLink;
    sell: CtaLink;
    appointment: CtaLink;
  };
  links: {
    about: CtaLink;
    contact: CtaLink;
    instagram: CtaLink;
    tiktok: CtaLink;
  };
};

export function MobileMenu({ labels, ctas, links }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const navLinkClass =
    "block rounded-xl px-3 py-3 text-base font-medium text-brand-ink transition-colors hover:bg-brand-surface";

  const overlay =
    mounted &&
    createPortal(
      <div
        className={clsx(
          "fixed inset-0 z-[100] flex flex-col bg-white transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={labels.title}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-brand-line px-4 py-3.5">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-mute">
            {labels.title}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label={labels.close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-line text-brand-black"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          <div className="flex flex-col gap-3">
            <a
              href={ctas.vehicles.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="btn-primary btn-lg w-full"
            >
              {ctas.vehicles.label}
            </a>
            <Link href={ctas.sell.href} onClick={close} className="btn-dark btn-lg w-full">
              {ctas.sell.label}
            </Link>
            <Link href={ctas.appointment.href} onClick={close} className="btn-outline btn-lg w-full">
              {ctas.appointment.label}
            </Link>
          </div>

          <nav className="mt-8" aria-label={labels.title}>
            <ul className="flex flex-col gap-1 border-t border-brand-line pt-6">
              <li>
                <Link href={links.about.href} onClick={close} className={navLinkClass}>
                  {links.about.label}
                </Link>
              </li>
              <li>
                <Link href={links.contact.href} onClick={close} className={navLinkClass}>
                  {links.contact.label}
                </Link>
              </li>
              <li>
                <a
                  href={links.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className={navLinkClass}
                >
                  {links.instagram.label}
                </a>
              </li>
              <li>
                <a
                  href={links.tiktok.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className={navLinkClass}
                >
                  {links.tiktok.label}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>,
      document.body,
    );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labels.open}
        aria-expanded={open}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-line text-brand-black sm:h-10 sm:w-10"
      >
        <MenuIcon className="h-5 w-5" />
      </button>
      {overlay}
    </div>
  );
}
