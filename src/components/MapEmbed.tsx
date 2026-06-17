import { ExternalIcon } from "./icons";

type Props = {
  embedUrl: string;
  isConfigured: boolean;
  externalUrl: string;
  labels: {
    consent: string;
    load: string;
    openExternal: string;
    iframeTitle: string;
  };
};

/** Standortkarte – wird direkt angezeigt (Boschring 7B, Egelsbach). */
export function MapEmbed({ embedUrl, isConfigured, externalUrl, labels }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-brand-surface">
      <div className="relative aspect-[16/10] w-full sm:aspect-[2/1] lg:aspect-auto lg:h-[420px]">
        {isConfigured ? (
          <iframe
            src={embedUrl}
            title={labels.iframeTitle}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-black">
            <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              {labels.openExternal}
              <ExternalIcon className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-brand-line bg-white py-3 text-sm font-medium text-brand-red hover:underline"
      >
        {labels.openExternal}
        <ExternalIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
