import type { Dictionary } from "@/i18n/dictionaries";
import { Section, SectionHeader } from "@/components/Section";
import {
  CheckIcon,
  PinIcon,
  PhoneIcon,
} from "@/components/icons";

/** kleine, dezente Icons je Trust-Punkt (rein dekorativ). */
const ICONS = [CheckIcon, CheckIcon, CheckIcon, CheckIcon, PinIcon, PhoneIcon];

export function TrustSection({ dict }: { dict: Dictionary }) {
  return (
    <Section variant="white">
      <SectionHeader
        eyebrow={dict.trust.eyebrow}
        title={dict.trust.title}
        align="center"
        className="mb-12"
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dict.trust.items.map((item, i) => {
          const Icon = ICONS[i] ?? CheckIcon;
          return (
            <li
              key={item.title}
              className="card group p-6 transition-shadow duration-200 hover:shadow-card-lg"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-surface text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-brand-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray">{item.text}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
