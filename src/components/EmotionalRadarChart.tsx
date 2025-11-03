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
   * - Low task counts (1-10): Apply boost for visual presence
   * - Medium counts (10-30): Gradual transition to accurate representation
   * - High counts (30+): Minimal boost, show accurate proportions
   * 
   * Different thresholds for different views:
   * - Today: Boost up to 5-10 tasks
   * - Weekly: Boost up to 15-20 tasks
   * - Monthly: Boost up to 25-35 tasks
   * 
   * MAX_SCALE_FACTOR is capped at 1.2 to prevent overflow
   */
  const getVisualScaleFactor = (taskCount: number, view: 'today' | 'weekly' | 'monthly'): number => {
    // Define thresholds based on view
    const thresholds = {
      today: { low: 5, medium: 15, high: 25 },
      weekly: { low: 10, medium: 25, high: 40 },
      monthly: { low: 20, medium: 40, high: 60 }
    }
    
    const t = thresholds[view]
    
    // Base scale factor (reduced maximum to prevent overflow)
    const minScale = 1.2  // 20% boost for very sparse data (was 1.5)
    const maxScale = 1.0  // No boost for abundant data
    
    if (taskCount <= t.low) {
      // Very sparse: moderate boost (1.2x - 1.15x)
      return minScale - (minScale - 1.15) * (taskCount / t.low)
    } else if (taskCount <= t.medium) {
      // Transitioning: gradual reduction (1.15x - 1.05x)
      const progress = (taskCount - t.low) / (t.medium - t.low)
      return 1.15 - 0.1 * progress
    } else if (taskCount <= t.high) {
      // Approaching accurate: minimal boost (1.05x - 1.0x)
      const progress = (taskCount - t.medium) / (t.high - t.medium)
      return 1.05 - 0.05 * progress
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
    
    // Draw 2 contour lines at different scales (simplified for clarity)
    for (let i = 1; i <= 2; i++) {
      const scale = i * 0.35 // 35%, 70% of original size
      const contourPoints = points.map(p => ({
        x: p.x * scale,
        y: p.y * scale
      }))
      
      // Vary opacity based on ripple phase for subtle animation (more visible)
      const opacity = 0.15 + Math.sin(ripplePhase + i) * 0.05
      ctx.strokeStyle = `${colors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
      ctx.lineWidth = 1
      
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
    
    // Calculate maxRadius with proper padding to prevent overflow
    // Padding accounts for: labels (24px), breathing animation (~2%), and safety margin
    const EDGE_PADDING = showLabels ? 40 : 16 // More padding for larger labels
    const maxRadius = Math.min(width, height) / 2 - EDGE_PADDING
    
    // Clear canvas (transparent background)
    ctx.clearRect(0, 0, width, height)
    
    // Set up coordinate system (static)
    ctx.save()
    ctx.translate(centerX, centerY)
    
    // Apply overall scale reduction to ensure chart never overflows
    // This provides additional safety margin beyond the padding
    const OVERALL_SCALE = 0.9 // 90% scale for comfortable fit
    ctx.scale(OVERALL_SCALE, OVERALL_SCALE)

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
      // Draw static grid (more visible) - NO ANIMATION (Dark mode only)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)' // More visible white lines
      ctx.lineWidth = 1
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.arc(0, 0, (maxRadius * i) / 4, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw static axis lines - NO ANIMATION (more prominent)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)' // More visible axis
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius)
        ctx.stroke()
      }

      // Draw static emotion labels - NO ANIMATION (larger and clearer)
      ctx.fillStyle = '#E6E1E5' // Brighter text for better readability
      ctx.font = '600 14px Inter, sans-serif' // Larger, bolder font
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
        const labelRadius = maxRadius + 24 // More space from chart
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
    
    // Create radial gradient for the blob (more vibrant)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius)
    gradient.addColorStop(0, `${colors.primary}80`) // 50% opacity at center
    gradient.addColorStop(0.7, `${colors.secondary}50`) // 31% opacity in middle
    gradient.addColorStop(1, `${colors.primary}30`) // 19% opacity at edges
    
    ctx.fillStyle = gradient
    drawOrganicBlob(ctx, points)
    ctx.fill()

    // Draw prominent border (animated with blob)
    ctx.strokeStyle = `${colors.primary}CC` // 80% opacity border for clarity
    ctx.lineWidth = 2 // Thicker border for better visibility
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
