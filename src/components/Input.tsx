import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export default function Input({
  label,
  error,
  helperText,
  required = false,
  className = '',
  ...inputProps
}: InputProps) {
  const hasError = !!error;

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2 block transition-colors duration-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <input
        className={`
          px-4 py-4
          border rounded-xl
          bg-[var(--md-sys-color-surface-container-high)]
          text-[var(--md-sys-color-on-surface)]
          font-body text-body-md
          w-full
          transition-all duration-300 ease-out
          focus:outline-none
          placeholder:text-[var(--md-sys-color-on-surface-variant)]
          ${hasError 
            ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/20' 
            : 'border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)] focus:ring-4 focus:ring-[rgba(236,84,41,0.25)] hover:border-[var(--md-sys-color-outline-variant)]'
          }
        `}
        required={required}
        {...inputProps}
      />

      {/* Error Message */}
      {error && (
        <span className="text-xs text-red-600 mt-1.5 font-medium block animate-fade-in">
          ⚠️ {error}
        </span>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <span className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-1.5 block">
          {helperText}
        </span>
      )}
    </div>
  );
}
