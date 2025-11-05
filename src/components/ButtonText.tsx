import React from 'react'

type ButtonTextProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const baseClasses = 'text-[14px] font-medium text-[#E6E1E5] hover:underline active:opacity-80 transition-all'

const ButtonText = React.forwardRef<HTMLButtonElement, ButtonTextProps>(
  ({ children, className = '', ...props }, ref) => {
    const merged = className ? `${baseClasses} ${className}` : baseClasses

    return (
      <button ref={ref} className={merged} {...props}>
        {children}
      </button>
    )
  }
)

ButtonText.displayName = 'ButtonText'

export default ButtonText

