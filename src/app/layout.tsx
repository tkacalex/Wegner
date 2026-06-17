import type { ReactNode } from "react";
import "./globals.css";

/**
 * Root-Layout. Die eigentliche <html>/<body>-Struktur wird im
 * locale-spezifischen Layout (app/[locale]/layout.tsx) gesetzt, damit das
 * lang-Attribut zur aktiven Sprache passt.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
