"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SparklesProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
}

export const SparklesCore = ({
  id,
  className,
  background,
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = "#FFF",
  particleDensity = 100,
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  // Setup canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Handle resize
    const handleResize = () => {
      if (!canvas) return

      // Set canvas dimensions
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      // Create particles based on canvas size
      const particleCount = Math.min(
        Math.max(Math.floor((canvas.width * canvas.height) / 10000) * particleDensity, 100),
        1000,
      )

      // Initialize particles
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
      }))
    }

    // Initial setup
    handleResize()
    window.addEventListener("resize", handleResize)

    // Animation function
    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (background) {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      particlesRef.current.forEach((particle) => {
        // Update particle position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()
      })

      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [background, maxSize, minSize, particleColor, particleDensity, speed])

  return <canvas ref={canvasRef} id={id} className={cn("absolute inset-0", className)} />
}

