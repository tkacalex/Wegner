import Image from "next/image";
import { clsx } from "clsx";
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
}: Props) {
  const hasImage = Boolean(src && src.trim().length > 0);

  return (
    <div
      className={clsx(
        "relative overflow-hidden border border-brand-line bg-brand-surface",
        rounded,
        className,
      )}
    >
      {hasImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(120%_120%_at_50%_0%,#1c1d22_0%,#0b0b0c_60%)] text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-brand-red">
            <PinIcon className="h-6 w-6" />
          </span>
          <span className="px-6 text-sm font-medium text-white/70">{placeholderLabel}</span>
        </div>
      )}
    </div>
  );
}
