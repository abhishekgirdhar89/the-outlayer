import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings, resolveSiteUrl } from "@/lib/data";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = resolveSiteUrl(settings.site_url);
  const defaultImage = (settings.default_og_image || "").trim();
  const title = "The Outlayer — Strategy that gets built · Abhishek Girdhar";
  const description =
    "The independent practice of Abhishek Girdhar — strategy, operations and technology for founders and operators. The non-obvious move, built.";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s",
    },
    description,
    openGraph: {
      type: "website",
      siteName: settings.brand_name || "The Outlayer",
      title,
      description,
      images: defaultImage ? [defaultImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
      <GoogleAnalytics measurementId={settings.ga_measurement_id} />
    </html>
  );
}
