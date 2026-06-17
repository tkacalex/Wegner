import type { Dictionary } from "@/i18n/dictionaries";
import type { Vehicle } from "@/lib/vehicles";
import { externalLinks } from "@/lib/site";
import { sections } from "@/lib/nav";
import { Section, SectionHeader } from "@/components/Section";
import { VehicleCarousel } from "@/components/VehicleCarousel";
import { CheckIcon, ExternalIcon } from "@/components/icons";

export function VehiclesSection({
  dict,
  vehicles = [],
}: {
  dict: Dictionary;
  vehicles?: Vehicle[];
}) {
  const hasVehicles = vehicles.length > 0;

  return (
    <Section id={sections.vehicles} variant="dark">
      {hasVehicles ? (
        <>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow={dict.vehicles.eyebrow}
              title={dict.vehicles.title}
              subtitle={dict.vehicles.text}
              tone="light"
            />
            <a
              href={externalLinks.autoScout24.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-lg shrink-0"
            >
              {dict.vehicles.cta}
              <ExternalIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10">
            <VehicleCarousel
              vehicles={vehicles}
              labels={{
                details: dict.vehicles.carousel.details,
                prev: dict.vehicles.carousel.prev,
                next: dict.vehicles.carousel.next,
              }}
            />
          </div>
        </>
      ) : (
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow={dict.vehicles.eyebrow}
              title={dict.vehicles.title}
              subtitle={dict.vehicles.text}
              tone="light"
            />
            <a
              href={externalLinks.autoScout24.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-lg mt-8"
            >
              {dict.vehicles.cta}
              <ExternalIcon className="h-4 w-4" />
            </a>
          </div>

          <ul className="grid gap-4">
            {dict.vehicles.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span className="text-base font-medium text-white/90">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
