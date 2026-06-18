import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { localePath, routes, sectionPath, sections } from "@/lib/nav";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";
import { PhoneIcon, MailIcon, PinIcon } from "./icons";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: dict.nav.vehicles, href: sectionPath(locale, sections.vehicles) },
    { label: dict.nav.sell, href: localePath(locale, routes.sell) },
    { label: dict.nav.appointment, href: localePath(locale, routes.appointment) },
    { label: dict.nav.about, href: sectionPath(locale, sections.about) },
    { label: dict.nav.contact, href: localePath(locale, routes.contact) },
  ];

  return (
    <footer className="border-t border-white/10 bg-brand-black text-white/80">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Marke */}
          <div>
            <Logo size={72} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              {dict.footer.tagline}
            </p>
            <div className="mt-5">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/45">
                {dict.footer.socialTitle}
              </p>
              <SocialIcons variant="footer" />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.navTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/65 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.legalTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href={localePath(locale, routes.imprint)}
                  className="text-white/65 transition-colors hover:text-white"
                >
                  {dict.footer.imprint}
                </Link>
              </li>
              <li>
                <Link
                  href={localePath(locale, routes.privacy)}
                  className="text-white/65 transition-colors hover:text-white"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.contactTitle}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                <span className="text-white/75">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneE164}`}
                  className="flex items-center gap-2.5 text-white/75 transition-colors hover:text-white"
                >
                  <PhoneIcon className="h-5 w-5 shrink-0 text-brand-red" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 break-all text-white/75 transition-colors hover:text-white"
                >
                  <MailIcon className="h-5 w-5 shrink-0 text-brand-red" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
