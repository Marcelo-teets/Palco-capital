import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palco Capital — Antecipação de Recebíveis para Produtores de Eventos",
  description: "Libere o capital do seu evento antes da data. Antecipação de recebíveis de ingressos com aprovação rápida e sem burocracia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
