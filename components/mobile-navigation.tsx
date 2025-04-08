"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, BarChart2, Repeat, Star, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavigation() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Listen for resize events
    window.addEventListener("resize", checkMobile)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide navigation when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false)
      } else {
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", checkMobile)
    }
  }, [lastScrollY])

  // Only render on mobile
  if (!isMobile) {
    return null
  }

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Markets", icon: BarChart2 },
    { href: "/compare", label: "Compare", icon: Repeat },
    { href: "/watchlist", label: "Watchlist", icon: Star },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 ios-bottom-padding"
      initial={{ y: 100 }}
      animate={{ y: visible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/80 backdrop-blur-md border-t border-teal-500/20 px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center py-1">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center rounded-full p-1 transition-colors",
                    isActive ? "text-teal-500" : "text-gray-400 hover:text-gray-300",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>

                  {isActive && (
                    <motion.div
                      className="absolute -bottom-2 w-1 h-1 bg-teal-500 rounded-full"
                      layoutId="navIndicator"
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
