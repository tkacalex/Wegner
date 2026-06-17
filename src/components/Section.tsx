import type { ReactNode } from "react";
import { clsx } from "clsx";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Hintergrund-Variante. */
  variant?: "white" | "surface" | "dark";
  containerClassName?: string;
};

export function Section({
  id,
  children,
  className,
  variant = "white",
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "section",
        variant === "surface" && "bg-brand-surface",
        variant === "dark" && "bg-brand-black text-white",
        className,
      )}
    >
      <div className={clsx("container", containerClassName)}>{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "dark",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={clsx(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={clsx(
          "heading-lg mt-3",
          tone === "light" ? "text-white" : "text-brand-black",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            "lead mt-4",
            tone === "light" && "text-white/70",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
