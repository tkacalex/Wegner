import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { getDealerListings } from "@/lib/vehicles";
import {
  autoDealerJsonLd,
  organizationJsonLd,
  websiteJsonLd,
  faqJsonLd,
} from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { VehiclesSection } from "@/components/sections/VehiclesSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { SellTeaserSection } from "@/components/sections/SellTeaserSection";
import { AppointmentSection } from "@/components/sections/AppointmentSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { SocialSection } from "@/components/sections/SocialSection";
import { FaqSection } from "@/components/sections/FaqSection";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return buildMetadata(params.locale, "", dict.meta.home);
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const siteUrl = getSiteUrl();
  const logoUrl = `${siteUrl}/wegnerlogo.png`;
  const vehicles = await getDealerListings();

  return (
    <>
      <JsonLd data={autoDealerJsonLd(siteUrl, logoUrl)} />
      <JsonLd data={organizationJsonLd(siteUrl, logoUrl)} />
      <JsonLd data={websiteJsonLd(siteUrl)} />
      <JsonLd data={faqJsonLd(dict)} />

      <Hero locale={locale} dict={dict} />
      <VehiclesSection dict={dict} vehicles={vehicles} />
      <TrustSection dict={dict} />
      <SellTeaserSection locale={locale} dict={dict} />
      <AppointmentSection locale={locale} dict={dict} variant="white" />
      <AboutSection dict={dict} />
      <LocationSection locale={locale} dict={dict} variant="white" />
      <SocialSection dict={dict} />
      <FaqSection dict={dict} />
    </>
  );
}
