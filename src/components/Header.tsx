import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes, sectionPath, sections } from "@/lib/nav";
import { externalLinks, site } from "@/lib/site";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const instagramCard = dict.social.cards.find((c) => c.key === "instagram");
  const tiktokCard = dict.social.cards.find((c) => c.key === "tiktok");

  return (
    <header className="sticky top-0 z-40 border-b border-brand-line/80 bg-white/85 backdrop-blur-md">
      <div className="container flex h-16 min-w-0 items-center justify-between gap-2 sm:h-[4.5rem] sm:gap-3">
        <Link
          href={localePath(locale, routes.home)}
          aria-label={`${dict.nav.home} – Wegner Automobile`}
          className="shrink-0"
        >
          <Logo size={50} priority className="sm:hidden" />
          <Logo size={64} priority className="hidden sm:block" />
        </Link>

        {/* Desktop-Navigation */}
        <nav className="hidden min-w-0 items-center gap-1 lg:flex">
          <Link
            href={sectionPath(locale, sections.vehicles)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-surface hover:text-brand-black"
          >
            {dict.nav.vehicles}
          </Link>
          <Link
            href={localePath(locale, routes.sell)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-surface hover:text-brand-black"
          >
            {dict.nav.sell}
          </Link>
          <Link
            href={localePath(locale, routes.appointment)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-surface hover:text-brand-black"
          >
            {dict.nav.appointment}
          </Link>
          <Link
            href={sectionPath(locale, sections.about)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-surface hover:text-brand-black"
          >
            {dict.nav.about}
          </Link>
          <Link
            href={localePath(locale, routes.contact)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-surface hover:text-brand-black"
          >
            {dict.nav.contact}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <SocialIcons variant="compact" className="lg:gap-1" />
          <LanguageSwitcher current={locale} label={dict.nav.language} compact />
          <Link
            href={localePath(locale, routes.sell)}
            className="btn-primary hidden md:inline-flex"
          >
            {dict.common.offerCar}
          </Link>
          <MobileMenu
            labels={{
              open: dict.nav.openMenu,
              close: dict.nav.closeMenu,
              title: dict.nav.menuTitle,
            }}
            ctas={{
              vehicles: {
                label: dict.common.viewOnAutoScout,
                href: externalLinks.autoScout24.url,
              },
              sell: {
                label: dict.common.offerCar,
                href: localePath(locale, routes.sell),
              },
              appointment: {
                label: dict.common.bookAppointment,
                href: localePath(locale, routes.appointment),
              },
            }}
            links={{
              about: {
                label: dict.nav.about,
                href: sectionPath(locale, sections.about),
              },
              contact: {
                label: dict.nav.contact,
                href: localePath(locale, routes.contact),
              },
              instagram: {
                label: instagramCard?.label ?? "Instagram",
                href: site.social.instagram,
              },
              tiktok: {
                label: tiktokCard?.label ?? "TikTok",
                href: site.social.tiktok,
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
