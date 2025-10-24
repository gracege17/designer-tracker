import React, { useEffect, useRef, useState } from 'react'
import { TodayEmotionData } from '../utils/emotionBreakdownService'

interface TodayEmotionRadarBlobProps {
  emotionData: TodayEmotionData
  showLabels?: boolean // Show grid, axis, and labels (default: true)
  taskCount?: number // Number of tasks contributing to this data
  view?: 'today' | 'weekly' | 'monthly' // Time period view
  size?: number // Canvas size in pixels (default: auto based on showLabels)
}

const TodayEmotionRadarBlob: React.FC<TodayEmotionRadarBlobProps> = ({ 
  emotionData, 
  showLabels = true,
  taskCount = 10, // Default to medium count
  view = 'today', // Default to today view
  size // Optional custom size
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Animation state for subtle breathing
  const [breathingScale, setBreathingScale] = useState(1)
  const [ripplePhase, setRipplePhase] = useState(0)

  // Emotion labels
  const emotionLabels = ['Calm', 'Happy', 'Excited', 'Frustrated', 'Anxious']
  
  // Emotion colors with gradients (matching app design)
  const emotionColors = {
    calm: { primary: '#AF52DE', secondary: '#C77FE8' },      // Curious purple
    happy: { primary: '#F4C95D', secondary: '#F7D87F' },     // Meaningful golden
    excited: { primary: '#FF2D55', secondary: '#FF5A7A' },  // Energized pink/red
    frustrated: { primary: '#48484A', secondary: '#6B6B6D' }, // Drained gray
    anxious: { primary: '#AF52DE', secondary: '#C77FE8' },   // Curious purple
    neutral: { primary: '#938F99', secondary: '#B0ACB6' }   // Outline variant gray
  }

  /**
   * Calculate visual scale factor based on task count and view period.
   * 
   * Strategy:
   * - Low task counts (1-10): Apply significant boost for visual presence
   * - Medium counts (10-30): Gradual transition to accurate representation
   * - High counts (30+): Minimal boost, show accurate proportions
   * 
   * Different thresholds for different views:
   * - Today: Boost up to 5-10 tasks
   * - Weekly: Boost up to 15-20 tasks
   * - Monthly: Boost up to 25-35 tasks
   */
  const getVisualScaleFactor = (taskCount: number, view: 'today' | 'weekly' | 'monthly'): number => {
    // Define thresholds based on view
    const thresholds = {
      today: { low: 5, medium: 15, high: 25 },
      weekly: { low: 10, medium: 25, high: 40 },
      monthly: { low: 20, medium: 40, high: 60 }
    }
    
    const t = thresholds[view]
    
    // Base scale factor (minimum boost for visual presence)
    const minScale = 1.5  // 50% boost for very sparse data
    const maxScale = 1.0  // No boost for abundant data
    
    if (taskCount <= t.low) {
      // Very sparse: significant boost (1.5x - 1.3x)
      return minScale - (minScale - 1.3) * (taskCount / t.low)
    } else if (taskCount <= t.medium) {
      // Transitioning: gradual reduction (1.3x - 1.1x)
      const progress = (taskCount - t.low) / (t.medium - t.low)
      return 1.3 - 0.2 * progress
    } else if (taskCount <= t.high) {
      // Approaching accurate: minimal boost (1.1x - 1.0x)
      const progress = (taskCount - t.medium) / (t.high - t.medium)
      return 1.1 - 0.1 * progress
    } else {
      // Abundant data: show accurate proportions
      return maxScale
    }
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
  const drawContourLines = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
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

  // Draw the organic emotion blob
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) * 0.7
    
    // Clear canvas (transparent background)
    ctx.clearRect(0, 0, width, height)
    
    // Set up coordinate system (static)
    ctx.save()
    ctx.translate(centerX, centerY)

    // Calculate points for each emotion with dynamic scaling
    const points: { x: number; y: number }[] = []
    const data = [
      emotionData.breakdown.calm,
      emotionData.breakdown.happy,
      emotionData.breakdown.excited,
      emotionData.breakdown.frustrated,
      emotionData.breakdown.anxious
    ]

    // Get visual scale factor based on task count and view
    const scaleFactor = getVisualScaleFactor(taskCount, view)
    
    // Minimum visual value for zero or very small emotions (for visibility)
    const MIN_VISUAL_VALUE = 0.08
    
    // Optional: For normalized view, calculate: const maxEmotionValue = Math.max(...data, 0.01)
    // Then normalize each value: rawValue / maxEmotionValue
    
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2 // Start from top
      
      // Get raw emotion value
      const rawValue = data[i]
      
      // Apply minimum for zero/very small values, otherwise use actual value
      let visualValue = rawValue < MIN_VISUAL_VALUE ? MIN_VISUAL_VALUE : rawValue
      
      // Apply scale factor to amplify sparse data (affects all values proportionally)
      visualValue = Math.min(visualValue * scaleFactor, 1.0)
      
      // Calculate radius
      const radius = visualValue * maxRadius

      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      points.push({ x, y })
    }

    // Draw static grid, axis, and labels only if showLabels is true
    if (showLabels) {
      // Draw static grid (very light) - NO ANIMATION (Dark mode only)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)' // Subtle white lines
      ctx.lineWidth = 0.5
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

      // Draw static emotion labels - NO ANIMATION (Dark mode only)
      ctx.fillStyle = '#CAC4D0' // Material Design 3 on-surface-variant
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
        const labelRadius = maxRadius + 20
        const x = Math.cos(angle) * labelRadius
        const y = Math.sin(angle) * labelRadius
        
        ctx.fillText(emotionLabels[i], x, y)
      }
    }

    // Draw animated blob with breathing effect
    ctx.save()
    ctx.scale(breathingScale, breathingScale) // Apply breathing animation only to blob
    
    // Draw contour lines for depth (animated with blob) - only if showLabels is true
    if (showLabels) {
      drawContourLines(ctx, points)
    }

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
  }, [emotionData, breathingScale, ripplePhase, showLabels, taskCount, view])

  // Use smaller dimensions when labels are hidden for compact view
  // If custom size is provided, use it; otherwise use defaults
  const canvasSize = size ?? (showLabels ? 300 : 160)
  const containerHeight = showLabels ? 'h-64' : 'h-full'

  return (
    <div className={`relative w-full ${containerHeight} flex items-center justify-center`}>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
      />
    </div>
  )
}

export default TodayEmotionRadarBlob
