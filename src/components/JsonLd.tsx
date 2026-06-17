/** Rendert ein JSON-LD-Script sicher in den DOM. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify ist hier sicher; es werden nur eigene, statische Daten serialisiert.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
