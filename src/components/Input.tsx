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
        <label className="text-sm font-medium text-slate-700 mb-2 block transition-colors duration-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <input
        className={`
          px-4 py-4
          border-2 rounded-xl
          bg-white
          text-slate-900
          font-body text-body-md
          w-full
          transition-all duration-300 ease-out
          focus:outline-none
          placeholder:text-slate-400
          ${hasError 
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
            : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-slate-300'
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
        <span className="text-xs text-slate-500 mt-1.5 block">
          {helperText}
        </span>
      )}
    </div>
  );
}
