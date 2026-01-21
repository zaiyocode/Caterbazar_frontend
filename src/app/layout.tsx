import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthCookieSync from "@/components/AuthCookieSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cater Bazar – Find Top Caterers in India | Compare Menus & Book Online",
  description: "Find verified caterers across India with Cater Bazar. Compare menus, pricing, cuisines, and services for weddings, corporate events, parties, and more. Book best caterers with best prices & reviews.",
  verification: {
    google: "WzNq9MQgUm82_1IK_P49MLO-ch_NbFxIqPxy_WwJB9o",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthCookieSync />
        {children}
      </body>
    </html>
  );
}
