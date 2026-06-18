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
| **Google-Maps Embed-URL** (optional) | `.env.local` → `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | optional |
| **E-Mail-Versand (Gmail SMTP)** | `.env.local` → `SMTP_*`, `MAIL_FROM`, `CONTACT_EMAIL` | TODO |
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
- `SMTP_PASS` und `TURNSTILE_SECRET_KEY` sind **geheim** – niemals committen.
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

## E-Mail-Versand (Gmail SMTP)

Verkaufs- und Terminanfragen werden **nur per E-Mail** an `CONTACT_EMAIL`
(Standard: `wegnerautohaus@gmail.com`) gesendet – über **Gmail SMTP** mit
`nodemailer`. Es gibt **keine Datenbank**, **keinen Adminbereich** und **keinen
Google-Kalender**. Es werden **keine** personenbezogenen Daten in Logs geschrieben.

- Absender: `Wegner Automobile <noreply.wegner@gmail.com>` (`MAIL_FROM`)
- Für Gmail: **2-Faktor-Authentifizierung** aktivieren und ein **Google
  App-Passwort** erzeugen ([Google-Konto → App-Passwörter](https://myaccount.google.com/apppasswords)).
- Das App-Passwort nur als `SMTP_PASS` in Vercel bzw. `.env.local` speichern –
  **nicht** in GitHub committen.
- Ohne `SMTP_USER` / `SMTP_PASS` zeigen die Formulare einen freundlichen Hinweis
  mit Telefon/E-Mail als Fallback.

**Verkaufsformular:** Fotos als Anhang (JPG/PNG/WEBP, max. 5 MB pro Bild,
max. 8 Bilder, gesamt ≤ 22 MB).

**Terminformular:** Terminwunsch per Formular – Bestätigung erfolgt manuell per
Rückmeldung (Telefon/E-Mail).

**E-Mail-Vorschau (lokal):** Mit Fake-Daten, ohne Versand:

```bash
npm run gen:email-preview
```

Öffnet danach im Browser: `docs/email-preview/appointment.html` und
`docs/email-preview/sell.html`.

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
│  ├─ api/sell/route.ts          # Verkaufsanfragen per E-Mail
│  ├─ api/appointment/route.ts   # Terminanfragen per E-Mail
│  └─ [locale]/
│     ├─ layout.tsx           # <html>, Header/Footer, Metadaten
│     ├─ opengraph-image.tsx  # dynamisches OG-Bild
│     ├─ page.tsx             # Startseite
│     ├─ auto-verkaufen/      # Mehrschritt-Formular
│     ├─ termin/              # Terminanfrage-Formular
│     ├─ kontakt/             # Standort + Karte
│     ├─ datenschutz/, impressum/
├─ components/                # UI- und Section-Komponenten
├─ i18n/                      # Locale-Konfiguration + Dictionaries
├─ lib/                       # site.ts, seo.ts, jsonld.ts, sell.ts, mail.ts, emailTemplates.ts …
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
- Karte lädt **erst nach Klick** (Datenschutz).
- Impressum/Datenschutz sind **Vorlagen mit TODOs** und müssen vor der
  Veröffentlichung rechtlich geprüft werden.
