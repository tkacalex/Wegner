import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { externalLinks, photos, site } from "@/lib/site";
import { localePath, routes, sectionPath, sections } from "@/lib/nav";
import { Media } from "@/components/Media";
import { ExternalIcon, PinIcon, ClockIcon } from "@/components/icons";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* dezenter Hintergrundverlauf */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_85%_0%,rgba(225,17,34,0.06)_0%,transparent_60%)]"
      />
      <div className="container grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-24">
        <div className="animate-fade-up">
          <h1 className="heading-xl text-brand-black">{dict.hero.title}</h1>

          <p className="lead mt-5 max-w-xl">{dict.hero.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={externalLinks.autoScout24.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-lg"
            >
              {dict.hero.ctaPrimary}
              <ExternalIcon className="h-4 w-4" />
            </a>
            <Link href={sectionPath(locale, sections.contact)} className="btn-outline btn-lg">
              {dict.nav.contact}
            </Link>
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm text-brand-gray">
            <div className="flex items-center gap-2">
              <PinIcon className="h-5 w-5 text-brand-red" />
              <dd>
                {site.address.street}, {site.address.postalCode} {site.address.city}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-brand-red" />
              <dd>
                {dict.location.hours.weekdays.label} {dict.location.hours.weekdays.time} ·{" "}
                {dict.location.hours.saturday.label} {dict.location.hours.saturday.time}
              </dd>
            </div>
          </dl>
        </div>

        <div className="animate-fade-in lg:pl-4">
          <Media
            src={photos.hero}
            alt={dict.hero.imageAlt}
            placeholderLabel={dict.hero.imagePlaceholder}
            priority
            glow
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] w-full shadow-card-lg lg:aspect-[5/4]"
          />
        </div>
      </div>
    </section>
  );
}
