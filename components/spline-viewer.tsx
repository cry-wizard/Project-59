"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Application } from "@splinetool/runtime"
import { motion } from "framer-motion"

interface SplineViewerProps {
  scene: string
  className?: string
  style?: React.CSSProperties
  fallbackContent?: React.ReactNode
}

export function SplineViewer({ scene, className = "", style = {}, fallbackContent }: SplineViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [app, setApp] = useState<Application | null>(null)

  // Clean up function to properly dispose the Spline application
  const cleanupSpline = () => {
    if (app) {
      try {
        app.dispose()
      } catch (e) {
        console.error("Error disposing Spline app:", e)
      }
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    let splineApp: Application | null = null
    let loadTimeout: NodeJS.Timeout | null = null

    const loadScene = async () => {
      try {
        setLoading(true)
        setError(false)

        // Clear any existing app
        cleanupSpline()

        // Create a new Spline application
        splineApp = new Application(canvas)
        setApp(splineApp)

        // Set a timeout to prevent infinite loading
        loadTimeout = setTimeout(() => {
          console.error("Spline scene loading timeout")
          setError(true)
          setLoading(false)
        }, 10000)

        // Try to load the scene
        await splineApp.load(scene)

        // If we get here, clear the timeout and set loading to false
        if (loadTimeout) clearTimeout(loadTimeout)
        setLoading(false)
      } catch (err) {
        console.error("Failed to load Spline scene:", err)
        setError(true)
        setLoading(false)
        if (loadTimeout) clearTimeout(loadTimeout)
      }
    }

    loadScene()

    // Cleanup function
    return () => {
      if (loadTimeout) clearTimeout(loadTimeout)
      cleanupSpline()
    }
  }, [scene])

  // If there's an error and fallback content is provided, show it
  if (error && fallbackContent) {
    return (
      <div className={`relative ${className}`} style={style}>
        {fallbackContent}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <canvas ref={canvasRef} className="w-full h-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-primary animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
          </div>
        </div>
      )}

      {error && !fallbackContent && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-xs text-center">
            <p className="text-destructive font-medium mb-2">Failed to load 3D scene</p>
            <p className="text-sm text-muted-foreground mb-4">We're experiencing issues loading the 3D content.</p>
            <div className="flex justify-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
