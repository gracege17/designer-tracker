import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'soft' | 'gentle' | 'cozy';
  background?: 'white' | 'cream';
}

export default function Card({
  children,
  className = '',
  padding = 'medium',
  shadow = 'soft',
  background = 'white',
}: CardProps) {
  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'p-4';
      case 'medium':
        return 'p-6';
      case 'large':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getShadowStyles = () => {
    switch (shadow) {
      case 'none':
        return '';
      case 'soft':
        return 'shadow-soft';
      case 'gentle':
        return 'shadow-gentle';
      case 'cozy':
        return 'shadow-cozy';
      default:
        return 'shadow-soft';
    }
  };

  const getBackgroundStyles = () => {
    return background === 'cream' ? 'bg-cream' : 'bg-white';
  };

  return (
    <div
      className={`
        ${getBackgroundStyles()}
        rounded-soft
        border border-gray-light
        ${getPaddingStyles()}
        ${getShadowStyles()}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
