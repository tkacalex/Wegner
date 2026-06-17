import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { routes } from "@/lib/nav";
import { autoDealerJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { LocationSection } from "@/components/sections/LocationSection";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return buildMetadata(params.locale, routes.contact, dict.meta.contact);
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={autoDealerJsonLd(siteUrl, `${siteUrl}/wegnerlogo.png`)} />
      <LocationSection locale={locale} dict={dict} variant="white" />
    </>
  );
}
