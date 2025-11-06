import React from 'react'

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  icon?: React.ReactNode
  labelClassName?: string
}

const baseClasses = 'inline-flex items-center bg-white/[0.08] px-4 py-2.5 rounded-full border border-white/10'
const textClasses = 'text-[14px] font-medium text-white'

const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ label, icon, labelClassName = '', className = '', ...props }, ref) => {
    const hasIcon = Boolean(icon)
    const classNames = [baseClasses, hasIcon ? 'gap-2' : '', className]
      .filter(Boolean)
      .join(' ')

    return (
      <div ref={ref} className={classNames} {...props}>
        {icon && <span className="text-white/80" aria-hidden>{icon}</span>}
        <span className={[textClasses, labelClassName].filter(Boolean).join(' ')}>{label}</span>
      </div>
    )
  }
)

Tag.displayName = 'Tag'

export default Tag

