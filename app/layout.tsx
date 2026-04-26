import type { Metadata } from "next";
import { Geist, Geist_Mono, Amethysta, Caesar_Dressing } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amethysta = Amethysta({
  variable: "--font-amethysta",
  subsets: ["latin"],
  weight: "400",
});

const caesarDressing = Caesar_Dressing({
  variable: "--font-caesar-dressing",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Adawwa",
  description: "Adawwa - An enchanting evening celebrating the rich heritage of Sri Lankan Tropical Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${amethysta.variable} ${caesarDressing.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
