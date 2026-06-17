# Bilder / Fotos

Hier kommen die echten Fotos hinein (z. B. das Außenbild des Standorts).

## Standort-Foto (Hero + Über uns)

1. Datei hier ablegen, z. B. `standort-egelsbach.jpg`
   (empfohlen: querformat, mind. 1600 px breit, optimiert/komprimiert).
2. In `src/lib/site.ts` den Pfad eintragen:

   ```ts
   export const photos = {
     exterior: "/images/standort-egelsbach.jpg",
   } as const;
   ```

Solange kein Pfad gesetzt ist, wird automatisch ein dezenter Platzhalter
angezeigt – die Seite bleibt also jederzeit vorzeigbar.

## Logo

Das Logo liegt als skalierbare Vektor-Datei unter `public/logo.svg` und wird
zusätzlich in `src/components/Logo.tsx` als saubere Wortmarke gerendert.
Zum Austausch gegen die offizielle Datei:

- Entweder `public/logo.svg` ersetzen (für SEO/Open-Graph/JSON-LD), **und/oder**
- `src/components/Logo.tsx` so anpassen, dass dort das offizielle Logo
  (z. B. `next/image` mit `public/logo.png`) verwendet wird.

Format-Empfehlung: SVG (ideal) oder PNG mit transparentem Hintergrund,
quadratische Variante zusätzlich für Favicon/Icon hilfreich.
