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

  const badgeStyles = [
    {
      background: 'rgba(239, 68, 68, 0.22)',
      border: '1px solid rgba(239, 68, 68, 0.45)',
      color: '#FECACA'
    },
    {
      background: 'rgba(45, 212, 191, 0.22)',
      border: '1px solid rgba(45, 212, 191, 0.4)',
      color: '#A7F3D0'
    },
    {
      background: 'rgba(59, 130, 246, 0.22)',
      border: '1px solid rgba(59, 130, 246, 0.4)',
      color: '#BFDBFE'
    },
    {
      background: 'rgba(250, 204, 21, 0.22)',
      border: '1px solid rgba(250, 204, 21, 0.4)',
      color: '#FDE68A'
    }
  ]

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
          const badgeStyle = badgeStyles[(challenge.rank - 1) % badgeStyles.length]
          
          return (
            <div
              key={challenge.rank}
              className="bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-300"
              style={{ 
                borderRadius: '20px',
                animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Challenge Content */}
              <div className="px-6 py-6">
                {/* Number Badge + Title + Description */}
                <div className="flex items-start gap-4">
                  {/* Number Badge */}
                  <div 
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: badgeStyle.background,
                      border: badgeStyle.border,
                      color: badgeStyle.color,
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <span className="text-[22px] font-semibold">
                      {challenge.rank}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-[18px] font-semibold text-white leading-tight mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                      {challenge.empathy}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ways to Cope Button */}
              <button
                onClick={() => toggleChallenge(challenge.rank)}
                className="w-full flex items-center justify-between px-6 py-4 transition-all duration-200"
                style={{
                  background: isExpanded ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                <span className="flex items-center gap-3 text-[15px] font-semibold text-white">
                  <span className="text-[18px]">💡</span>
                  Ways to cope
                </span>
                
                <CaretDown 
                  size={20} 
                  weight="bold" 
                  className="transition-transform duration-300"
                  style={{
                    color: isExpanded ? '#ef4444' : '#9ca3af',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>

              {/* Expandable Resource Cards */}
              {isExpanded && (
                <div 
                  className="px-6 pb-6 space-y-3 bg-white/[0.02] border-t border-white/[0.03]"
                  style={{
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                >
                  {challenge.suggestions.map((suggestion, suggestionIndex) => (
                    <div
                      key={suggestionIndex}
                      className="group flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 cursor-pointer bg-white/[0.03] hover:bg-white/[0.05]"
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${suggestionIndex * 0.1}s both`
                      }}
                      onClick={() => {
                        if (suggestion.url) {
                          window.open(suggestion.url, '_blank')
                        }
                      }}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 text-[22px]">
                        {getSuggestionIcon(suggestion.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-semibold text-white leading-snug mb-1 group-hover:text-red-400 transition-colors">
                          {suggestion.title}
                        </h4>
                        <p className="text-[13px] text-[#A1A1AA] leading-relaxed">
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
