"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

interface ThreeVisualizationProps {
  data: number[]
  isVisible: boolean
}

export function ThreeVisualization({ data, isVisible }: ThreeVisualizationProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 5, 10)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Create 3D bars based on data
    const bars: THREE.Mesh[] = []
    const colors = [0x1e40af, 0xdc2626, 0x059669, 0x7c3aed, 0xea580c]

    data.forEach((value, index) => {
      const height = (value / Math.max(...data)) * 5
      const geometry = new THREE.BoxGeometry(0.8, height, 0.8)
      const material = new THREE.MeshLambertMaterial({
        color: colors[index % colors.length],
        transparent: true,
        opacity: 0.8,
      })

      const bar = new THREE.Mesh(geometry, material)
      bar.position.x = (index - data.length / 2) * 1.5
      bar.position.y = height / 2
      bar.castShadow = true
      bar.receiveShadow = true

      scene.add(bar)
      bars.push(bar)
    })

    // Add floating particles
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // Rotate bars
      bars.forEach((bar, index) => {
        bar.rotation.y += 0.01 * (index + 1)
      })

      // Animate particles
      particles.rotation.y += 0.002

      // Camera orbit
      const time = Date.now() * 0.001
      camera.position.x = Math.cos(time * 0.5) * 10
      camera.position.z = Math.sin(time * 0.5) * 10
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    if (isVisible) {
      animate()
    }

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !renderer) return

      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [data, isVisible])

  return (
    <div
      ref={mountRef}
      className="w-full h-64 rounded-lg overflow-hidden bg-slate-900/50 backdrop-blur-sm"
      style={{ minHeight: "256px" }}
    />
  )
}
