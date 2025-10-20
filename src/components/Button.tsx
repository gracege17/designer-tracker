import React from 'react';

interface ButtonProps {
  title: string;
  onPress: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'pill';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  emoji?: string; // For emoji-friendly buttons
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  emoji,
  className = '',
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-mono-900 border-mono-900';
      case 'secondary':
        return 'bg-mono-200 border-mono-200';
      case 'outline':
        return 'bg-transparent border-mono-900';
      case 'pill':
        return 'bg-mono-900 border-mono-900 rounded-pill';
      default:
        return 'bg-mono-900 border-mono-900';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2';
      case 'medium':
        return 'px-6 py-3';
      case 'large':
        return 'px-8 py-4';
      default:
        return 'px-6 py-3';
    }
  };

  const getTextStyles = () => {
    const baseStyles = 'text-center font-normal';
    const sizeStyles = size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base';
    const colorStyles = variant === 'outline' ? 'text-mono-900' : variant === 'secondary' ? 'text-mono-700' : 'text-mono-50';
    return `${baseStyles} ${sizeStyles} ${colorStyles}`;
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={(e) => onPress(e)}
      disabled={isDisabled}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${variant === 'pill' ? '' : 'border rounded-xl'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
        ${className}
        flex items-center justify-center
        transition-all duration-200 ease-out
        hover:opacity-90 hover:scale-[0.98]
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-mono-300
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <div className="flex items-center justify-center">
          {emoji && (
            <span className="text-lg mr-2">{emoji}</span>
          )}
          <span className={getTextStyles()}>
            {title}
          </span>
        </div>
      )}
    </button>
  );
}
