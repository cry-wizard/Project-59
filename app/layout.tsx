import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/lib/auth-context"
import { LoadingScreen } from "@/components/loading-screen"
import { AiAssistant } from "@/components/ai-assistant"
// Add the animated gradient background to the layout

import { AnimatedGradientBackground } from "@/components/animated-gradient-background"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TradeXis - Cryptocurrency Trading Platform",
  description: "Advanced cryptocurrency trading and analytics platform",
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AnimatedGradientBackground />
            <LoadingScreen />
            <Navbar />
            {children}
            <AiAssistant />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"



import './globals.css'