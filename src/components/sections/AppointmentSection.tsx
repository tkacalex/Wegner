import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { sections } from "@/lib/nav";
import { Section, SectionHeader } from "@/components/Section";
import { CheckIcon, PhoneIcon } from "@/components/icons";

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

        <div className="card p-8 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface text-brand-red">
            <PhoneIcon className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-brand-black">
            {dict.appointment.contactTitle}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-brand-gray">{dict.appointment.contactText}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={`tel:${site.phoneE164}`} className="btn-primary">
              {dict.common.callNow}
            </a>
            <a href={`mailto:${site.email}`} className="btn-outline">
              {dict.common.sendEmail}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
