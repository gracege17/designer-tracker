import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CaretDown, MagnifyingGlass, X } from 'phosphor-react'
import { Challenge, findChallengeRecommendationFromInput } from '../utils/challengeAnalysisService'
import Card from './Card'
import ButtonIcon from './ButtonIcon'
import ButtonPrimaryCTA from './ButtonPrimaryCTA'
import ButtonText from './ButtonText'

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
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [activeTab, setActiveTab] = useState<'feel' | 'do'>('feel')
  const [isSheetVisible, setIsSheetVisible] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)
  const [customChallengeInput, setCustomChallengeInput] = useState('')
  const [customChallengeError, setCustomChallengeError] = useState<string | null>(null)

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

  const openChallenge = useCallback((challenge: Challenge) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    setSelectedChallenge(challenge)
    setActiveTab('feel')
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

  const feelSuggestions =
    selectedChallenge?.suggestions.filter(
      suggestion =>
        suggestion.type === 'podcast' ||
        suggestion.type === 'book' ||
        suggestion.type === 'insight'
    ) ?? []
  const doSuggestions =
    selectedChallenge?.suggestions.filter(
      suggestion =>
        suggestion.type === 'tool' ||
        suggestion.type === 'resource' ||
        suggestion.type === 'action'
    ) ?? []
  const fallbackSuggestions = selectedChallenge?.suggestions ?? []
  const feelList = feelSuggestions.length > 0 ? feelSuggestions : fallbackSuggestions
  const doList = doSuggestions.length > 0 ? doSuggestions : fallbackSuggestions

  const handleCustomChallengeSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!customChallengeInput.trim()) {
      setCustomChallengeError('Describe a challenge to explore recommendations.')
      return
    }

    const match = findChallengeRecommendationFromInput(customChallengeInput)

    if (match) {
      setCustomChallengeError(null)
      openChallenge(match)
    } else {
      setCustomChallengeError(
        "I don't have that one yet. Try another phrasing or add more detail."
      )
    }
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

      {/* Custom Challenge Lookup */}
      <div className="mb-6 rounded-3xl border border-white/5 bg-white/[0.02] p-6">
        <div className="flex items-center gap-3 text-[#E6E1E5]">
          <MagnifyingGlass size={20} weight="bold" className="opacity-70" />
          <div>
            <h3 className="text-[16px] font-semibold leading-snug">Have a different challenge?</h3>
            <p className="text-[13px] text-[#938F99]">
              Describe what&apos;s on your mind to see recommendations from our challenge library.
            </p>
          </div>
        </div>

        <form onSubmit={handleCustomChallengeSubmit} className="mt-5 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <textarea
              rows={3}
              value={customChallengeInput}
              onChange={event => setCustomChallengeInput(event.target.value)}
              placeholder="Example: “Everyone thinks they’re a designer now.”"
              className="w-full resize-none bg-transparent text-[14px] text-[#E6E1E5] placeholder:text-[#938F99] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <ButtonText
              type="button"
              onClick={() => {
                setCustomChallengeInput('')
                setCustomChallengeError(null)
              }}
              className="text-[13px] text-[#CAC4D0] hover:text-white"
            >
              Clear
            </ButtonText>

            <ButtonPrimaryCTA type="submit" className="w-auto px-6">
              Find recommendations
            </ButtonPrimaryCTA>
          </div>

          {customChallengeError && (
            <p className="text-[12px] font-medium text-[#F1B8B0]">{customChallengeError}</p>
          )}
        </form>
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
                  ? 'Challenge Library'
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

            <div className="flex items-center gap-6 px-6 border-b border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('feel')}
                className={`pb-3 text-[15px] font-semibold uppercase tracking-wide transition-all ${activeTab === 'feel' ? 'text-white border-b-2 border-[#EC5429]' : 'text-[#938F99] border-b-2 border-transparent hover:text-white/80'}`}
              >
                Feel
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('do')}
                className={`pb-3 text-[15px] font-semibold uppercase tracking-wide transition-all ${activeTab === 'do' ? 'text-white border-b-2 border-[#EC5429]' : 'text-[#938F99] border-b-2 border-transparent hover:text-white/80'}`}
              >
                Do
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {activeTab === 'feel' ? (
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

                  {feelList.length === 0 ? (
                    <p className="text-[13px] text-[#938F99]">
                      Emotional grounding tips coming soon.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {feelList.map((suggestion, suggestionIndex) => (
                        <div
                          key={`${suggestion.title}-${suggestionIndex}`}
                          className={`group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.04] p-4 transition-all duration-200 ${
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
                            <h4 className="text-[15px] font-semibold text-white leading-snug mb-1 group-hover:text-red-300 transition-colors">
                              {suggestion.title}
                            </h4>
                            <p className="text-[13px] text-[#CAC4D0] leading-relaxed">
                              {suggestion.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[13px] font-semibold uppercase tracking-wide text-[#938F99]">
                    Try one of these small actions
                  </p>

                  {doList.length === 0 ? (
                    <p className="text-[13px] text-[#938F99]">
                      Actions will appear here once available.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {doList.map((suggestion, suggestionIndex) => (
                        <div
                          key={`${suggestion.title}-${suggestionIndex}`}
                          className={`group flex items-start gap-4 rounded-2xl bg-[#1F1B24] p-4 transition-all duration-200 ${
                            suggestion.url ? 'cursor-pointer hover:bg-[#282330]' : 'cursor-default'
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
                            <h4 className="text-[15px] font-semibold text-white leading-snug mb-1 group-hover:text-red-300 transition-colors">
                              {suggestion.title}
                            </h4>
                            <p className="text-[13px] text-[#A1A1AA] leading-relaxed">
                              {suggestion.desc}
                            </p>
                          </div>
                          {suggestion.url && (
                            <div className="flex-shrink-0 self-center text-[12px] font-medium uppercase tracking-wide text-[#EC5429] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              Open
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
