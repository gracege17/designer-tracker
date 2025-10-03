import React from 'react';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  background?: 'white' | 'cream' | 'gradient';
  safeArea?: boolean;
}

export default function Screen({
  children,
  className = '',
  padding = 'medium',
  background = 'white',
  safeArea = true,
}: ScreenProps) {
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

  const getBackgroundStyles = () => {
    switch (background) {
      case 'cream':
        return 'bg-cream';
      case 'gradient':
        return 'bg-gradient-to-br from-cream to-white';
      default:
        return 'bg-white';
    }
  };

  return (
    <div
      className={`
        min-h-screen
        ${getBackgroundStyles()}
        ${getPaddingStyles()}
        ${safeArea ? 'pt-safe pb-safe' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
