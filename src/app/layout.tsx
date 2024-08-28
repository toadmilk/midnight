import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { constructMetaData, DATA } from '@/data/data';
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = constructMetaData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={cn('min-h-screen font-sans', fontSans.variable)}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Toaster />
            <Navbar/>
            {children}
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  );
}
