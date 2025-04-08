"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { SparklesCore } from "@/components/ui/sparkles"

interface SimpleSplineProps {
  url: string
  className?: string
}

export function SimpleSpline({ url, className = "" }: SimpleSplineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Handle script load success
  const handleScriptLoad = () => {
    console.log("Spline script loaded successfully")
    setScriptLoaded(true)
  }

  // Handle script load error
  const handleScriptError = () => {
    console.error("Failed to load Spline script")
    setError(true)
    setLoading(false)
  }

  useEffect(() => {
    // Set a timeout to consider loading failed after 8 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Spline loading timed out")
        setError(true)
        setLoading(false)
      }
    }, 8000)

    return () => clearTimeout(timeout)
  }, [loading])

  // Create the spline viewer once the script is loaded
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || error) return

    try {
      // Clear previous content
      containerRef.current.innerHTML = ""

      // Create iframe as a more reliable way to embed Spline
      const iframe = document.createElement("iframe")
      iframe.style.width = "100%"
      iframe.style.height = "100%"
      iframe.style.border = "none"
      iframe.src = url
      iframe.onload = () => setLoading(false)
      iframe.onerror = () => {
        console.error("Failed to load Spline iframe")
        setError(true)
        setLoading(false)
      }

      containerRef.current.appendChild(iframe)
    } catch (err) {
      console.error("Error creating Spline iframe:", err)
      setError(true)
      setLoading(false)
    }
  }, [scriptLoaded, url, error])

  // Fallback content
  if (error) {
    return (
      <div className={`w-full h-full relative ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black"></div>
        <SparklesCore
          id="sparkles"
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
  }

  return (
    <div className={`relative ${className}`}>
      {/* Load the Spline script */}
      <Script
        src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        strategy="afterInteractive"
      />

      {/* Container for the Spline viewer */}
      <div ref={containerRef} className="w-full h-full"></div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-primary animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
          </div>
        </div>
      )}
    </div>
  )
}
