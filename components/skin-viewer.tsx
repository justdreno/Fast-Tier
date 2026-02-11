'use client'

import { useEffect, useRef, useState } from 'react'
import { SkinViewer, IdleAnimation } from 'skinview3d'

interface SkinViewer3DProps {
  username: string
  width?: number
  height?: number
  className?: string
}

export default function SkinViewer3D({ 
  username, 
  width = 200, 
  height = 200,
  className = ''
}: SkinViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewerRef = useRef<SkinViewer | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    
    try {
      // Create viewer
      viewerRef.current = new SkinViewer({
        canvas: canvas,
        width,
        height
      })

      // Set up animation
      const animation = new IdleAnimation()
      viewerRef.current.animation = animation
      
      // Enable auto-rotation
      viewerRef.current.autoRotate = true
      viewerRef.current.autoRotateSpeed = 1.5

      // Load skin with error handling
      const loadSkin = async () => {
        try {
          // Try to load the player's skin
          await viewerRef.current?.loadSkin(`https://minotar.net/skin/${username}`)
          setIsLoaded(true)
        } catch (error) {
          console.warn(`Failed to load skin for ${username}, falling back to Steve`)
          try {
            // Fall back to Steve skin
            await viewerRef.current?.loadSkin('https://minotar.net/skin/Steve')
            setIsLoaded(true)
          } catch (steveError) {
            console.error('Failed to load Steve skin:', steveError)
            setHasError(true)
          }
        }
      }

      loadSkin()
    } catch (error) {
      console.error('Failed to initialize skin viewer:', error)
      setHasError(true)
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.dispose()
        viewerRef.current = null
      }
    }
  }, [username, width, height])

  if (hasError) {
    return (
      <div 
        className={`rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-4xl font-black text-white">{username.charAt(0)}</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
      <canvas 
        ref={canvasRef} 
        className="rounded-lg"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          imageRendering: 'pixelated'
        }}
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center animate-pulse"
        >
          <span className="text-4xl font-black text-white">{username.charAt(0)}</span>
        </div>
      )}
    </div>
  )
}
