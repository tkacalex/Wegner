import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes, sections } from "@/lib/nav";
import { Section } from "@/components/Section";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export function SellTeaserSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Section id={sections.sell} variant="surface">
      <div className="card overflow-hidden">
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-12 lg:p-14">
          <div>
            <span className="eyebrow">{dict.sellTeaser.eyebrow}</span>
            <h2 className="heading-lg mt-3 text-brand-black">{dict.sellTeaser.title}</h2>
            <p className="lead mt-4">{dict.sellTeaser.subtitle}</p>

            <Link href={localePath(locale, routes.sell)} className="btn-primary btn-lg mt-7">
              {dict.sellTeaser.cta}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <ul className="grid gap-3">
            {dict.sellTeaser.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span className="text-base text-brand-ink">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
