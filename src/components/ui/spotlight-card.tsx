"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { clsx } from "clsx";

type GlowColor = "blue" | "purple" | "green" | "red" | "orange";

const glowColorMap: Record<GlowColor, { base: number; spread: number }> = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 40 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
} as const;

type GlowCardProps = {
  children?: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  size?: keyof typeof sizeMap;
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
};

const glowElements = new Set<HTMLElement>();
let pointerListenerAttached = false;

function syncGlowPointer(event: PointerEvent) {
  glowElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    el.style.setProperty("--x", x.toFixed(2));
    el.style.setProperty("--y", y.toFixed(2));
    el.style.setProperty("--xp", (x / Math.max(rect.width, 1)).toFixed(4));
    el.style.setProperty("--yp", (y / Math.max(rect.height, 1)).toFixed(4));
  });
}

function ensurePointerListener() {
  if (pointerListenerAttached || typeof window === "undefined") return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.addEventListener("pointermove", syncGlowPointer, { passive: true });
  pointerListenerAttached = true;
}

function releasePointerListener() {
  if (!pointerListenerAttached || glowElements.size > 0) return;
  document.removeEventListener("pointermove", syncGlowPointer);
  pointerListenerAttached = false;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "red",
  size = "md",
  width,
  height,
  customSize = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { base, spread } = glowColorMap[glowColor];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", String(rect.width / 2));
    el.style.setProperty("--y", String(rect.height / 2));
    el.style.setProperty("--xp", "0.5");
    el.style.setProperty("--yp", "0.5");

    glowElements.add(el);
    ensurePointerListener();

    return () => {
      glowElements.delete(el);
      releasePointerListener();
    };
  }, []);

  const baseStyles: CSSProperties & Record<string, string | number> = {
    "--base": base,
    "--spread": spread,
    "--radius": "16",
    "--border": "2",
    "--size": "200",
    "--saturation": glowColor === "red" ? 92 : 100,
    "--lightness": glowColor === "red" ? 48 : 55,
    "--bg-spot-opacity": 0.08,
    "--border-spot-opacity": 0.9,
    "--border-light-opacity": 0.35,
    "--x": "50%",
    "--y": "50%",
    "--xp": "0.5",
    "--yp": "0.5",
  };

  if (width !== undefined) baseStyles.width = width;
  if (height !== undefined) baseStyles.height = height;

  return (
    <div
      ref={cardRef}
      data-glow=""
      style={baseStyles}
      className={clsx(
        "relative isolate",
        !customSize && sizeMap[size],
        !customSize && "aspect-[3/4]",
        customSize && "glow-card--image",
        className,
      )}
    >
      <div data-glow-layer="" aria-hidden="true" className="pointer-events-none" />
      <div className="relative z-[1] w-full">{children}</div>
    </div>
  );
}
