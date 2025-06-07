import type React from "react"
import { Inter } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header" // Ensure Header is imported
import { Providers } from "./providers" // Ensure Providers is imported

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ViraLink - Connect & Amplify",
  description: "Platform to connect creators and promoters for viral content distribution.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header /> {/* Moved Header inside Providers */}
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </ThemeProvider>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
