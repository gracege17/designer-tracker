import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'small' | 'medium' | 'large';
  center?: boolean;
}

export default function Container({
  children,
  className = '',
  maxWidth = 'md',
  padding = 'medium',
  center = true,
}: ContainerProps) {
  const getMaxWidthStyles = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-md';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'px-4 py-2';
      case 'medium':
        return 'px-6 py-4';
      case 'large':
        return 'px-8 py-6';
      default:
        return 'px-6 py-4';
    }
  };

  return (
    <div
      className={`
        w-full
        ${getMaxWidthStyles()}
        ${getPaddingStyles()}
        ${center ? 'mx-auto' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
