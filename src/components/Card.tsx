import React from 'react'

type CardOwnProps<T extends React.ElementType> = {
  as?: T
  className?: string
  children?: React.ReactNode
}

type CardProps<T extends React.ElementType> = CardOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>

const BASE_CLASSES = 'rounded-2xl bg-white/[0.04] p-4 space-y-2 transition-all shadow-md hover:bg-white/[0.06]'

export default function Card<T extends React.ElementType = 'div'>({
  as,
  className = '',
  children,
  ...rest
}: CardProps<T>) {
  const Component = (as || 'div') as React.ElementType
  const mergedClassName = className ? `${BASE_CLASSES} ${className}` : BASE_CLASSES

  return (
    <Component className={mergedClassName} {...rest}>
      {children}
    </Component>
  )
}
