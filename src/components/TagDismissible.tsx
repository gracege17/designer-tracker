import React from 'react'
import { X } from 'phosphor-react'

export interface TagDismissibleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  label?: string
  icon?: React.ReactNode
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void
  removeAriaLabel?: string
  removeIcon?: React.ReactNode
  labelClassName?: string
  removeButtonClassName?: string
}

const baseClasses = 'inline-flex items-center bg-white/[0.08] px-4 py-2.5 rounded-full border border-white/10 gap-2 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC5429]/60 backdrop-blur-sm shadow-md hover:bg-white/[0.12]'
const defaultLabelClasses = 'text-[14px] font-medium text-[#E6E1E5]'
const defaultRemoveClasses = 'p-1 rounded hover:bg-white/10 active:scale-90 transition-all text-[#E6E1E5] opacity-80'

const TagDismissible = React.forwardRef<HTMLDivElement, TagDismissibleProps>(
  (
    {
      children,
      label,
      icon,
      onRemove,
      removeAriaLabel = 'Remove tag',
      removeIcon,
      className = '',
      labelClassName = '',
      removeButtonClassName = '',
      ...props
    },
    ref
  ) => {
    const classNames = [baseClasses, className].filter(Boolean).join(' ')
    const isInteractive = Boolean(props.onClick || props.onKeyDown)
    const role = props.role ?? (isInteractive ? 'button' : undefined)
    const tabIndex = props.tabIndex ?? (isInteractive ? 0 : undefined)

    const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onRemove?.(event)
    }

    const content = children ?? label

    return (
      <div ref={ref} className={classNames} role={role} tabIndex={tabIndex} {...props}>
        {icon && <span className="text-[#E6E1E5]/80" aria-hidden>{icon}</span>}
        <span className={[defaultLabelClasses, labelClassName].filter(Boolean).join(' ')}>
          {content}
        </span>
        {onRemove && (
          <button
            type="button"
            aria-label={removeAriaLabel}
            onClick={handleRemoveClick}
            className={[defaultRemoveClasses, removeButtonClassName].filter(Boolean).join(' ')}
          >
            {removeIcon ?? <X size={16} weight="bold" />}
          </button>
        )}
      </div>
    )
  }
)

TagDismissible.displayName = 'TagDismissible'

export default TagDismissible

