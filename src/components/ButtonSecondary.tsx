import React from 'react'

type ButtonSecondaryProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const baseClasses = 'w-full py-2 px-4 text-center bg-white/[0.04] border border-white/60 text-[#E6E1E5] font-medium text-[14px] hover:bg-[#3A3840] transition-all active:scale-[0.99]'

const ButtonSecondary = React.forwardRef<HTMLButtonElement, ButtonSecondaryProps>(
  ({ children, className = '', ...props }, ref) => {
    const merged = className ? `${baseClasses} ${className}` : baseClasses
    return (
      <button ref={ref} className={merged} {...props}>
        {children}
      </button>
    )
  }
)

ButtonSecondary.displayName = 'ButtonSecondary'

export default ButtonSecondary

