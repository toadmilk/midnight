import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { DATA } from "@/data/data";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from '@/components/Providers';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: DATA.appName,
    template: `%s | ${DATA.appName}`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.appName}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.appName}`,
    locale: "en_US",
    type: "website",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={cn('min-h-screen font-sans', fontSans.variable)}>
          <ThemeProvider attribute="class" defaultTheme="system">
            <Navbar/>
            {children}
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
