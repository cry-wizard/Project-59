"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [prevPath, setPrevPath] = useState("")

  useEffect(() => {
    // Show loading screen when path changes
    if (prevPath !== pathname && prevPath !== "") {
      setLoading(true)

      // Hide loading screen after a delay
      const timer = setTimeout(
        () => {
          setLoading(false)
        },
        Math.random() * 1000 + 500,
      ) // Random time between 500-1500ms

      return () => clearTimeout(timer)
    }

    setPrevPath(pathname)
  }, [pathname, prevPath])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">Loading</h2>
            <p className="text-muted-foreground">Please wait while we fetch your data...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
