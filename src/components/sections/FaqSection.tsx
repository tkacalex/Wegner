import type { Dictionary } from "@/i18n/dictionaries";
import { sections } from "@/lib/nav";
import { Section, SectionHeader } from "@/components/Section";
import { ChevronDownIcon } from "@/components/icons";

export function FaqSection({ dict }: { dict: Dictionary }) {
  return (
    <Section id={sections.faq} variant="surface">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeader eyebrow={dict.faq.eyebrow} title={dict.faq.title} />

        <div className="divide-y divide-brand-line rounded-2xl border border-brand-line bg-white">
          {dict.faq.items.map((item, i) => (
            <details key={i} className="group px-5 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-semibold text-brand-black marker:hidden">
                {item.q}
                <ChevronDownIcon className="h-5 w-5 shrink-0 text-brand-mute transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="pb-5 pr-8 text-sm leading-relaxed text-brand-gray">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
