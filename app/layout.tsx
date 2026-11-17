import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lakes Dance | Brainerd Lakes Dance Community",
  description: "Discover, post, and join dance events in the Brainerd Lakes area. Socials, classes, ballroom, line dancing and more.",
  openGraph: {
    title: "Lakes Dance | Brainerd Lakes Dance Community",
    description: "Where the Lakes come to dance. Find socials, classes, and community events.",
    url: "https://lakes-dance.vercel.app",
    siteName: "Lakes Dance",
    images: [
      {
        url: "https://lakes-dance.vercel.app/thumbnail.jpg",
        width: 1200,
        height: 800,
        alt: "Paul Bunyan watching people dance by the lake",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lakes Dance | Brainerd Lakes Dance Community",
    description: "Where the Lakes come to dance. Find socials, classes, and community events.",
    images: ["https://lakes-dance.vercel.app/thumbnail.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
