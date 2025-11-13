import React from 'react'

type ButtonPrimaryCTAProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const baseClasses = 'w-full py-2 px-4 font-medium text-[14px] bg-[#EC5429] text-white transition-all duration-200 hover:bg-[#F76538] active:scale-[0.98] disabled:bg-[#938F99] disabled:cursor-not-allowed disabled:opacity-50'

const ButtonPrimaryCTA = React.forwardRef<HTMLButtonElement, ButtonPrimaryCTAProps>(
  ({ children, className = '', ...props }, ref) => {
    const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    )
  }
)

ButtonPrimaryCTA.displayName = 'ButtonPrimaryCTA'

export default ButtonPrimaryCTA

