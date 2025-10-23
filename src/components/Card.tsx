import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'soft' | 'gentle' | 'cozy';
  background?: 'white' | 'cream';
  variant?: 'default' | 'asymmetric' | 'glass';
}

export default function Card({
  children,
  className = '',
  padding = 'medium',
  shadow = 'soft',
  background = 'white',
  variant = 'default',
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
    // Dark mode only: use dark theme colors
    if (variant === 'glass') {
      return ''; // Glass variant uses inline style for background
    }
    return background === 'cream' ? 'bg-[#211F26]' : 'bg-white/[0.04]';
  };

  const getBorderRadiusStyles = () => {
    if (variant === 'asymmetric') {
      return ''; // Will use inline style for custom border-radius
    }
    if (variant === 'glass') {
      return 'rounded-lg'; // 8px border-radius
    }
    return 'rounded-soft';
  };

  const getVariantStyles = () => {
    if (variant === 'asymmetric') {
      return {
        borderRadius: '4px 47px 4px 4px',
      };
    }
    if (variant === 'glass') {
      return {
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.04)',
      };
    }
    return {};
  };

  return (
    <div
      className={`
        ${getBackgroundStyles()}
        ${getBorderRadiusStyles()}
        ${variant === 'default' ? 'border border-gray-light' : ''}
        ${getPaddingStyles()}
        ${variant === 'default' ? getShadowStyles() : ''}
        ${className}
      `}
      style={getVariantStyles()}
    >
      {children}
    </div>
  );
}
