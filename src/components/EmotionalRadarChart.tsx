import React, { useEffect, useRef, useState } from 'react'
import { TodayEmotionData, getEmotionColor } from '../utils/emotionBreakdownService'
import { useTheme } from '../context/ThemeContext'

interface TodayEmotionRadarBlobProps {
  emotionData: TodayEmotionData
}

const TodayEmotionRadarBlob: React.FC<TodayEmotionRadarBlobProps> = ({ emotionData }) => {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Animation state for subtle breathing
  const [breathingScale, setBreathingScale] = useState(1)
  const [ripplePhase, setRipplePhase] = useState(0)

  // Emotion labels
  const emotionLabels = ['Calm', 'Happy', 'Excited', 'Frustrated', 'Anxious']
  
  // Emotion colors with gradients
  const emotionColors = {
    calm: { primary: '#4A90E2', secondary: '#87CEEB' },      // Soft blue gradient
    happy: { primary: '#F5A623', secondary: '#FFD700' },     // Warm orange gradient
    excited: { primary: '#E91E63', secondary: '#FF69B4' },  // Pink gradient
    frustrated: { primary: '#D32F2F', secondary: '#FF6B6B' }, // Muted red gradient
    anxious: { primary: '#9C27B0', secondary: '#BA68C8' },   // Purple gradient
    neutral: { primary: '#757575', secondary: '#9E9E9E' }   // Gray gradient
  }

  // Subtle breathing animation for blob only
  useEffect(() => {
    const animateBlob = () => {
      const time = Date.now() * 0.001
      
      // Gentle breathing effect - 4% scale variation over 6 seconds
      const breathing = 1 + Math.sin(time * Math.PI / 3) * 0.02 // 2% scale variation, 6s cycle
      
      // Ripple phase for contour lines
      const ripple = time * 2 // Ripple animation speed
      
      setBreathingScale(breathing)
      setRipplePhase(ripple)
      
      requestAnimationFrame(animateBlob)
    }
    
    animateBlob()
  }, [])

  // Draw smooth organic blob using Catmull-Rom splines
  const drawOrganicBlob = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    if (points.length < 3) return

    ctx.beginPath()
    
    // Use Catmull-Rom spline for smooth curves
    const tension = 0.5 // Smoothness factor
    
    // Start with first point
    ctx.moveTo(points[0].x, points[0].y)
    
    // Draw smooth curves between all points
    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length]
      const p1 = points[i]
      const p2 = points[(i + 1) % points.length]
      const p3 = points[(i + 2) % points.length]
      
      // Calculate control points for Catmull-Rom spline
      const cp1x = p1.x + (p2.x - p0.x) / 6 * tension
      const cp1y = p1.y + (p2.y - p0.y) / 6 * tension
      const cp2x = p2.x - (p3.x - p1.x) / 6 * tension
      const cp2y = p2.y - (p3.y - p1.y) / 6 * tension
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
    }
    
    ctx.closePath()
  }

  // Draw contour lines for depth
  const drawContourLines = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[], maxRadius: number) => {
    const colors = emotionColors[emotionData.mainEmotion as keyof typeof emotionColors] || emotionColors.neutral
    
    // Draw 3 contour lines at different scales
    for (let i = 1; i <= 3; i++) {
      const scale = i * 0.25 // 25%, 50%, 75% of original size
      const contourPoints = points.map(p => ({
        x: p.x * scale,
        y: p.y * scale
      }))
      
      // Vary opacity based on ripple phase for subtle animation
      const opacity = 0.1 + Math.sin(ripplePhase + i) * 0.05
      ctx.strokeStyle = `${colors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
      ctx.lineWidth = 0.5
      
      drawOrganicBlob(ctx, contourPoints)
      ctx.stroke()
    }
  }

  // Draw polygon with slightly rounded corners
  const drawRoundedPolygon = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    if (points.length < 3) return

    ctx.beginPath()
    
    // Start with the first point
    ctx.moveTo(points[0].x, points[0].y)
    
    // Draw lines between points with slight rounding
    for (let i = 0; i < points.length; i++) {
      const current = points[i]
      const next = points[(i + 1) % points.length]
      
      // Add slight rounding at corners
      const cornerRadius = 3
      const dx = next.x - current.x
      const dy = next.y - current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > cornerRadius * 2) {
        const ratio = cornerRadius / distance
        const x1 = current.x + dx * ratio
        const y1 = current.y + dy * ratio
        const x2 = next.x - dx * ratio
        const y2 = next.y - dy * ratio
        
        ctx.lineTo(x1, y1)
        ctx.quadraticCurveTo(next.x, next.y, x2, y2)
      } else {
        ctx.lineTo(next.x, next.y)
      }
    }
    
    // Close the path
    ctx.closePath()
  }

  // Draw the organic emotion blob
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) * 0.35
    
    // Clear canvas (transparent background)
    ctx.clearRect(0, 0, width, height)
    
    // Set up coordinate system (static)
    ctx.save()
    ctx.translate(centerX, centerY)

    // Calculate points for each emotion
    const points: { x: number; y: number }[] = []
    const data = [
      emotionData.breakdown.calm,
      emotionData.breakdown.happy,
      emotionData.breakdown.excited,
      emotionData.breakdown.frustrated,
      emotionData.breakdown.anxious
    ]

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2 // Start from top
      const radius = data[i] * maxRadius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      points.push({ x, y })
    }

    // Draw static grid (very light) - NO ANIMATION
    ctx.strokeStyle = theme === 'dark' ? '#2A2A2A' : '#F0F0F0'
    ctx.lineWidth = 0.3
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath()
      ctx.arc(0, 0, (maxRadius * i) / 4, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw static axis lines - NO ANIMATION
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius)
      ctx.stroke()
    }

    // Draw static emotion labels - NO ANIMATION
    ctx.fillStyle = theme === 'dark' ? '#888888' : '#666666'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
      const labelRadius = maxRadius + 20
      const x = Math.cos(angle) * labelRadius
      const y = Math.sin(angle) * labelRadius
      
      ctx.fillText(emotionLabels[i], x, y)
    }

    // Draw animated blob with breathing effect
    ctx.save()
    ctx.scale(breathingScale, breathingScale) // Apply breathing animation only to blob
    
    // Draw contour lines for depth (animated with blob)
    drawContourLines(ctx, points, maxRadius)

    // Draw main organic blob with gradient fill (animated)
    const colors = emotionColors[emotionData.mainEmotion as keyof typeof emotionColors] || emotionColors.neutral
    
    // Create radial gradient for the blob
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius)
    gradient.addColorStop(0, `${colors.primary}60`) // 37% opacity at center
    gradient.addColorStop(0.7, `${colors.secondary}40`) // 25% opacity in middle
    gradient.addColorStop(1, `${colors.primary}20`) // 12% opacity at edges
    
    ctx.fillStyle = gradient
    drawOrganicBlob(ctx, points)
    ctx.fill()

    // Draw subtle border (animated with blob)
    ctx.strokeStyle = `${colors.primary}80` // 50% opacity border
    ctx.lineWidth = 1
    drawOrganicBlob(ctx, points)
    ctx.stroke()

    ctx.restore() // End blob animation
    ctx.restore() // End main coordinate system
  }

  // Redraw chart when data or animation changes
  useEffect(() => {
    drawChart()
  }, [emotionData, breathingScale, ripplePhase, theme])

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  )
}

export default TodayEmotionRadarBlob
