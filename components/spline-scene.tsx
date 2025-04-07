"use client"

import type React from "react"

import { useState } from "react"
import Spline from "@splinetool/react-spline/next"
import { SparklesCore } from "@/components/ui/sparkles"

interface SplineSceneProps {
  scene: string
  className?: string
  fallbackContent?: React.ReactNode
}

export function SplineScene({ scene, className = "", fallbackContent }: SplineSceneProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Handle successful load
  const handleLoad = () => {
    console.log("Spline scene loaded successfully")
    setLoading(false)
    setError(false)
  }

  // Handle errors
  const handleError = (e: any) => {
    console.error("Failed to load Spline scene:", e)
    setError(true)
    setLoading(false)
  }

  // Default fallback content if none provided
  const defaultFallback = (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black"></div>
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#fff"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-20 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-40 blur-md"></div>
          <div className="absolute inset-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-60 blur-sm"></div>
          <div className="absolute inset-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-80"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">TradeXis</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`relative ${className}`}>
      {!error && <Spline scene={scene} onLoad={handleLoad} onError={handleError} className="w-full h-full" />}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-primary animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
          </div>
        </div>
      )}

      {error && <div className="absolute inset-0">{fallbackContent || defaultFallback}</div>}
    </div>
  )
}

