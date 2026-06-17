import Image from "next/image";
import { clsx } from "clsx";

type LogoProps = {
  className?: string;
  /** Höhe in px (Breite = Höhe, das Logo ist rund). */
  size?: number;
  priority?: boolean;
};

/**
 * Offizielles Wegner-Automobile-Logo (public/wegnerlogo.png).
 * Das Logo ist eine runde Marke auf weißem Quadrat – mit `rounded-full`
 * wird es sauber kreisförmig dargestellt und wirkt auf hellem wie dunklem
 * Hintergrund gleichermaßen gut.
 */
export function Logo({ className, size = 48, priority = false }: LogoProps) {
  return (
    <Image
      src="/wegnerlogo.png"
      alt="Wegner Automobile"
      width={size}
      height={size}
      priority={priority}
      className={clsx("rounded-full object-cover", className)}
    />
  );
}
