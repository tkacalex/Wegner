import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { AppointmentForm } from "@/components/form/AppointmentForm";
import { Section, SectionHeader } from "@/components/Section";
import { CheckIcon } from "@/components/icons";
import { localePath, routes, sections } from "@/lib/nav";
import { site } from "@/lib/site";

export function AppointmentSection({
  locale,
  dict,
  variant = "white",
  defaultFormOpen = false,
}: {
  locale: Locale;
  dict: Dictionary;
  variant?: "white" | "surface";
  defaultFormOpen?: boolean;
}) {
  return (
    <Section id={sections.appointment} variant={variant}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          <SectionHeader title={dict.appointment.title} subtitle={dict.appointment.subtitle} />
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

        <div className="min-w-0">
          <AppointmentForm
            locale={locale}
            t={dict.appointment.form}
            validation={dict.appointment.validation}
            optionalLabel={dict.common.optional}
            privacyHref={localePath(locale, routes.privacy)}
            contact={{ phone: site.phoneE164, email: site.email }}
            fallbackLabels={{ call: dict.common.callNow, mail: dict.common.sendEmail }}
            phoneDisplay={site.phoneDisplay}
            emailDisplay={site.email}
            fallbackPhoneLabel={dict.appointment.fallback.phoneLabel}
            fallbackEmailLabel={dict.appointment.fallback.emailLabel}
            defaultOpen={defaultFormOpen}
          />
        </div>
      </div>
    </Section>
  );
}
