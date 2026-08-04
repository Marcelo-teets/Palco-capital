import type { Metadata } from "next";
import "@fontsource-variable/archivo";
import "@fontsource-variable/bodoni-moda";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://palco-capital.vercel.app"),
  title: {
    default: "Palco Capital — Crédito para eventos ao vivo",
    template: "%s — Palco Capital",
  },
  description:
    "Crédito privado e antecipação de recebíveis para produtores, casas de show, festivais e operadores de eventos no Brasil.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Palco Capital",
    title: "Palco Capital — Crédito para eventos ao vivo",
    description:
      "Capital estruturado para o ciclo de caixa do entretenimento ao vivo.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
