"use client"

import { useEffect, useRef } from "react"

interface AnimatedGradientBackgroundProps {
  className?: string
}

export function AnimatedGradientBackground({ className = "" }: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create gradient points
    const gradientPoints = [
      { x: canvas.width * 0.2, y: canvas.height * 0.2, color: "rgba(180, 5, 244, 0.3)", radius: canvas.width * 0.4 },
      { x: canvas.width * 0.8, y: canvas.height * 0.8, color: "rgba(0, 255, 209, 0.3)", radius: canvas.width * 0.4 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, color: "rgba(100, 100, 255, 0.2)", radius: canvas.width * 0.3 },
    ]

    // Animation variables
    let animationFrameId: number
    let time = 0

    // Animation function
    const animate = () => {
      time += 0.005

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update gradient positions
      gradientPoints.forEach((point, index) => {
        point.x = canvas.width * (0.3 + 0.4 * Math.sin(time + (index * Math.PI) / 3))
        point.y = canvas.height * (0.3 + 0.4 * Math.cos(time + (index * Math.PI) / 3))
      })

      // Draw gradients
      gradientPoints.forEach((point) => {
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius)
        gradient.addColorStop(0, point.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Continue animation
      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />
}
