"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { SparklesCore } from "@/components/ui/sparkles"

interface SplineWebViewerProps {
  url: string
  className?: string
  fallbackContent?: React.ReactNode
}

export function SplineWebViewer({ url, className = "", fallbackContent }: SplineWebViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null)

  // Handle script load
  const handleScriptLoad = () => {
    console.log("Spline script loaded")
    setScriptLoaded(true)
  }

  // Handle script error
  const handleScriptError = () => {
    console.error("Failed to load Spline script")
    setError(true)
  }

  useEffect(() => {
    // Set a timeout to detect if Spline fails to load
    const timeout = setTimeout(() => {
      if (!splineLoaded) {
        console.error("Spline scene loading timed out")
        setError(true)
      }
    }, 15000) // 15 seconds timeout

    setLoadTimeout(timeout)

    // Create event listeners for the spline-viewer element
    const handleSplineLoad = () => {
      console.log("Spline scene loaded successfully")
      setSplineLoaded(true)
      if (loadTimeout) clearTimeout(loadTimeout)
    }

    const handleSplineError = (e: Event) => {
      console.error("Failed to load Spline scene:", e)
      setError(true)
      if (loadTimeout) clearTimeout(loadTimeout)
    }

    // Add event listeners once the script is loaded
    if (scriptLoaded && containerRef.current) {
      // Wait for the custom element to be defined
      setTimeout(() => {
        const splineViewer = containerRef.current?.querySelector("spline-viewer")
        if (splineViewer) {
          splineViewer.addEventListener("load", handleSplineLoad)
          splineViewer.addEventListener("error", handleSplineError)
        }
      }, 500)
    }

    return () => {
      // Clean up
      if (loadTimeout) clearTimeout(loadTimeout)
      if (containerRef.current) {
        const splineViewer = containerRef.current.querySelector("spline-viewer")
        if (splineViewer) {
          splineViewer.removeEventListener("load", handleSplineLoad)
          splineViewer.removeEventListener("error", handleSplineError)
        }
      }
    }
  }, [scriptLoaded, splineLoaded, loadTimeout])

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
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Load the Spline viewer script */}
      <Script
        src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        strategy="afterInteractive"
      />

      {/* Only render the spline-viewer when the script is loaded */}
      {scriptLoaded && !error && (
        <div
          dangerouslySetInnerHTML={{
            __html: `<spline-viewer url="${url}" loading-anim></spline-viewer>`,
          }}
        />
      )}

      {!scriptLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-primary animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D viewer...</p>
          </div>
        </div>
      )}

      {error && <div className="absolute inset-0">{fallbackContent || defaultFallback}</div>}
    </div>
  )
}

