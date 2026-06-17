import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { site, turnstile } from "@/lib/site";
import { localePath, routes } from "@/lib/nav";
import { SellForm } from "@/components/form/SellForm";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return buildMetadata(params.locale, routes.sell, dict.meta.sell);
}

export default function SellPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <section className="section bg-brand-surface">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{dict.sellTeaser.eyebrow}</span>
          <h1 className="heading-lg mt-3 text-brand-black">{dict.sell.title}</h1>
          <p className="lead mt-4">{dict.sell.subtitle}</p>
          <p className="mt-3 text-sm text-brand-mute">{dict.sell.intro}</p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <SellForm
            locale={locale}
            t={dict.sell}
            optionalLabel={dict.common.optional}
            privacyHref={localePath(locale, routes.privacy)}
            contact={{ phone: site.phoneE164, email: site.email }}
            fallbackLabels={{ call: dict.common.callNow, mail: dict.common.sendEmail }}
            turnstileSiteKey={turnstile.siteKey}
          />
        </div>
      </div>
    </section>
  );
}
