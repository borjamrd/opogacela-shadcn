import "./globals.css"
import { Inter as FontSans } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


export const metadata: Metadata = {
  title: "Opogacela",
  description: "esquemas y recursos para opositores",
};

export default function RootLayout({
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
      > <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
