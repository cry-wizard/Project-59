"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ResponsiveContainer({ children, className, delay = 0 }: ResponsiveContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </motion.div>
  )
}

