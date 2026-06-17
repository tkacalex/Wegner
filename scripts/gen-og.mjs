// Erzeugt das statische Open-Graph-Bild public/og.png (1200x630)
// mit dem echten Logo (kreisförmig) + Tagline. Plattformunabhängig via sharp.
import sharp from "sharp";

const W = 1200;
const H = 630;
const LOGO = 280;
const LX = 86;
const LY = (H - LOGO) / 2;

const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1c1d22"/>
      <stop offset="70%" stop-color="#0b0b0c"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="80" cy="92" r="9" fill="#E11122"/>
  <text x="104" y="101" font-family="Arial, Segoe UI, sans-serif" font-size="26" font-weight="700" letter-spacing="6" fill="#9CA3AF">EGELSBACH · RHEIN-MAIN</text>

  <text x="410" y="280" font-family="Arial, Segoe UI, sans-serif" font-size="48" font-weight="800" letter-spacing="-1">
    <tspan fill="#FFFFFF">Gebrauchtwagen kaufen</tspan>
  </text>
  <text x="410" y="344" font-family="Arial, Segoe UI, sans-serif" font-size="48" font-weight="800" letter-spacing="-1">
    <tspan fill="#FFFFFF">&amp; Auto verkaufen</tspan> <tspan fill="#E11122">in Egelsbach</tspan>
  </text>

  <text x="412" y="424" font-family="Arial, Segoe UI, sans-serif" font-size="25" fill="#9CA3AF">Boschring 7B, 63329 Egelsbach · 0174 4574455</text>
</svg>`;

const circleMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO}" height="${LOGO}"><circle cx="${LOGO / 2}" cy="${LOGO / 2}" r="${LOGO / 2}" fill="#fff"/></svg>`,
);

const roundLogo = await sharp("public/wegnerlogo.png")
  .resize(LOGO, LOGO, { fit: "cover" })
  .composite([{ input: circleMask, blend: "dest-in" }])
  .png()
  .toBuffer();

await sharp(Buffer.from(bg))
  .composite([{ input: roundLogo, left: LX, top: Math.round(LY) }])
  .png()
  .toFile("public/og.png");

console.log("OK: public/og.png mit echtem Logo geschrieben.");
