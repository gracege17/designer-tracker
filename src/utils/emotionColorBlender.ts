/**
 * Emotion Color Blending Service
 * 
 * Maps emotions to 4 color families and blends them based on proportions
 * to generate a single daily color for visual elements.
 */

import { Entry } from '../types'

// Color families based on emotion-color-system.md
const COLOR_FAMILIES = {
  RED_PINK: '#FF2D55',      // 热情高涨型 - Energized, Excited, Proud
  GOLDEN_YELLOW: '#F4C95D', // 平和满足型 - Happy, Satisfied, Calm, Nostalgic
  PURPLE: '#AF52DE',        // 紧张警觉型 - Anxious, Frustrated, Surprised
  GRAY_BLUE: '#48484A',     // 精疲力尽型 - Tired, Drained, Sad, Annoyed
  LIGHT_GRAY: '#E3E3E3'     // 中性状态 - Neutral, Normal
}

// Map emotion labels to color families
const EMOTION_TO_COLOR_FAMILY: Record<string, string> = {
  // Red/Pink family - 热情高涨型
  'Energized': COLOR_FAMILIES.RED_PINK,
  'Excited': COLOR_FAMILIES.RED_PINK,
  'Proud': COLOR_FAMILIES.RED_PINK,
  
  // Golden Yellow family - 平和满足型
  'Happy': COLOR_FAMILIES.GOLDEN_YELLOW,
  'Satisfied': COLOR_FAMILIES.GOLDEN_YELLOW,
  'Calm': COLOR_FAMILIES.GOLDEN_YELLOW,
  'Nostalgic': COLOR_FAMILIES.GOLDEN_YELLOW,
  
  // Purple family - 紧张警觉型
  'Anxious': COLOR_FAMILIES.PURPLE,
  'Frustrated': COLOR_FAMILIES.PURPLE,
  'Surprised': COLOR_FAMILIES.PURPLE,
  
  // Gray-Blue family - 精疲力尽型
  'Tired': COLOR_FAMILIES.GRAY_BLUE,
  'Drained': COLOR_FAMILIES.GRAY_BLUE,
  'Sad': COLOR_FAMILIES.GRAY_BLUE,
  'Annoyed': COLOR_FAMILIES.GRAY_BLUE,
  
  // Light Gray family - 中性状态
  'Neutral': COLOR_FAMILIES.LIGHT_GRAY,
  'Normal': COLOR_FAMILIES.LIGHT_GRAY
}

// Map emotion ID to emotion label
const EMOTION_ID_TO_LABEL: Record<number, string> = {
  1: 'Happy',
  2: 'Calm',
  3: 'Excited',
  4: 'Frustrated',
  5: 'Sad',
  6: 'Anxious',
  7: 'Surprised',
  8: 'Neutral',
  9: 'Nostalgic',
  10: 'Energized',
  11: 'Normal',
  12: 'Tired',
  13: 'Satisfied',
  14: 'Annoyed',
  15: 'Drained',
  16: 'Proud'
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Calculate color family proportions from tasks
 */
export function calculateColorProportions(entry: Entry | undefined): Record<string, number> {
  if (!entry || !entry.tasks || entry.tasks.length === 0) {
    return {}
  }

  const colorCounts: Record<string, number> = {}
  const totalTasks = entry.tasks.length

  // Count each color family
  entry.tasks.forEach(task => {
    const emotionLabel = EMOTION_ID_TO_LABEL[task.emotion] || 'Neutral'
    const colorFamily = EMOTION_TO_COLOR_FAMILY[emotionLabel] || COLOR_FAMILIES.LIGHT_GRAY
    
    colorCounts[colorFamily] = (colorCounts[colorFamily] || 0) + 1
  })

  // Convert counts to proportions
  const proportions: Record<string, number> = {}
  Object.keys(colorCounts).forEach(color => {
    proportions[color] = colorCounts[color] / totalTasks
  })

  return proportions
}

/**
 * Blend multiple colors based on their proportions
 * Uses weighted average in RGB color space
 */
export function blendColors(colorProportions: Record<string, number>): string {
  if (Object.keys(colorProportions).length === 0) {
    return COLOR_FAMILIES.LIGHT_GRAY // Default to light gray if no data
  }

  let totalR = 0
  let totalG = 0
  let totalB = 0

  // Weighted sum of RGB values
  Object.entries(colorProportions).forEach(([color, proportion]) => {
    const rgb = hexToRgb(color)
    totalR += rgb.r * proportion
    totalG += rgb.g * proportion
    totalB += rgb.b * proportion
  })

  return rgbToHex(totalR, totalG, totalB)
}

/**
 * Calculate the blended daily color for an entry
 * 
 * @param entry - The daily entry with tasks
 * @returns Hex color string representing the blended emotional color
 */
export function calculateDailyColor(entry: Entry | undefined): string {
  const proportions = calculateColorProportions(entry)
  return blendColors(proportions)
}

/**
 * Get color family breakdown with percentages (for debugging/display)
 */
export function getColorFamilyBreakdown(entry: Entry | undefined): Array<{
  color: string
  proportion: number
  percentage: string
  familyName: string
}> {
  const proportions = calculateColorProportions(entry)
  
  const familyNames: Record<string, string> = {
    [COLOR_FAMILIES.RED_PINK]: 'Red/Pink (热情高涨)',
    [COLOR_FAMILIES.GOLDEN_YELLOW]: 'Golden Yellow (平和满足)',
    [COLOR_FAMILIES.PURPLE]: 'Purple (紧张警觉)',
    [COLOR_FAMILIES.GRAY_BLUE]: 'Gray-Blue (精疲力尽)',
    [COLOR_FAMILIES.LIGHT_GRAY]: 'Light Gray (中性)'
  }

  return Object.entries(proportions)
    .map(([color, proportion]) => ({
      color,
      proportion,
      percentage: `${Math.round(proportion * 100)}%`,
      familyName: familyNames[color] || 'Unknown'
    }))
    .sort((a, b) => b.proportion - a.proportion)
}

