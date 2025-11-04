import React, { useState } from 'react'
import { CaretDown } from 'phosphor-react'
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
 * - Numbered challenge cards with cleaner design
 * - "Ways to cope" sections with actionable strategies
 * - Staggered animations and smooth interactions
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
      case 'tool': return '🛠️'
      case 'podcast': return '🎧'
      case 'book': return '📚'
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
        <h2 className="text-[20px] font-bold text-[#E6E1E5] leading-tight mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[14px] font-normal text-[#938F99] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Challenge Cards */}
      <div className="space-y-4">
        {challenges.map((challenge, index) => {
          const isExpanded = expandedChallenge === challenge.rank
          
          return (
            <div
              key={challenge.rank}
              className="bg-white/[0.04] overflow-hidden transition-all duration-300"
              style={{ 
                borderRadius: '12px',
                animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Challenge Content */}
              <div className="p-5">
                {/* Number Badge + Title + Description */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Number Badge - Circle */}
                  <div 
                    className="flex-shrink-0 flex items-center justify-center bg-white text-black"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                    }}
                  >
                    <span className="text-[28px] font-bold">
                      {challenge.rank}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-[18px] font-bold text-white leading-tight mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-[14px] text-[#938F99] leading-relaxed">
                      {challenge.empathy}
                    </p>
                  </div>
                </div>

                {/* Ways to Cope Button */}
                <button
                  onClick={() => toggleChallenge(challenge.rank)}
                  className="w-full flex items-center justify-between px-5 py-4 transition-all duration-200"
                  style={{
                    borderRadius: '8px',
                    background: isExpanded ? '#ef4444' : '#27272a',
                    color: isExpanded ? '#ffffff' : '#e4e4e7'
                  }}
                >
                  <span className="text-[16px] font-semibold">
                    💡 Ways to cope
                  </span>
                  
                  <CaretDown 
                    size={20} 
                    weight="bold" 
                    className="transition-transform duration-300"
                    style={{
                      color: isExpanded ? '#ffffff' : '#71717a',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>
              </div>

              {/* Expandable Resource Cards */}
              {isExpanded && (
                <div 
                  className="px-6 pb-6 space-y-2.5"
                  style={{
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                >
                  {challenge.suggestions.map((suggestion, suggestionIndex) => (
                    <div
                      key={suggestionIndex}
                      className="group flex items-start gap-3.5 p-4 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/5"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        animation: `fadeInUp 0.3s ease-out ${suggestionIndex * 0.1}s both`
                      }}
                      onClick={() => {
                        if (suggestion.url) {
                          window.open(suggestion.url, '_blank')
                        }
                      }}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 text-[28px] mt-0.5">
                        {getSuggestionIcon(suggestion.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-semibold text-white leading-snug mb-1 group-hover:text-red-500 transition-colors">
                          {suggestion.title}
                        </h4>
                        <p className="text-[13px] text-[#938F99] leading-relaxed">
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

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default HelpfulResourcesCard
