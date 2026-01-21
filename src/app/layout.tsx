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
  keywords: [
    "caterers in India",
    "wedding caterers",
    "corporate catering",
    "party catering",
    "food catering services",
    "catering menu",
    "catering prices",
    "book caterers online",
    "best caterers",
    "verified caterers",
    "event catering",
    "birthday party catering",
    "caterbazar",
    "cater bazar"
  ],
  authors: [{ name: "Cater Bazar" }],
  creator: "Cater Bazar",
  publisher: "Cater Bazar",
  metadataBase: new URL("https://www.caterbazar.com"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "WzNq9MQgUm82_1IK_P49MLO-ch_NbFxIqPxy_WwJB9o",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.caterbazar.com",
    siteName: "Cater Bazar",
    title: "Cater Bazar – Find Top Caterers in India | Compare Menus & Book Online",
    description: "Find verified caterers across India with Cater Bazar. Compare menus, pricing, cuisines, and services for weddings, corporate events, parties, and more. Book best caterers with best prices & reviews.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Cater Bazar - Find Top Caterers in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cater Bazar – Find Top Caterers in India | Compare Menus & Book Online",
    description: "Find verified caterers across India with Cater Bazar. Compare menus, pricing, cuisines, and services for weddings, corporate events, parties, and more.",
    images: ["/images/logo.png"],
    creator: "@caterbazar",
    site: "@caterbazar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cater Bazar",
    url: "https://www.caterbazar.com",
    logo: "https://www.caterbazar.com/images/logo.png",
    description: "Find verified caterers across India with Cater Bazar. Compare menus, pricing, cuisines, and services for weddings, corporate events, parties, and more.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://www.facebook.com/caterbazar",
      "https://www.instagram.com/caterbazar",
      "https://twitter.com/caterbazar",
    ],
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthCookieSync />
        {children}
      </body>
    </html>
  );
}
