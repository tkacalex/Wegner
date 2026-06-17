import type { Dictionary } from "@/i18n/dictionaries";
import { photos } from "@/lib/site";
import { sections } from "@/lib/nav";
import { Section } from "@/components/Section";
import { Media } from "@/components/Media";
import { CheckIcon } from "@/components/icons";

export function AboutSection({ dict }: { dict: Dictionary }) {
  return (
    <Section id={sections.about} variant="surface">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <Media
            src={photos.about}
            alt={dict.about.imageAlt}
            placeholderLabel={dict.about.imagePlaceholder}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] w-full shadow-card"
          />
        </div>

        <div className="order-1 lg:order-2">
          <span className="eyebrow">{dict.about.eyebrow}</span>
          <h2 className="heading-lg mt-3 text-brand-black">{dict.about.title}</h2>
          <p className="lead mt-4">{dict.about.text}</p>

          <div className="mt-8 rounded-2xl border border-brand-line bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-mute">
              {dict.about.factsTitle}
            </h3>
            <ul className="mt-4 grid gap-2.5">
              {dict.about.facts.map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-sm text-brand-ink">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
