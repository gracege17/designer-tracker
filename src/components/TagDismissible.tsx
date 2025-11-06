import React from 'react'
import { X } from 'phosphor-react'

export interface TagDismissibleProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  icon?: React.ReactNode
  onRemove: (event: React.MouseEvent<HTMLButtonElement>) => void
  removeAriaLabel?: string
  removeIcon?: React.ReactNode
  labelClassName?: string
  removeButtonClassName?: string
}

const containerClasses = 'inline-flex items-center bg-white/[0.08] px-4 py-2.5 rounded-full border border-white/10 gap-2'
const labelClasses = 'text-[14px] font-medium text-white'

const TagDismissible = React.forwardRef<HTMLDivElement, TagDismissibleProps>(
  (
    {
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
    const classNames = [containerClasses, className].filter(Boolean).join(' ')
    const isClickable = Boolean(props.onClick || props.onKeyDown)
    const role = props.role ?? (isClickable ? 'button' : undefined)
    const tabIndex = props.tabIndex ?? (isClickable ? 0 : undefined)

    const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onRemove(event)
    }

    return (
      <div ref={ref} className={classNames} role={role} tabIndex={tabIndex} {...props}>
        {icon && <span className="text-white/80" aria-hidden>{icon}</span>}
        <span className={[labelClasses, labelClassName].filter(Boolean).join(' ')}>{label}</span>
        <button
          type="button"
          aria-label={removeAriaLabel}
          onClick={handleRemoveClick}
          className={[
            'p-1 rounded hover:bg-white/10 active:scale-90 transition-all text-white/80',
            removeButtonClassName,
          ].filter(Boolean).join(' ')}
        >
          {removeIcon ?? <X size={16} weight="bold" />}
        </button>
      </div>
    )
  }
)

TagDismissible.displayName = 'TagDismissible'

export default TagDismissible

