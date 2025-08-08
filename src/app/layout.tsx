import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Favicon from "/public/favicon.ico";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/Navbar";
import UserStatus from "@/components/UserStatus"; 

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Opogacela",
  description: "esquemas y recursos para opositores",
  icons: [{ rel: "icon", url: Favicon.src }],
};

// Convertimos el layout en un componente async
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "lg:min-h-screen h-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          {/* Pasamos el componente de servidor UserStatus como una prop al Navbar */}
          <Navbar userStatus={<UserStatus />} />
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
