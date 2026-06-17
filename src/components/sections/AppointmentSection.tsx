import type { Dictionary } from "@/i18n/dictionaries";
import { externalLinks, site } from "@/lib/site";
import { sections } from "@/lib/nav";
import { Section, SectionHeader } from "@/components/Section";
import { CalendarEmbed } from "@/components/CalendarEmbed";
import { CheckIcon } from "@/components/icons";

export function AppointmentSection({
  dict,
  variant = "white",
}: {
  dict: Dictionary;
  variant?: "white" | "surface";
}) {
  return (
    <Section id={sections.appointment} variant={variant}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        <div>
          <SectionHeader
            eyebrow={dict.appointment.eyebrow}
            title={dict.appointment.title}
            subtitle={dict.appointment.subtitle}
          />
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-mute">
              {dict.appointment.typesTitle}
            </h3>
            <ul className="mt-4 grid gap-2.5">
              {dict.appointment.types.map((type) => (
                <li key={type} className="flex items-center gap-3 text-brand-ink">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  {type}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <CalendarEmbed
          url={externalLinks.googleCalendar.url}
          isConfigured={externalLinks.googleCalendar.isConfigured}
          labels={{
            title: dict.appointment.calendarTitle,
            embedNote: dict.appointment.embedNote,
            loadCalendar: dict.appointment.loadCalendar,
            fallbackCta: dict.appointment.fallbackCta,
            notConfigured: dict.appointment.notConfigured,
          }}
          fallback={{
            phone: site.phoneE164,
            email: site.email,
            callLabel: dict.common.callNow,
            mailLabel: dict.common.sendEmail,
          }}
        />
      </div>
    </Section>
  );
}
