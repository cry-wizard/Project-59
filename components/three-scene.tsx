"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { motion } from "framer-motion"

interface ThreeSceneProps {
  className?: string
  style?: React.CSSProperties
  type?: "crypto" | "abstract" | "particles"
  color?: string
}

export function ThreeScene({ className = "", style = {}, type = "crypto", color = "#b405f4" }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    let scene: THREE.Scene | null = null
    let camera: THREE.PerspectiveCamera | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let animationFrameId: number | null = null
    const objects: THREE.Object3D[] = []

    try {
      setLoading(true)
      setError(false)

      // Create scene
      scene = new THREE.Scene()

      // Create camera
      const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
      camera.position.z = 5

      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      containerRef.current.appendChild(renderer.domElement)

      // Add objects based on type
      if (type === "crypto") {
        // Create a coin-like object
        const geometry = new THREE.CylinderGeometry(2, 2, 0.2, 32)
        const material = new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.8,
          roughness: 0.2,
        })
        const coin = new THREE.Mesh(geometry, material)
        coin.rotation.x = Math.PI / 2
        scene.add(coin)
        objects.push(coin)

        // Add $ symbol to the coin
        const textGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 100)
        const textMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.5,
          roughness: 0.2,
        })
        const symbol = new THREE.Mesh(textGeometry, textMaterial)
        symbol.position.z = 0.15
        scene.add(symbol)
        objects.push(symbol)

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 5, 5)
        scene.add(directionalLight)

        // Add point light
        const pointLight = new THREE.PointLight(0xffffff, 1)
        pointLight.position.set(-5, -5, 5)
        scene.add(pointLight)
      } else if (type === "abstract") {
        // Create abstract shapes
        for (let i = 0; i < 20; i++) {
          const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.1, 0)
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(color).offsetHSL(i * 0.05, 0, 0),
            shininess: 100,
          })
          const shape = new THREE.Mesh(geometry, material)

          // Position randomly
          shape.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)

          scene.add(shape)
          objects.push(shape)
        }

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
        scene.add(ambientLight)

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(5, 5, 5)
        scene.add(directionalLight)
      } else if (type === "particles") {
        // Create particle system
        const particleCount = 1000
        const particles = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)

        const colorObj = new THREE.Color(color)

        for (let i = 0; i < particleCount * 3; i += 3) {
          // Positions - spread in a sphere
          positions[i] = (Math.random() - 0.5) * 10
          positions[i + 1] = (Math.random() - 0.5) * 10
          positions[i + 2] = (Math.random() - 0.5) * 10

          // Colors - vary based on position
          colors[i] = colorObj.r + (Math.random() - 0.5) * 0.2
          colors[i + 1] = colorObj.g + (Math.random() - 0.5) * 0.2
          colors[i + 2] = colorObj.b + (Math.random() - 0.5) * 0.2
        }

        particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))

        const particleMaterial = new THREE.PointsMaterial({
          size: 0.05,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
        })

        const particleSystem = new THREE.Points(particles, particleMaterial)
        scene.add(particleSystem)
        objects.push(particleSystem)

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)
      }

      // Animation function
      const animate = () => {
        if (!scene || !camera || !renderer) return

        // Rotate objects
        objects.forEach((obj, index) => {
          obj.rotation.x += 0.002 + index * 0.0005
          obj.rotation.y += 0.003 + index * 0.0005
        })

        // Render scene
        renderer.render(scene, camera)

        // Continue animation loop
        animationFrameId = requestAnimationFrame(animate)
      }

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !camera || !renderer) return

        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()

        renderer.setSize(width, height)
      }

      window.addEventListener("resize", handleResize)

      // Start animation
      animate()
      setLoading(false)

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize)

        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId)
        }

        if (renderer && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
          renderer.dispose()
        }

        // Dispose geometries and materials
        objects.forEach((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose()
            if (Array.isArray(obj.material)) {
              obj.material.forEach((material) => material.dispose())
            } else {
              obj.material.dispose()
            }
          }
        })
      }
    } catch (err) {
      console.error("Failed to create Three.js scene:", err)
      setError(true)
      setLoading(false)
    }
  }, [type, color])

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-primary animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
          </div>
        </div>
      )}

      {error && (
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

