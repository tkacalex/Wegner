# Wegner Automobile – Website

Moderne, mehrsprachige Premium-Website für **Wegner Automobile**, Egelsbach –
Gebrauchtwagen kaufen, Auto verkaufen und Termin vereinbaren.

Gebaut mit **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** und
eigener, schlanker **i18n** (Deutsch / Russisch / Englisch). Optimiert für
**Vercel**, Local-SEO und KI-Suchen (GEO).

---

## Schnellstart

```bash
npm install
cp .env.example .env.local   # Werte eintragen (siehe unten)
npm run dev                  # http://localhost:3000  ->  /de
```

Weitere Befehle:

```bash
npm run build   # Produktions-Build (inkl. Typecheck + Lint)
npm run start   # Build lokal starten
npm run lint    # ESLint
```

---

## Was muss noch eingetragen werden? (Checkliste)

Alle Platzhalter sind bewusst markiert, damit nichts erfunden wird.

| Was | Wo | Status |
|-----|----|--------|
| **AutoScout24-Link** | `.env.local` → `NEXT_PUBLIC_AUTOSCOUT24_URL` | TODO |
| **Google-Kalender-Buchungslink** | `.env.local` → `NEXT_PUBLIC_GOOGLE_CALENDAR_URL` | TODO |
| **Google-Maps Embed-URL** (optional) | `.env.local` → `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | optional |
| **E-Mail-Versand (Resend)** | `.env.local` → `RESEND_API_KEY`, `MAIL_FROM` | TODO |
| **Spam-Schutz (Turnstile)** | `.env.local` → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | optional |
| **Logo (offizielle Datei)** | `public/logo.svg` ersetzen oder `src/components/Logo.tsx` anpassen | Platzhalter aktiv |
| **Standort-Foto** | Bild nach `public/images/` legen, Pfad in `src/lib/site.ts` → `photos.exterior` | Platzhalter aktiv |
| **Geo-Koordinaten** | `src/lib/site.ts` → `site.geo` (lat/lng) | TODO |
| **Impressum / Datenschutz** | `src/messages/*.json` → `legal.*` (alle `[TODO]`-Stellen) | rechtlich prüfen |

> Solange ein Link fehlt, zeigt die Seite einen sauberen Hinweis bzw. Fallback
> (Telefon/E-Mail) statt eines kaputten Buttons.

---

## Umgebungsvariablen

Siehe [`.env.example`](.env.example). Wichtig:

- `NEXT_PUBLIC_*` sind **öffentlich** (landen im Browser).
- `RESEND_API_KEY` und `TURNSTILE_SECRET_KEY` sind **geheim** – niemals committen.
- Auf Vercel unter **Project → Settings → Environment Variables** eintragen.

`NEXT_PUBLIC_SITE_URL` setzt die kanonische Basis-URL (für Sitemap, OG, JSON-LD).
Auf Vercel wird ersatzweise automatisch `VERCEL_URL` genutzt.

---

## Deployment auf Vercel

1. Repository zu GitHub/GitLab pushen (oder `vercel` CLI nutzen).
2. In Vercel importieren – Framework „Next.js“ wird automatisch erkannt.
3. Environment Variables aus `.env.example` eintragen.
4. Deploy. Fertig.
5. **Custom Domain später**: in Vercel unter *Settings → Domains* hinzufügen und
   anschließend `NEXT_PUBLIC_SITE_URL` auf die finale Domain setzen
   (für korrekte Canonicals/Sitemap).

Es ist kein zusätzliches Setup nötig (keine Datenbank, kein Adminbereich).

---

## E-Mail-Versand (Auto verkaufen)

Das Verkaufsformular sendet die Anfrage **nur per E-Mail** an
`CONTACT_EMAIL` (Standard: `wegnerautohaus@gmail.com`) über
[Resend](https://resend.com). Es gibt **keine Datenbank** und **keinen
Adminbereich**. Es werden **keine** personenbezogenen Daten in Logs geschrieben.

- Fotos werden als Anhang mitgeschickt (JPG/PNG/WEBP, max. 5 MB pro Bild,
  max. 8 Bilder, gesamt ≤ 22 MB).
- `MAIL_FROM` muss eine in Resend verifizierte Absenderdomain sein. Zum Testen
  funktioniert `onboarding@resend.dev`.
- Ohne `RESEND_API_KEY` zeigt das Formular einen freundlichen Hinweis mit
  Telefon/E-Mail als Fallback.

---

## Mehrsprachigkeit (i18n)

- Sprachen: **de** (Standard), **ru**, **en**.
- Übersetzungen in [`src/messages/`](src/messages) (`de.json`, `ru.json`, `en.json`).
  `de.json` ist die maßgebliche Struktur – neue Keys dort zuerst anlegen.
- Routing: `/{locale}/...` (z. B. `/de`, `/ru/kontakt`). `/` leitet auf `/de`.
- Sprachumschalter im Header; `hreflang`-Alternates automatisch gesetzt.

---

## Projektstruktur

```
src/
├─ app/
│  ├─ layout.tsx              # Root (Passthrough)
│  ├─ globals.css             # Designsystem (Tailwind)
│  ├─ icon.svg                # Favicon
│  ├─ robots.ts, sitemap.ts   # SEO
│  ├─ api/sell/route.ts       # E-Mail-Versand (Resend)
│  └─ [locale]/
│     ├─ layout.tsx           # <html>, Header/Footer, Metadaten
│     ├─ opengraph-image.tsx  # dynamisches OG-Bild
│     ├─ page.tsx             # Startseite
│     ├─ auto-verkaufen/      # Mehrschritt-Formular
│     ├─ termin/              # Terminbuchung (Google-Kalender-Embed)
│     ├─ kontakt/             # Standort + Karte
│     ├─ datenschutz/, impressum/
├─ components/                # UI- und Section-Komponenten
├─ i18n/                      # Locale-Konfiguration + Dictionaries
├─ lib/                       # site.ts, seo.ts, jsonld.ts, sell.ts, nav.ts …
├─ messages/                  # de.json, ru.json, en.json
└─ middleware.ts              # Locale-Redirect
```

---

## SEO / GEO

- Pro Seite: Title, Description, Canonical, `hreflang`, Open Graph, Twitter Card.
- **JSON-LD**: `AutoDealer` + `LocalBusiness`, `Organization`, `WebSite`, `FAQPage`.
- `sitemap.xml`, `robots.txt`, dynamisches OG-Bird, klare Antwortblöcke (FAQ,
  „Auf einen Blick“) für KI-Suchen.
- Geo-Koordinaten sind bewusst **leer**, bis echte Werte eingetragen sind.

---

## Wichtige Hinweise

- **Kein Fahrzeugbestand** auf der Seite – Verlinkung auf AutoScout24.
- Keine erfundenen Bewertungen, Garantien, Rechts- oder Verbrauchsdaten.
- Karte & Kalender laden **erst nach Klick** (Datenschutz).
- Impressum/Datenschutz sind **Vorlagen mit TODOs** und müssen vor der
  Veröffentlichung rechtlich geprüft werden.
