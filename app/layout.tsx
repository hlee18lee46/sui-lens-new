import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "@mysten/dapp-kit/dist/index.css"; // ✅ import here (not in CSS)
import { Providers } from "./providers";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenSui Lens - Smart Contract Viewer",
  description: "Explore and analyze Sui blockchain smart contracts",
  generator: "v0.app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
