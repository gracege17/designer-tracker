import React from 'react'
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
 * - Modern grid layout with colored backgrounds
 * - Uses custom 50px icons for each category
 * - Ready for AI integration: just pass AI-generated resources
 * - Clean, scannable layout matching app design system
 */
const HelpfulResourcesCard: React.FC<HelpfulResourcesCardProps> = ({ 
  resources,
  title = "What Might Help Today",
  subtitle = "Rest is also growth. Here's something gentle to recharge your energy."
}) => {
  /**
   * Get category icon path and background color
   */
  const getCategoryStyle = (category: ResourceCategory) => {
    switch (category) {
      case 'read':
        return {
          icon: '/icons/50px-icons/read.png',
          bgImage: '/icons/bg-sm/red.png',
          label: 'Reads'
        }
      case 'tools':
        return {
          icon: '/icons/50px-icons/tool.png',
          bgImage: '/icons/bg-sm/blue.png',
          label: 'Tools'
        }
      case 'podcast':
        return {
          icon: '/icons/50px-icons/podcast.png',
          bgImage: '/icons/bg-sm/purple.png',
          label: 'Podcasts'
        }
      case 'video':
        return {
          icon: '/icons/50px-icons/video.png',
          bgImage: '/icons/bg-sm/orange.png',
          label: 'Videos'
        }
      default:
        return {
          icon: '/icons/50px-icons/tool.png',
          bgImage: '/icons/bg-sm/blue.png',
          label: 'Resources'
        }
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
        {/* Coffee/Tea Icon */}
        <div className="text-4xl mb-3">☕</div>
        <h2 className="text-[28px] font-bold text-white mb-3 leading-tight">
          {title}
        </h2>
        <p className="text-[14px] font-normal text-[#CAC4D0] leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Resource Cards Grid - 2x2 Layout */}
      <div className="grid grid-cols-2 gap-3">
        {resources.map((resource) => {
          const style = getCategoryStyle(resource.category)
          return (
            <div
              key={resource.id}
              className="relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                minHeight: '140px',
                backgroundImage: `url(${style.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Gradient Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
              
              {/* Content */}
              <div className="relative h-full p-4 flex flex-col justify-between">
                {/* Icon */}
                <div className="flex justify-end">
                  <img 
                    src={style.icon} 
                    alt={style.label}
                    className="w-12 h-12 opacity-60"
                  />
                </div>
                
                {/* Category Label */}
                <div>
                  <h3 className="text-[20px] font-bold text-white drop-shadow-lg">
                    {style.label}
                  </h3>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HelpfulResourcesCard

