import React, { useState } from 'react'
import { Lightbulb, CaretUp, CaretDown } from 'phosphor-react'
import { Challenge } from '../utils/challengeAnalysisService'

interface HelpfulResourcesCardProps {
  challenges: Challenge[]
  title?: string
  subtitle?: string
}

/**
 * Today's Top Challenges Component
 * 
 * Displays top 3 challenges users might face based on their emotional state,
 * with expandable coping strategies for each challenge.
 * 
 * Features:
 * - Expandable accordion layout for each challenge
 * - Numbered challenge cards
 * - "Ways to cope" sections with actionable strategies
 * - Uses app's color scheme and design system
 */
const HelpfulResourcesCard: React.FC<HelpfulResourcesCardProps> = ({ 
  challenges,
  title = "Today's Top Challenges",
  subtitle
}) => {
  const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null)

  // Get icon for suggestion type
  const getSuggestionIcon = (type: string): string => {
    switch (type) {
      case 'tool': return '🔧'
      case 'podcast': return '🎙️'
      case 'book': return '📖'
      case 'resource': return '💡'
      default: return '💡'
    }
  }

  const toggleChallenge = (rank: number) => {
    setExpandedChallenge(expandedChallenge === rank ? null : rank)
  }

  return (
    <div className="w-full mb-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[28px] font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[14px] font-normal text-[#CAC4D0] mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Challenge Cards */}
      <div className="space-y-3">
        {challenges.map((challenge) => {
          const isExpanded = expandedChallenge === challenge.rank
          
          return (
            <div
              key={challenge.rank}
              className="bg-white/[0.04] overflow-hidden transition-all duration-300"
              style={{ borderRadius: '16px' }}
            >
              {/* Challenge Header */}
              <div className="p-5">
                {/* Number Badge and Title */}
                <div className="flex items-start gap-4 mb-3">
                  <div 
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(236, 84, 41, 0.1)'
                    }}
                  >
                    <span 
                      className="text-[32px] font-bold"
                      style={{ 
                        fontFamily: 'Playfair Display, serif',
                        color: '#EC5429'
                      }}
                    >
                      {challenge.rank}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-[18px] font-semibold text-white leading-snug mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-[14px] text-[#CAC4D0] leading-relaxed">
                      {challenge.empathy}
                    </p>
                  </div>
                </div>

                {/* Ways to Cope Button */}
                <button
                  onClick={() => toggleChallenge(challenge.rank)}
                  className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-white/[0.04]"
                  style={{
                    border: isExpanded ? '2px solid #EC5429' : '2px solid rgba(236, 84, 41, 0.3)',
                    background: isExpanded ? 'rgba(236, 84, 41, 0.05)' : 'transparent'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Lightbulb 
                      size={20} 
                      weight="fill" 
                      className="text-[#F4C95D]"
                    />
                    <span className="text-[16px] font-medium text-white">
                      Ways to cope
                    </span>
                  </div>
                  
                  {isExpanded ? (
                    <CaretUp size={20} weight="bold" className="text-[#EC5429]" />
                  ) : (
                    <CaretDown size={20} weight="bold" className="text-[#EC5429]" />
                  )}
                </button>
              </div>

              {/* Expandable Suggestions Section */}
              {isExpanded && (
                <div 
                  className="px-5 pb-5 space-y-3 animate-fade-in"
                  style={{
                    animation: 'fadeIn 0.3s ease-in-out'
                  }}
                >
                  {challenge.suggestions.map((suggestion, suggestionIndex) => (
                    <div
                      key={suggestionIndex}
                      className="flex items-start gap-4 p-4 rounded-xl cursor-pointer hover:bg-white/[0.02] transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                      onClick={() => {
                        if (suggestion.url) {
                          window.open(suggestion.url, '_blank')
                        }
                      }}
                    >
                      {/* Suggestion Icon */}
                      <div 
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'rgba(236, 84, 41, 0.1)'
                        }}
                      >
                        <span className="text-[24px]">{getSuggestionIcon(suggestion.type)}</span>
                      </div>

                      {/* Suggestion Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[16px] font-semibold text-white">
                            {suggestion.title}
                          </h4>
                          <span className="text-[11px] text-[#EC5429] uppercase font-medium tracking-wide">
                            {suggestion.type}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#CAC4D0] leading-relaxed">
                          {suggestion.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HelpfulResourcesCard

