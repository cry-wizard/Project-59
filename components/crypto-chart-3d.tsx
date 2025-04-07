"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { motion } from "framer-motion"

export function CryptoChart3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    let scene: THREE.Scene | null = null
    let camera: THREE.PerspectiveCamera | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let controls: OrbitControls | null = null
    let animationFrameId: number | null = null

    try {
      setLoading(true)
      setError(false)

      // Create scene
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000000)

      // Add fog for depth
      scene.fog = new THREE.Fog(0x000000, 5, 30)

      // Create camera
      const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000)
      camera.position.set(0, 2, 8)

      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.shadowMap.enabled = true
      containerRef.current.appendChild(renderer.domElement)

      // Add orbit controls with limited rotation
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.rotateSpeed = 0.5
      controls.minDistance = 3
      controls.maxDistance = 20
      controls.maxPolarAngle = Math.PI / 2
      controls.autoRotate = false // Disable auto-rotation
      controls.enableRotate = false // Disable rotation completely
      controls.enablePan = false // Disable panning
      controls.enableZoom = true // Allow zooming

      // Add grid
      const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
      scene.add(gridHelper)

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
      scene.add(ambientLight)

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(5, 10, 7)
      directionalLight.castShadow = true
      scene.add(directionalLight)

      // Add point light
      const pointLight = new THREE.PointLight(0x3498db, 1, 10)
      pointLight.position.set(0, 3, 0)
      scene.add(pointLight)

      // Create chart group
      const chartGroup = new THREE.Group()
      chartGroup.position.set(-10, 0, 0)
      scene.add(chartGroup)

      // Generate multiple price lines that move in parallel
      const createPriceLine = (
        startX: number,
        startY: number,
        length: number,
        color: THREE.Color,
        amplitude: number,
        frequency: number,
        phase: number,
      ) => {
        const lineGeometry = new THREE.BufferGeometry()
        const points: THREE.Vector3[] = []

        for (let i = 0; i <= length; i++) {
          const x = startX + (i / length) * 20
          // Create a sine wave with some randomness
          const y = startY + Math.sin(i * frequency + phase) * amplitude + (Math.random() - 0.5) * 0.2
          const z = 0
          points.push(new THREE.Vector3(x, y, z))
        }

        lineGeometry.setFromPoints(points)
        const lineMaterial = new THREE.LineBasicMaterial({ color })
        const line = new THREE.Line(lineGeometry, lineMaterial)
        chartGroup.add(line)

        return { geometry: lineGeometry, points }
      }

      // Create green uptrend line
      const greenLine = createPriceLine(0, 0, 100, new THREE.Color(0x00ff00), 1.5, 0.1, 0)

      // Create red downtrend line
      const redLine = createPriceLine(0, -2, 100, new THREE.Color(0xff0000), 1.2, 0.15, Math.PI / 2)

      // Create yellow neutral line
      const yellowLine = createPriceLine(0, 2, 100, new THREE.Color(0xffff00), 0.8, 0.2, Math.PI / 4)

      // Add volume bars
      const createVolumeBars = () => {
        const volumeGroup = new THREE.Group()

        for (let i = 0; i < 40; i++) {
          const x = (i / 40) * 20
          const height = Math.random() * 2 + 0.5
          const width = 0.2
          const depth = 0.2

          const geometry = new THREE.BoxGeometry(width, height, depth)
          const material = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.5 ? 0x00ff00 : 0xff0000,
            transparent: true,
            opacity: 0.7,
          })

          const bar = new THREE.Mesh(geometry, material)
          bar.position.set(x, -4 + height / 2, 0)
          volumeGroup.add(bar)
        }

        chartGroup.add(volumeGroup)
        return volumeGroup
      }

      const volumeBars = createVolumeBars()

      // Add price labels
      const createTextSprite = (text: string, position: THREE.Vector3, color = 0xffffff) => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (!context) return

        canvas.width = 256
        canvas.height = 128
        context.fillStyle = "#000000"
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.font = "Bold 24px Arial"
        context.fillStyle = "#ffffff"
        context.textAlign = "center"
        context.fillText(text, canvas.width / 2, canvas.height / 2)

        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.SpriteMaterial({ map: texture })
        const sprite = new THREE.Sprite(material)
        sprite.position.copy(position)
        sprite.scale.set(2, 1, 1)
        chartGroup.add(sprite)
      }

      // Add price labels
      createTextSprite("$70,000", new THREE.Vector3(-1, 3, 0))
      createTextSprite("$60,000", new THREE.Vector3(-1, 0, 0))
      createTextSprite("$50,000", new THREE.Vector3(-1, -3, 0))

      // Animation function to update the lines
      const animate = () => {
        if (!scene || !camera || !renderer || !controls) return

        // Update controls
        controls.update()

        // Animate the price lines
        const time = Date.now() * 0.001

        // Update green line (uptrend)
        for (let i = 0; i < greenLine.points.length; i++) {
          const point = greenLine.points[i]
          point.y = Math.sin(i * 0.1 + time) * 1.5 + (Math.random() - 0.5) * 0.1 + 0.5
        }
        greenLine.geometry.setFromPoints(greenLine.points)

        // Update red line (downtrend)
        for (let i = 0; i < redLine.points.length; i++) {
          const point = redLine.points[i]
          point.y = Math.sin(i * 0.15 + time + Math.PI) * 1.2 + (Math.random() - 0.5) * 0.1 - 2
        }
        redLine.geometry.setFromPoints(redLine.points)

        // Update yellow line (neutral)
        for (let i = 0; i < yellowLine.points.length; i++) {
          const point = yellowLine.points[i]
          point.y = Math.sin(i * 0.2 + time + Math.PI / 2) * 0.8 + (Math.random() - 0.5) * 0.1 + 2
        }
        yellowLine.geometry.setFromPoints(yellowLine.points)

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
          try {
            containerRef.current.removeChild(renderer.domElement)
          } catch (error) {
            console.error("Error removing renderer:", error)
          }
          renderer.dispose()
        }

        if (controls) {
          controls.dispose()
        }

        // Dispose geometries and materials
        scene?.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose()
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        })
      }
    } catch (error) {
      console.error("Failed to create Three.js scene:", error)
      setError(true)
      setLoading(false)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-primary animate-spin mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading 3D chart...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-xs text-center">
            <p className="text-destructive font-medium mb-2">Failed to load 3D chart</p>
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

