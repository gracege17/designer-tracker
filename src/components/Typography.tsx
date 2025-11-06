import React from 'react'

type ElementType = React.ElementType

type TypographyProps<T extends ElementType> = {
  as?: T
  className?: string
  children?: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

function createTypographyComponent<T extends ElementType>(
  displayName: string,
  defaultTag: T,
  baseClasses: string
) {
  function Component<E extends ElementType = T>({
    as,
    className = '',
    children,
    ...rest
  }: TypographyProps<E>) {
    const Tag = (as || defaultTag) as ElementType
    const combined = [baseClasses, className].filter(Boolean).join(' ')

    return (
      <Tag className={combined} {...(rest as Record<string, unknown>)}>
        {children}
      </Tag>
    )
  }

  Component.displayName = displayName

  return Component as <E extends ElementType = T>(props: TypographyProps<E>) => JSX.Element
}

export const Heading1 = createTypographyComponent('Heading1', 'h1', 'text-[18px] font-bold text-slate-900')
export const BodyTextPrimary = createTypographyComponent('BodyTextPrimary', 'p', 'text-[14px] font-medium text-slate-700')
export const BodyTextSecondary = createTypographyComponent('BodyTextSecondary', 'p', 'text-[13px] text-slate-600')
export const BodyTextMuted = createTypographyComponent('BodyTextMuted', 'p', 'text-sm text-slate-500')
export const AlertSuccess = createTypographyComponent('AlertSuccess', 'div', 'text-[14px] font-medium text-green-800')
export const LabelBold = createTypographyComponent('LabelBold', 'span', 'font-bold')

