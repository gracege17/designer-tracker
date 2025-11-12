/**
 * Overall Feeling Mapper
 * 
 * Maps the 0-100 slider value from "How's your day so far?" to emotion emojis
 * used in the weekly calendar.
 */

// Map overall feeling slider value (0-100) to emoji
export function getEmojiFromOverallFeeling(feelingScore: number): string {
  if (feelingScore <= 10) return '😠' // Very Unpleasant - Frustrated
  if (feelingScore <= 20) return '😢' // Unpleasant - Sad
  if (feelingScore <= 30) return '😫' // Somewhat Low - Drained
  if (feelingScore <= 40) return '😐' // Neutral
  if (feelingScore <= 50) return '😊' // Okay - Satisfied
  if (feelingScore <= 60) return '😀' // Pleasant - Happy
  if (feelingScore <= 70) return '😍' // Good - Proud
  if (feelingScore <= 80) return '🤩' // Great - Excited
  if (feelingScore <= 90) return '⚡' // Energized
  return '😌' // Very Pleasant - Calm/Joy
}

// Map overall feeling to icon path for consistency
export function getIconPathFromOverallFeeling(feelingScore: number): string | undefined {
  if (feelingScore <= 10) return '/icons/32px-png/32px-Frustrated.png'
  if (feelingScore <= 20) return '/icons/32px-png/32px-Sad.png'
  if (feelingScore <= 30) return '/icons/32px-png/32px-Drained.png'
  if (feelingScore <= 40) return '/icons/32px-png/32px-Neutral.png'
  if (feelingScore <= 50) return '/icons/32px-png/32px-Satisfied.png'
  if (feelingScore <= 60) return '/icons/32px-png/32px-Happy.png'
  if (feelingScore <= 70) return '/icons/32px-png/32px-Proud.png'
  if (feelingScore <= 80) return '/icons/32px-png/32px-Excited.png'
  if (feelingScore <= 90) return '/icons/32px-png/32px-Energized.png'
  return '/icons/32px-png/32px-joy.png'
}

// Map overall feeling to label
export function getLabelFromOverallFeeling(feelingScore: number): string {
  if (feelingScore <= 10) return 'Very Unpleasant'
  if (feelingScore <= 20) return 'Unpleasant'
  if (feelingScore <= 30) return 'Somewhat Low'
  if (feelingScore <= 40) return 'Neutral'
  if (feelingScore <= 50) return 'Okay'
  if (feelingScore <= 60) return 'Pleasant'
  if (feelingScore <= 70) return 'Good'
  if (feelingScore <= 80) return 'Great'
  if (feelingScore <= 90) return 'Energized'
  return 'Very Pleasant'
}

