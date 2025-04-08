"use client"

import { useRef } from "react"
import { SparklesCore } from "@/components/ui/sparkles"
import { motion } from "framer-motion"

interface Fallback3DProps {
  className?: string
}

export function Fallback3D({ className = "" }: Fallback3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className={`w-full h-full relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black"></div>
      <SparklesCore
        id="sparkles-fallback"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#fff"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-40 blur-md"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
          />
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-60 blur-sm"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
          />
          <motion.div
            className="absolute inset-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-80"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">TradeXis</span>
          </div>
        </div>
      </div>
    </div>
  )
}
