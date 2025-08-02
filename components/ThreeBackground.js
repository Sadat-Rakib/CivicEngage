'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const animationIdRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    sceneRef.current = { scene, camera, renderer }

    // Create floating civic elements
    const civicElements = []
    
    // Create building-like geometries
    for (let i = 0; i < 15; i++) {
      const geometry = new THREE.BoxGeometry(
        Math.random() * 0.3 + 0.1,
        Math.random() * 0.8 + 0.2,
        Math.random() * 0.3 + 0.1
      )
      
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(
          Math.random() * 0.7 + 0.15, // Hue between blue and purple
          0.7,
          0.6
        ),
        transparent: true,
        opacity: 0.3
      })
      
      const building = new THREE.Mesh(geometry, material)
      
      building.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10
      )
      
      building.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      
      civicElements.push({
        mesh: building,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatOffset: Math.random() * Math.PI * 2
      })
      
      scene.add(building)
    }

    // Create particle system for civic energy
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 10
      positions[i + 2] = (Math.random() - 0.5) * 20

      const color = new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 0.8, 0.7)
      colors[i] = color.r
      colors[i + 1] = color.g
      colors[i + 2] = color.b
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Position camera
    camera.position.z = 8
    camera.position.y = 2

    // Animation loop
    let time = 0
    const animate = () => {
      time += 0.01

      // Animate civic elements
      civicElements.forEach((element, index) => {
        element.mesh.rotation.x += element.rotationSpeed.x
        element.mesh.rotation.y += element.rotationSpeed.y
        element.mesh.rotation.z += element.rotationSpeed.z
        
        element.mesh.position.y += Math.sin(time * element.floatSpeed + element.floatOffset) * 0.002
      })

      // Animate particles
      const positions = particles.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.1) * 0.001
      }
      particles.geometry.attributes.position.needsUpdate = true

      // Rotate entire particle system
      particles.rotation.y += 0.001

      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return
      
      const { camera, renderer } = sceneRef.current
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      if (mountRef.current && sceneRef.current) {
        mountRef.current.removeChild(sceneRef.current.renderer.domElement)
        sceneRef.current.renderer.dispose()
      }
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  )
}