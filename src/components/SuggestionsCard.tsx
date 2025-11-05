import React from 'react'
import { Sparkle, TrendUp, Heart, Lightbulb, Medal, Info } from 'phosphor-react'
import ButtonText from './ButtonText'
import { Suggestion } from '../utils/suggestionEngine'

interface SuggestionsCardProps {
  suggestions: Suggestion[]
  maxDisplay?: number
}

const SuggestionsCard: React.FC<SuggestionsCardProps> = ({ suggestions, maxDisplay = 3 }) => {
  if (suggestions.length === 0) return null

  const displayedSuggestions = suggestions.slice(0, maxDisplay)

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'celebration':
        return <Medal size={18} weight="fill" className="text-[#EC5429]" />
      case 'insight':
        return <Lightbulb size={18} weight="regular" className="text-[#EC5429]" />
      case 'encouragement':
        return <Heart size={18} weight="fill" className="text-[#EC5429]" />
      case 'tip':
        return <Info size={18} weight="regular" className="text-[#EC5429]" />
      case 'pattern':
        return <TrendUp size={18} weight="regular" className="text-[#EC5429]" />
      default:
        return <Sparkle size={18} weight="fill" className="text-[#EC5429]" />
    }
  }

  return (
    <div className="space-y-2">
      {displayedSuggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="flex items-start gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl transition-all cursor-pointer active:scale-[0.99]"
        >
          {/* Icon */}
          <div className="flex-shrink-0 pt-1">
            {getTypeIcon(suggestion.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold text-[#E6E1E5] leading-snug line-clamp-1 mb-0.5">
              {suggestion.icon} {suggestion.title}
            </h3>
            <p className="text-[12px] font-normal text-[#938F99] leading-relaxed line-clamp-1">
              {suggestion.message}
            </p>
          </div>
        </div>
      ))}

      {suggestions.length > maxDisplay && (
        <ButtonText className="block w-full text-center text-[12px] text-[#938F99] hover:text-[#CAC4D0] py-2 transition-colors">
          View more suggestions
        </ButtonText>
      )}
    </div>
  )
}

export default SuggestionsCard

