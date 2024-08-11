import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Favicon from "/public/favicon.ico";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Opogacela",
  description: "esquemas y recursos para opositores",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <meta
        name="trustpilot-one-time-domain-verification-id"
        content="2068c8b5-05a4-4a1c-8fe2-7c1a3c88913a"
      />
      <body
        className={cn(
          "lg:min-h-screen h-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Analytics />
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
