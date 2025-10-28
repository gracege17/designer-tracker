import React, { useState } from 'react'
import { CaretLeft } from 'phosphor-react'

interface OverallFeelingProps {
  onComplete: (feelingScore: number) => void
  onBack: () => void
}

const OverallFeeling: React.FC<OverallFeelingProps> = ({ onComplete, onBack }) => {
  const [sliderValue, setSliderValue] = useState(50)

  // Gradient colors from low to high (updated with new emotion colors)
  const gradientStops = [
    { position: 0, color: '#E3E3E3' },   // Neutral
    { position: 10, color: '#686A6C' },  // Transitioning to Drained
    { position: 20, color: '#48484A' },  // Drained - low energy
    { position: 30, color: '#7B6891' },  // Transitioning to Curious
    { position: 40, color: '#AF52DE' },  // Curious - purple inspiration
    { position: 50, color: '#C987DB' },  // Mid-tone between Curious and Meaningful
    { position: 60, color: '#E5AB7C' },  // Transitioning to Meaningful
    { position: 70, color: '#F4C95D' },  // Meaningful - golden purpose
    { position: 80, color: '#F7904C' },  // Transitioning to Energized
    { position: 90, color: '#FF2D55' },  // Energized - bright reddish-orange
    { position: 100, color: '#EC5429' }  // Primary CTA color
  ]

  // Get current color based on slider value
  const getCurrentColor = (value: number): string => {
    for (let i = 0; i < gradientStops.length - 1; i++) {
      const current = gradientStops[i]
      const next = gradientStops[i + 1]
      
      if (value >= current.position && value <= next.position) {
        // Linear interpolation between colors
        const ratio = (value - current.position) / (next.position - current.position)
        return interpolateColor(current.color, next.color, ratio)
      }
    }
    return gradientStops[gradientStops.length - 1].color
  }

  // Interpolate between two hex colors
  const interpolateColor = (color1: string, color2: string, ratio: number): string => {
    const hex = (x: string) => parseInt(x, 16)
    const r1 = hex(color1.slice(1, 3))
    const g1 = hex(color1.slice(3, 5))
    const b1 = hex(color1.slice(5, 7))
    const r2 = hex(color2.slice(1, 3))
    const g2 = hex(color2.slice(3, 5))
    const b2 = hex(color2.slice(5, 7))
    
    const r = Math.round(r1 + (r2 - r1) * ratio)
    const g = Math.round(g1 + (g2 - g1) * ratio)
    const b = Math.round(b1 + (b2 - b1) * ratio)
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  // Get emoji and label based on value
  const getEmojiAndLabel = (value: number): { emoji: string; label: string; description: string } => {
    if (value <= 10) return { emoji: '/icons/emoji_xl/32px-Frustrated.png', label: 'Very Unpleasant', description: 'Feeling overwhelmed' }
    if (value <= 20) return { emoji: '/icons/emoji_xl/32px-Sad.png', label: 'Unpleasant', description: 'Low energy day' }
    if (value <= 30) return { emoji: '/icons/emoji_xl/32px-Drained.png', label: 'Somewhat Low', description: 'A bit drained' }
    if (value <= 40) return { emoji: '/icons/emoji_xl/32px-Neutral.png', label: 'Neutral', description: 'Calm and steady' }
    if (value <= 50) return { emoji: '/icons/emoji_xl/32px-Satisfied.png', label: 'Okay', description: 'Balanced mood' }
    if (value <= 60) return { emoji: '/icons/emoji_xl/32px-Happy.png', label: 'Pleasant', description: 'Feeling good' }
    if (value <= 70) return { emoji: '/icons/emoji_xl/32px-Proud.png', label: 'Good', description: 'Positive energy' }
    if (value <= 80) return { emoji: '/icons/emoji_xl/32px-Excited.png', label: 'Great', description: 'Really inspired' }
    if (value <= 90) return { emoji: '/icons/emoji_xl/32px-Energized.png', label: 'Energized', description: 'Full of ideas' }
    return { emoji: '/icons/emoji_xl/32px-joy.png', label: 'Very Pleasant', description: 'On fire today!' }
  }

  const currentColor = getCurrentColor(sliderValue)
  const { emoji, label, description } = getEmojiAndLabel(sliderValue)

  // Create gradient string for slider track
  const gradientString = gradientStops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="sticky top-0 bg-black z-10 p-5 border-b border-[#49454F]">
        <div className="max-w-md mx-auto flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-white/[0.04] rounded-full transition-colors"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#E6E1E5]">
            How's your day so far?
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-32 max-w-md mx-auto w-full">
        <div className="w-full space-y-12">
          {/* Emoji Display */}
          <div className="text-center space-y-6">
            <div 
              className="flex justify-center items-center transition-all duration-600 ease-in-out"
              style={{ 
                filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))',
                transform: `scale(${0.9 + (sliderValue / 1000)})` 
              }}
            >
              <img 
                src={emoji} 
                alt={label}
                className="w-[120px] h-[120px] object-contain"
              />
            </div>
            
            <div className="space-y-2">
              <h2 
                className="text-[32px] font-bold transition-colors duration-600 ease-in-out"
                style={{ 
                  color: currentColor,
                  fontFamily: 'Playfair Display, serif'
                }}
              >
                {label}
              </h2>
              <p className="text-[16px] text-[#CAC4D0] transition-colors duration-600 ease-in-out">
                {description}
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="w-full px-4 space-y-6">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-3 appearance-none cursor-pointer rounded-full"
                style={{
                  background: `linear-gradient(to right, ${gradientString})`,
                  transition: 'all 0.3s ease'
                }}
              />
              
              {/* Custom thumb styling via CSS */}
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background: ${currentColor};
                  cursor: pointer;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                  transition: background 0.6s ease-in-out, transform 0.2s ease;
                  border: 4px solid white;
                }
                
                input[type="range"]::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                }
                
                input[type="range"]::-webkit-slider-thumb:active {
                  transform: scale(1.2);
                }
                
                input[type="range"]::-moz-range-thumb {
                  appearance: none;
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background: ${currentColor};
                  cursor: pointer;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                  transition: background 0.6s ease-in-out, transform 0.2s ease;
                  border: 4px solid white;
                }
                
                input[type="range"]::-moz-range-thumb:hover {
                  transform: scale(1.1);
                }
                
                input[type="range"]::-moz-range-thumb:active {
                  transform: scale(1.2);
                }
                
                input[type="range"]:focus {
                  outline: none;
                }
              `}</style>
            </div>

            {/* Range Labels */}
            <div className="flex justify-between text-[12px] text-[#938F99] px-1">
              <span>Low Energy</span>
              <span>High Energy</span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => onComplete(sliderValue)}
            className="w-full bg-[#EC5429] text-white py-2.5 px-4 font-medium text-[17px] hover:bg-[#F76538] transition-all duration-200 active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  )
}

export default OverallFeeling

