"use client";

import Image from "next/image";
import { clsx } from "clsx";
import { GlowCard } from "@/components/ui/spotlight-card";
import { PinIcon } from "./icons";

type Props = {
  /** Pfad zum echten Bild (z. B. "/images/standort.jpg"). Leer = Platzhalter. */
  src?: string;
  alt: string;
  /** Hinweistext, der im Platzhalter erscheint. */
  placeholderLabel: string;
  className?: string;
  rounded?: string;
  priority?: boolean;
  sizes?: string;
  /** Roter Spotlight-Rand um das Bild. */
  glow?: boolean;
};

/**
 * Zeigt entweder ein echtes Bild (next/image, optimiert + lazy) oder einen
 * dezenten, markengerechten Platzhalter, solange kein Bild hinterlegt ist.
 */
export function Media({
  src,
  alt,
  placeholderLabel,
  className,
  rounded = "rounded-2xl",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  glow = false,
}: Props) {
  const hasImage = Boolean(src && src.trim().length > 0);

  const frameClass = clsx(
    "relative overflow-hidden bg-brand-surface",
    !glow && "border border-brand-line",
    rounded,
    className,
  );

  const content = hasImage ? (
    <Image
      src={src as string}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover rounded-[inherit]"
    />
  ) : (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(120%_120%_at_50%_0%,#1c1d22_0%,#0b0b0c_60%)] text-center rounded-[inherit]">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-brand-red">
        <PinIcon className="h-6 w-6" />
      </span>
      <span className="px-6 text-sm font-medium text-white/70">{placeholderLabel}</span>
    </div>
  );

  if (glow) {
    return (
      <GlowCard
        glowColor="red"
        customSize
        className={clsx("w-full overflow-hidden p-0", rounded)}
      >
        <div
          className={clsx(
            "relative overflow-hidden bg-brand-surface",
            rounded,
            className,
          )}
        >
          {content}
        </div>
      </GlowCard>
    );
  }

  return <div className={frameClass}>{content}</div>;
}
