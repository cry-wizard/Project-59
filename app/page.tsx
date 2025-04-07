"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, BarChart2, Coins, Wallet, Zap, ChevronDown, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { TrackedCoin } from "@/components/tracked-coin"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TeamSection } from "@/components/team-section"
import { motion } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { ThreeScene } from "@/components/three-scene"
import { CryptoChart3D } from "@/components/crypto-chart-3d"

// Import the ResponsiveContainer component
import { ResponsiveContainer } from "@/components/responsive-container"

// Animated text gradient
const GradientText = ({ children, className = "" }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500 ${className}`}>
      {children}
    </span>
  )
}

// Featured coins with live data
const FeaturedCoins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
]

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null)

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with 3D Model */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Use ThreeScene instead of Spline */}
          <ThreeScene type="particles" color="#b405f4" className="w-full h-full" />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-2 text-teal-500 flex items-center"
            >
              <div className="h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></div>
              <span className="text-sm uppercase tracking-wider font-medium">Live Market Data</span>
              <div className="h-2 w-2 rounded-full bg-teal-500 ml-2 animate-pulse"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              <GradientText>Trade</GradientText>Xis
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8"
            >
              The next generation cryptocurrency trading platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-12 max-w-3xl"
            >
              {FeaturedCoins.map((coin, index) => (
                <Link href={`/coin/${coin.id}`} key={coin.id}>
                  <div className="bg-black/30 backdrop-blur-md border border-teal-500/20 rounded-xl p-4 flex items-center gap-3 hover:bg-teal-500/10 transition-all">
                    <div className="relative h-8 w-8">
                      <Image
                        src={`/coin-images/${coin.id}.png`}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = "/coin-images/placeholder.png"
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-white">{coin.symbol}</p>
                      <p className="text-xs text-gray-400">{coin.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  Explore Markets <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-500"
                >
                  Create Account
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="max-w-md w-full mx-auto"
            >
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = e.currentTarget.querySelector("input")
                  if (input && input.value) {
                    window.location.href = `/pika?q=${encodeURIComponent(input.value)}`
                  }
                }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for crypto..."
                  className="pl-10 pr-20 h-12 bg-black/30 backdrop-blur-md border-teal-500/20 focus-visible:ring-teal-500"
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  Search
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-16"
            >
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full flex items-center gap-1 text-gray-400 hover:text-white"
                onClick={() => {
                  const featuresSection = document.getElementById("features")
                  featuresSection?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Scroll to learn more <ChevronDown className="h-4 w-4 animate-bounce" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3D Chart Section - Replace the previous 3D model */}
      <section className="relative py-24 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 container mx-auto px-4 relative z-10">
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <GradientText>Visualize</GradientText> Your Investments
              </h2>
              <p className="text-gray-300 mb-6">
                Our advanced 3D visualization tools help you understand market trends and make better investment
                decisions.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="bg-teal-500/20 p-1 rounded-full mr-3 mt-1">
                    <Zap className="h-4 w-4 text-teal-500" />
                  </div>
                  <p className="text-gray-400">Real-time price movements in stunning 3D visuals</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal-500/20 p-1 rounded-full mr-3 mt-1">
                    <Zap className="h-4 w-4 text-teal-500" />
                  </div>
                  <p className="text-gray-400">Interactive models that respond to market changes</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-teal-500/20 p-1 rounded-full mr-3 mt-1">
                    <Zap className="h-4 w-4 text-teal-500" />
                  </div>
                  <p className="text-gray-400">Intuitive interface for both beginners and experts</p>
                </li>
              </ul>
              <Link href="/dashboard">
                <Button className="rounded-full px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
                  Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-[500px] relative rounded-xl overflow-hidden border border-teal-500/20"
          >
            <CryptoChart3D />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 overflow-hidden" ref={targetRef}>
        {/* Content remains the same */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black"></div>
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-30">
            <defs>
              <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)"></rect>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Powerful</GradientText> Crypto Trading Tools
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              TradeXis provides real-time data, advanced analytics, and powerful tools to help you make informed trading
              decisions.
            </p>
          </motion.div>

          {/* Update the sections to use ResponsiveContainer for better responsiveness */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <ResponsiveContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-all"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 p-3 rounded-full w-fit mb-4">
                    <BarChart2 className="h-6 w-6 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Real-Time Dashboard</h3>
                  <p className="text-gray-400 mb-4">
                    Track cryptocurrency prices, market caps, and trading volumes in real-time with our intuitive
                    dashboard.
                  </p>
                  <Link href="/dashboard" className="text-teal-500 hover:text-teal-400 inline-flex items-center group">
                    Explore Dashboard{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <motion.div
                  className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-all"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 p-3 rounded-full w-fit mb-4">
                    <Coins className="h-6 w-6 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Coin Comparison</h3>
                  <p className="text-gray-400 mb-4">
                    Compare performance metrics between any two cryptocurrencies to identify investment opportunities.
                  </p>
                  <Link href="/compare" className="text-teal-500 hover:text-teal-400 inline-flex items-center group">
                    Compare Coins{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <motion.div
                  className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-all"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 p-3 rounded-full w-fit mb-4">
                    <Wallet className="h-6 w-6 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Token Swapping</h3>
                  <p className="text-gray-400 mb-4">
                    Connect your MetaMask wallet to swap tokens directly from our platform with minimal fees.
                  </p>
                  <Link href="/swap" className="text-teal-500 hover:text-teal-400 inline-flex items-center group">
                    Try Swapping{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </ResponsiveContainer>
          </section>
        </div>
      </section>

      {/* Live Coin Tracker Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <GradientText>Live</GradientText> Coin Tracker
            </motion.h2>
            <motion.p
              className="text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Stay updated with real-time prices of top cryptocurrencies
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TrackedCoin coinId="bitcoin" />
            <TrackedCoin coinId="ethereum" />
            <TrackedCoin coinId="solana" />
            <TrackedCoin coinId="cardano" />
          </div>

          <div className="mt-10 text-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
              >
                View All Coins <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Start <GradientText>Trading</GradientText>?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Create an account now to access all features and start tracking your favorite cryptocurrencies.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="rounded-full px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
              >
                Sign Up Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-teal-500/20 hover:bg-teal-500/10 hover:text-teal-500"
              >
                Explore Platform
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-teal-500/20 py-12">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TradeXis</h3>
              <p className="text-gray-400">Advanced cryptocurrency trading and analytics platform.</p>
              <div className="mt-4 flex items-center">
                <ThemeToggle />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Compare
                  </Link>
                </li>
                <li>
                  <Link href="/watchlist" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Watchlist
                  </Link>
                </li>
                <li>
                  <Link href="/swap" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Swap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/signup" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signin" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-teal-500 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-teal-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} TradeXis. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.878 2.525c.636-.247 1.363-.416 2.427-.465C10.372 2.013 10.712 2 12.315 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

