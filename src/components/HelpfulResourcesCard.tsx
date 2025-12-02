import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CaretDown, X, Copy } from 'phosphor-react'
import { Challenge } from '../utils/challengeAnalysisService'
import Card from './Card'
import ButtonIcon from './ButtonIcon'

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
  title = "Today's Challenges",
  subtitle
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [isSheetVisible, setIsSheetVisible] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  const badgeStyles = [
    { color: '#F87171' },
    { color: '#2DD4BF' },
    { color: '#60A5FA' },
    { color: '#FACC15' }
  ]

  // Get icon for suggestion type
  const getSuggestionIcon = (type: string): string => {
    switch (type) {
      case 'tool': return '🛠️'
      case 'podcast': return '🎧'
      case 'book': return '📚'
      case 'resource': return '💡'
      case 'insight': return '🧠'
      case 'action': return '✅'
      default: return '💡'
    }
  }

  // Copy text to clipboard
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const openChallenge = useCallback((challenge: Challenge) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    setSelectedChallenge(challenge)
  }, [])

  const closeChallenge = useCallback(() => {
    setIsSheetVisible(false)
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setSelectedChallenge(null)
      closeTimeoutRef.current = null
    }, 280)
  }, [])

  useEffect(() => {
    if (!selectedChallenge) {
      return
    }

    const frame = requestAnimationFrame(() => {
      setIsSheetVisible(true)
    })

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeChallenge()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedChallenge, closeChallenge])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
    }
  }, [])

  // Show all suggestions together, but limit to top 3
  const allSuggestions = (selectedChallenge?.suggestions ?? []).slice(0, 3)

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
          const isExpanded =
            selectedChallenge?.meta?.source !== 'library' &&
            selectedChallenge?.rank === challenge.rank
          const isActive = isExpanded && isSheetVisible
          const badgeStyle = badgeStyles[(challenge.rank - 1) % badgeStyles.length]
          
          return (
            <Card
              key={challenge.rank}
              className="bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-300 space-y-0"
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
                    className="flex-shrink-0"
                  >
                    <span
                      className="text-[22px] font-semibold"
                      style={{ color: badgeStyle.color }}
                    >
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
                onClick={() => {
                  if (isExpanded) {
                    closeChallenge()
                  } else {
                    openChallenge(challenge)
                  }
                }}
                className="w-full flex items-center justify-between px-6 py-4 transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.03)',
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
                    color: isActive ? '#ef4444' : '#9ca3af',
                    transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </button>
            </Card>
          )
        })}
      </div>

      {selectedChallenge && (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedChallenge.title} coping strategies`}
        >
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isSheetVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeChallenge}
          />

          <div
            className={`absolute left-0 right-0 bottom-0 h-[90vh] bg-[#111015] rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.45)] transform transition-transform duration-300 ease-out flex flex-col ${isSheetVisible ? 'translate-y-0' : 'translate-y-full'}`}
          >
            <div className="relative px-6 pt-5 pb-4">
              <div className="mx-auto mt-1 h-1.5 w-12 rounded-full bg-white/20" />

              <ButtonIcon
                onClick={closeChallenge}
                className="absolute right-4 top-4 text-white/70 hover:text-white"
                aria-label="Close coping strategies"
              >
                <X size={18} weight="bold" />
              </ButtonIcon>

              <p className="mt-5 text-[12px] font-semibold uppercase tracking-widest text-[#938F99]">
                {selectedChallenge.meta?.source === 'library'
                  ? 'Recommendation'
                  : `Challenge ${selectedChallenge.rank}`}
              </p>
              <h3 className="mt-2 text-[20px] font-semibold text-white leading-tight">
                {selectedChallenge.title}
              </h3>

              {selectedChallenge.meta?.topicTags && selectedChallenge.meta.topicTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedChallenge.meta.topicTags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-[#CAC4D0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-[15px] text-[#E6E1E5] leading-relaxed">
                    {selectedChallenge.empathy}
                  </p>

                  {selectedChallenge.meta?.insight && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#CAC4D0]">
                        Why this matters
                      </p>
                      <p className="mt-2 text-[13px] text-[#E6E1E5] leading-relaxed">
                        {selectedChallenge.meta.insight}
                      </p>
                    </div>
                  )}
                </div>

                {allSuggestions.length === 0 ? (
                  <p className="text-[13px] text-[#938F99]">
                    Suggestions coming soon.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {allSuggestions.slice(0, 3).map((suggestion, suggestionIndex) => {
                      const hasCopyable = suggestion.searchQuery || suggestion.aiPrompt
                      const copyText = suggestion.searchQuery || suggestion.aiPrompt || ''
                      const copyKey = `copy-${suggestionIndex}`
                      
                      return (
                        <div
                          key={`${suggestion.title}-${suggestionIndex}`}
                          className={`group relative flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.04] p-4 transition-all duration-200 ${
                            suggestion.url ? 'cursor-pointer hover:bg-white/[0.06]' : 'cursor-default'
                          }`}
                          onClick={() => {
                            if (suggestion.url) {
                              window.open(suggestion.url, '_blank')
                            }
                          }}
                        >
                          <div className="flex-shrink-0 text-[22px]">
                            {getSuggestionIcon(suggestion.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[15px] font-semibold text-white leading-snug mb-1 group-hover:text-red-300 transition-colors pr-6">
                              {suggestion.title}
                            </h4>
                            <p className="text-[13px] text-[#CAC4D0] leading-relaxed">
                              {suggestion.desc}
                            </p>
                          </div>
                          {/* Copy icon in top right corner */}
                          {hasCopyable && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(copyText, copyKey)
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-[#CAC4D0] hover:text-white transition-all"
                              title={suggestion.searchQuery ? 'Copy search query' : 'Copy AI prompt'}
                            >
                              {copiedKey === copyKey ? (
                                <span className="text-[12px] text-[#EC5429]">✓</span>
                              ) : (
                                <Copy size={14} weight="regular" />
                              )}
                            </button>
                          )}
                          {suggestion.url && !hasCopyable && (
                            <div className="flex-shrink-0 self-center text-[12px] font-medium uppercase tracking-wide text-[#EC5429] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              Open
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
