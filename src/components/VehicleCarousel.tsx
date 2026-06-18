"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Vehicle } from "@/lib/vehicles";
import { GlowCard } from "@/components/ui/spotlight-card";
import { ArrowRightIcon, ExternalIcon } from "./icons";

type Props = {
  vehicles: Vehicle[];
  labels: { details: string; prev: string; next: string };
};

export function VehicleCarousel({ vehicles, labels }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Steuerung */}
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label={labels.prev}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
        >
          <ArrowRightIcon className="h-5 w-5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label={labels.next}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {vehicles.map((v) => (
          <a
            key={v.id}
            data-card
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-[88%] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:border-brand-red sm:w-[52%] lg:w-[38%]"
          >
            <GlowCard
              glowColor="red"
              customSize
              className="overflow-hidden rounded-none p-0"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-gray">
                {v.image ? (
                  <Image
                    src={v.image}
                    alt={v.title}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 32vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
                {v.price && (
                  <span className="absolute left-3 top-3 z-[1] rounded-lg bg-brand-red px-2.5 py-1 text-sm font-bold text-white shadow-card">
                    {v.price}
                  </span>
                )}
              </div>
            </GlowCard>

            <div className="p-6">
              <h3 className="truncate text-xl font-semibold text-white sm:text-2xl">{v.title}</h3>
              <p className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-base text-white/60">
                {[v.year, v.mileage, v.fuel, v.power].filter(Boolean).join(" · ")}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-base font-semibold text-brand-red">
                {labels.details}
                <ExternalIcon className="h-4 w-4" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
