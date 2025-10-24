import React from 'react'
import { Wrench, BookOpen, Microphone, Play } from 'phosphor-react'
import { HelpfulResource, ResourceCategory } from '../utils/helpfulResourcesService'

interface HelpfulResourcesCardProps {
  resources: HelpfulResource[]
  title?: string
  subtitle?: string
}

/**
 * HelpfulResourcesCard Component
 * 
 * Displays 4 curated resources (Tools, Read, Podcast, Video) to help users
 * based on their emotional state and daily challenges.
 * 
 * Features:
 * - Modular design: accepts resources as props
 * - Ready for AI integration: just pass AI-generated resources
 * - Clean, scannable layout matching app design system
 */
const HelpfulResourcesCard: React.FC<HelpfulResourcesCardProps> = ({ 
  resources,
  title = "What Might Help Today",
  subtitle = "Rest is also growth. Here's something gentle to recharge your energy."
}) => {
  /**
   * Get icon component based on category
   */
  const getCategoryIcon = (category: ResourceCategory) => {
    const iconProps = { size: 24, weight: 'regular' as const, className: 'text-[#EC5429]' }
    
    switch (category) {
      case 'tools':
        return <Wrench {...iconProps} />
      case 'read':
        return <BookOpen {...iconProps} />
      case 'podcast':
        return <Microphone {...iconProps} />
      case 'video':
        return <Play {...iconProps} />
      default:
        return <Wrench {...iconProps} />
    }
  }

  return (
    <div 
      className="w-full bg-white/[0.04] mb-6"
      style={{ 
        borderRadius: '16px 16px 0px 0px',
        padding: '24px'
      }}
    >
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-white mb-3">
          {title}
        </h2>
        <p className="text-[14px] font-normal text-[#938F99] leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Resource Cards Grid */}
      <div className="space-y-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-start gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl transition-all cursor-pointer active:scale-[0.99]"
          >
            {/* Icon Section */}
            <div className="flex-shrink-0 pt-1">
              {getCategoryIcon(resource.category)}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-semibold text-[#E6E1E5] mb-1 leading-snug">
                {resource.title}
              </h3>
              <p className="text-[14px] font-normal text-[#938F99] leading-relaxed">
                {resource.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HelpfulResourcesCard

