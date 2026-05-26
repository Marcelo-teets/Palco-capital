import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palco Capital — Crédito para eventos ao vivo",
  description: "Plataforma de crédito privado e antecipação de recebíveis para produtores, casas de show, festivais e operadores de eventos no Brasil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
