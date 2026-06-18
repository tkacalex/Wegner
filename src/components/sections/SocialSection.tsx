import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { Section, SectionHeader } from "@/components/Section";
import { InstagramIcon, TikTokIcon, ExternalIcon } from "@/components/icons";

const ICONS = { instagram: InstagramIcon, tiktok: TikTokIcon } as const;
const URLS = { instagram: site.social.instagram, tiktok: site.social.tiktok } as const;

export function SocialSection({ dict }: { dict: Dictionary }) {
  return (
    <Section variant="white">
      <SectionHeader
        eyebrow={dict.social.eyebrow}
        title={dict.social.title}
        subtitle={dict.social.text}
        align="center"
        prominentEyebrow
        className="mb-10"
      />
      <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
        {dict.social.cards.map((card) => {
          const key = card.key as keyof typeof ICONS;
          const Icon = ICONS[key];
          const url = URLS[key];
          return (
            <a
              key={card.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex items-center gap-4 p-6 transition-shadow duration-200 hover:shadow-card-lg"
            >
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-black text-white transition-colors group-hover:bg-brand-red">
                <Icon className="h-7 w-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-lg font-semibold text-brand-black">
                  {card.label}
                  <ExternalIcon className="h-4 w-4 text-brand-mute transition-colors group-hover:text-brand-red" />
                </span>
                <span className="block text-sm text-brand-gray">{card.text}</span>
              </span>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
