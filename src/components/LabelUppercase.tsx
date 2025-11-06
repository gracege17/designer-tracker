import React from 'react'

interface LabelUppercaseProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const baseClasses = 'text-[10px] font-semibold text-[#938F99] uppercase tracking-wider'

const LabelUppercase = React.forwardRef<HTMLParagraphElement, LabelUppercaseProps>(
  ({ className = '', children, ...props }, ref) => {
    const mergedClassName = [baseClasses, className].filter(Boolean).join(' ')

    return (
      <p ref={ref} className={mergedClassName} {...props}>
        {children}
      </p>
    )
  }
)

LabelUppercase.displayName = 'LabelUppercase'

export default LabelUppercase


