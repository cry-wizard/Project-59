"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative overflow-hidden"
    >
      {/* Light bulb effect */}
      {theme === "light" && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-yellow-100 rounded-full"
          style={{ zIndex: -1 }}
        />
      )}

      {/* Stars effect for dark mode */}
      {theme === "dark" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 overflow-hidden"
          style={{ zIndex: -1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * 24 - 12,
                y: Math.random() * 24 - 12,
                opacity: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5 + Math.random() * 2,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}

      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-teal-200" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
