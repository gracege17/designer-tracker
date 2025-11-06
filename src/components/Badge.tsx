import React from 'react'

type BadgeTone = 'neutral' | 'accent' | 'positive' | 'warning' | 'info'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  size?: BadgeSize
  uppercase?: boolean
}

const baseClasses = 'inline-flex items-center gap-1 rounded-full font-medium tracking-wide transition-colors border'

const toneClassMap: Record<BadgeTone, string> = {
  neutral: 'bg-white/[0.04] border-white/10 text-[#E6E1E5]',
  accent: 'bg-[#EC5429]/15 border-[#EC5429]/40 text-[#EC5429]',
  positive: 'bg-[#3DD598]/15 border-[#3DD598]/30 text-[#3DD598]',
  warning: 'bg-[#F4C95D]/15 border-[#F4C95D]/30 text-[#F4C95D]',
  info: 'bg-[#AF52DE]/15 border-[#AF52DE]/30 text-[#AF52DE]',
}

const sizeClassMap: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-4 py-2.5 text-[14px]',
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className = '',
      tone = 'neutral',
      size = 'sm',
      uppercase = true,
      ...props
    },
    ref
  ) => {
    const toneClasses = toneClassMap[tone] ?? toneClassMap.neutral
    const sizeClasses = sizeClassMap[size] ?? sizeClassMap.sm
    const caseClasses = uppercase ? 'uppercase' : 'normal-case'

    const merged = [baseClasses, toneClasses, sizeClasses, caseClasses, className]
      .filter(Boolean)
      .join(' ')

    return (
      <span ref={ref} className={merged} {...props}>
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge

