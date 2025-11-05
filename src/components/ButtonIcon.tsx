import React from 'react'

type ButtonIconProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const baseClasses = 'inline-flex items-center justify-center p-2 rounded transition-all hover:bg-white/10 active:scale-90 text-[#E6E1E5] opacity-80'

const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonIconProps>(
  ({ children, className = '', ...props }, ref) => {
    const merged = className ? `${baseClasses} ${className}` : baseClasses

    return (
      <button ref={ref} className={merged} {...props}>
        {children}
      </button>
    )
  }
)

ButtonIcon.displayName = 'ButtonIcon'

export default ButtonIcon

