import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./mobile.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/lib/auth-context"
import { LoadingScreen } from "@/components/loading-screen"
import { AdvancedAiAssistant } from "@/components/advanced-ai-assistant"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { MobileNavigation } from "@/components/mobile-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TradeXis - Cryptocurrency Trading Platform",
  description: "Advanced cryptocurrency trading and analytics platform",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  themeColor: "#b405f4",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TradeXis",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div id="app-root" className="ios-status-bar-padding">
              <AnimatedGradientBackground />
              <LoadingScreen />
              <Navbar />
              {children}
              <AdvancedAiAssistant />
              <MobileNavigation />
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'