import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "Ocorrencias",
  description: "Sistema de registro de ocorrencias"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
