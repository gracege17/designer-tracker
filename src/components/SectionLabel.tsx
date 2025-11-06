import React from 'react'

interface SectionLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const baseClasses = 'text-[11px] sm:text-[12px] font-normal text-[#CAC4D0] mb-1.5 sm:mb-2 tracking-widest'

const SectionLabel = React.forwardRef<HTMLParagraphElement, SectionLabelProps>(
  ({ className = '', style, children, ...props }, ref) => {
    const mergedClassName = [baseClasses, className].filter(Boolean).join(' ')
    const mergedStyle = { letterSpacing: '0.1em', ...(style || {}) }

    return (
      <p ref={ref} className={mergedClassName} style={mergedStyle} {...props}>
        {children}
      </p>
    )
  }
)

SectionLabel.displayName = 'SectionLabel'

export default SectionLabel


