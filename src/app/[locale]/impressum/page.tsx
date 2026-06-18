import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/lib/nav";
import { LegalContent } from "@/components/LegalContent";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const dict = getDictionary(params.locale);
  return {
    ...buildMetadata(params.locale, routes.imprint, dict.meta.imprint),
    robots: { index: false, follow: true },
  };
}

export default function ImprintPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  const i = dict.legal.imprint;

  return <LegalContent title={i.title} sections={i.sections} />;
}
