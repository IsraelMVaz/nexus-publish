import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus · Central de Canais",
  description: "Controle e geração de roteiros para os canais YouTube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-nexus-bg text-gray-100">
        {children}
      </body>
    </html>
  );
}