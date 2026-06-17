import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes, sectionPath, sections } from "@/lib/nav";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu, type NavItem } from "./MobileMenu";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const nav: NavItem[] = [
    { label: dict.nav.vehicles, href: sectionPath(locale, sections.vehicles) },
    { label: dict.nav.sell, href: localePath(locale, routes.sell) },
    { label: dict.nav.appointment, href: localePath(locale, routes.appointment) },
    { label: dict.nav.about, href: sectionPath(locale, sections.about) },
    { label: dict.nav.contact, href: localePath(locale, routes.contact) },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-line/80 bg-white/85 backdrop-blur-md">
      <div className="container flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href={localePath(locale, routes.home)}
          aria-label={`${dict.nav.home} – Wegner Automobile`}
          className="shrink-0"
        >
          <Logo size={56} priority />
        </Link>

        {/* Desktop-Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-surface hover:text-brand-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SocialIcons className="hidden sm:flex" />
          <LanguageSwitcher current={locale} label={dict.nav.language} />
          <Link
            href={localePath(locale, routes.sell)}
            className="btn-primary hidden md:inline-flex"
          >
            {dict.common.offerCar}
          </Link>
          <MobileMenu
            items={nav}
            labels={{ open: dict.nav.openMenu, close: dict.nav.closeMenu }}
            cta={{
              sell: { label: dict.common.offerCar, href: localePath(locale, routes.sell) },
              appointment: {
                label: dict.common.bookAppointment,
                href: localePath(locale, routes.appointment),
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
