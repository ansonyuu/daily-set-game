import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Set Game",
  description: "Find 10 valid sets as fast as possible - a daily puzzle game based on the card game Set",
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
