import React from 'react'
import { Sparkle, TrendUp, Heart, Lightbulb, Medal, Info } from 'phosphor-react'
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
        return <Medal size={20} weight="fill" className="text-yellow-600" />
      case 'insight':
        return <Lightbulb size={20} weight="regular" className="text-blue-600" />
      case 'encouragement':
        return <Heart size={20} weight="fill" className="text-pink-600" />
      case 'tip':
        return <Info size={20} weight="regular" className="text-purple-600" />
      case 'pattern':
        return <TrendUp size={20} weight="regular" className="text-green-600" />
      default:
        return <Sparkle size={20} weight="fill" className="text-slate-600" />
    }
  }

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'celebration':
        return 'bg-yellow-50 border-yellow-200'
      case 'insight':
        return 'bg-blue-50 border-blue-200'
      case 'encouragement':
        return 'bg-pink-50 border-pink-200'
      case 'tip':
        return 'bg-purple-50 border-purple-200'
      case 'pattern':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  return (
    <div className="space-y-3">
      {displayedSuggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className={`p-4 rounded-xl border ${getTypeColor(suggestion.type)} transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getTypeIcon(suggestion.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{suggestion.icon}</span>
                <h3 className="font-bold text-slate-900 text-sm">
                  {suggestion.title}
                </h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {suggestion.message}
              </p>
              
              {suggestion.actionable && (
                <div className="mt-3 pt-1">
                  <p className="text-xs font-medium text-slate-600">
                    💡 Action: {suggestion.actionable}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {suggestions.length > maxDisplay && (
        <button className="w-full text-center text-sm text-slate-500 hover:text-slate-700 font-medium py-2 transition-colors">
          View {suggestions.length - maxDisplay} more insight{suggestions.length - maxDisplay > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )
}

export default SuggestionsCard

