import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { directionsUrl, externalLinks, mapsPlaceUrl, site } from "@/lib/site";
import { localePath, routes, sections } from "@/lib/nav";
import { Section, SectionHeader } from "@/components/Section";
import { MapEmbed } from "@/components/MapEmbed";
import {
  PinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@/components/icons";

export function LocationSection({
  locale,
  dict,
  variant = "white",
}: {
  locale: Locale;
  dict: Dictionary;
  variant?: "white" | "surface";
}) {
  const hours = dict.location.hours;

  return (
    <Section id={sections.contact} variant={variant}>
      <SectionHeader
        eyebrow={dict.location.eyebrow}
        title={dict.location.title}
        subtitle={dict.location.subtitle}
        prominentEyebrow
        className="mb-10"
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Infospalte */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="card p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-surface text-brand-red">
              <PinIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold uppercase tracking-wider text-brand-mute">
              {dict.location.addressTitle}
            </h3>
            <p className="mt-2 text-brand-ink">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </p>
          </div>

          <div className="card p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-surface text-brand-red">
              <PhoneIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold uppercase tracking-wider text-brand-mute">
              {dict.location.contactTitle}
            </h3>
            <p className="mt-2 space-y-1 text-brand-ink">
              <a href={`tel:${site.phoneE164}`} className="block hover:text-brand-red">
                {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} className="block break-all hover:text-brand-red">
                {site.email}
              </a>
            </p>
          </div>

          <div className="card p-6 sm:col-span-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-surface text-brand-red">
              <ClockIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold uppercase tracking-wider text-brand-mute">
              {dict.location.hoursTitle}
            </h3>
            <dl className="mt-3 divide-y divide-brand-line text-sm">
              {[hours.weekdays, hours.saturday, hours.sunday].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2">
                  <dt className="font-medium text-brand-ink">{row.label}</dt>
                  <dd className="text-brand-gray">{row.time}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {dict.common.planRoute}
              </a>
              <a href={`mailto:${site.email}`} className="btn-outline">
                <MailIcon className="h-4 w-4" />
                {dict.common.sendEmail}
              </a>
              <Link href={localePath(locale, routes.appointment)} className="btn-outline">
                {dict.common.bookAppointment}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Karte */}
        <MapEmbed
          embedUrl={externalLinks.googleMapsEmbed.url}
          isConfigured={externalLinks.googleMapsEmbed.isConfigured}
          externalUrl={mapsPlaceUrl}
          labels={{
            consent: dict.location.map.consent,
            load: dict.location.map.load,
            openExternal: dict.location.map.openExternal,
            iframeTitle: dict.location.map.iframeTitle,
          }}
        />
      </div>
    </Section>
  );
}
