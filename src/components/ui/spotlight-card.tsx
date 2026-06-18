"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { clsx } from "clsx";

type GlowColor = "red" | "blue" | "green" | "purple" | "orange";

const GLOW_PRESETS: Record<
  GlowColor,
  { base: number; spread: number; rgb: string }
> = {
  red: { base: 0, spread: 40, rgb: "225 17 34" },
  blue: { base: 220, spread: 40, rgb: "59 130 246" },
  green: { base: 120, spread: 40, rgb: "34 197 94" },
  purple: { base: 280, spread: 40, rgb: "168 85 247" },
  orange: { base: 30, spread: 40, rgb: "249 115 22" },
};

type GlowCardProps = {
  children?: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
};

export function GlowCard({
  children,
  className,
  glowColor = "red",
  width,
  height,
  customSize = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const preset = GLOW_PRESETS[glowColor];

  const resetGlow = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--glow-x", "50%");
    el.style.setProperty("--glow-y", "50%");
  }, []);

  const onPointerMove = useCallback((event: PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;

    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    });
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) return;

    el.classList.add("glow-card--interactive");
    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerleave", resetGlow, { passive: true });

    return () => {
      el.classList.remove("glow-card--interactive");
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", resetGlow);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [onPointerMove, resetGlow]);

  const baseStyles: CSSProperties & Record<string, string | number> = {
    "--glow-base": preset.base,
    "--glow-spread": preset.spread,
    "--glow-color": preset.rgb,
    "--glow-x": "50%",
    "--glow-y": "50%",
  };

  if (width !== undefined) baseStyles.width = width;
  if (height !== undefined) baseStyles.height = height;

  return (
    <div
      ref={cardRef}
      className={clsx("glow-card", !customSize && "w-full", className)}
      style={baseStyles}
    >
      <div aria-hidden="true" className="glow-card__border" />
      <div aria-hidden="true" className="glow-card__shine" />
      <div className={clsx("glow-card__content", !customSize && "h-full w-full")}>
        {children}
      </div>
    </div>
  );
}
