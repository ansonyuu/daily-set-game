import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Daily Set",
  description: "Find 10 valid sets as fast as possible - a daily puzzle game based on the card game Set",
  metadataBase: new URL('https://set.ansonyu.me'),
  openGraph: {
    title: "The Daily Set",
    description: "Find 10 valid sets as fast as possible - a daily puzzle game",
    type: "website",
    siteName: "The Daily Set",
  },
  twitter: {
    card: "summary",
    title: "The Daily Set",
    description: "Find 10 valid sets as fast as possible - a daily puzzle game",
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-grey">
        {children}
      </body>
    </html>
  );
}
