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
    ...buildMetadata(params.locale, routes.privacy, dict.meta.privacy),
    robots: { index: false, follow: true },
  };
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  const p = dict.legal.privacy;

  return <LegalContent title={p.title} intro={p.intro} sections={p.sections} />;
}
