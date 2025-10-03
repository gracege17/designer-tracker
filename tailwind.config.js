/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochromatic color system
        mono: {
          50: '#fafafa',  // Lightest background
          100: '#f4f4f5', // Light background
          200: '#e4e4e7', // Subtle borders
          300: '#d4d4d8', // Stronger borders
          400: '#a1a1aa', // Disabled text
          500: '#71717a', // Secondary text
          600: '#52525b', // Primary text
          700: '#3f3f46', // Strong text
          800: '#27272a', // Headings
          900: '#18181b', // Black text
        },
        
        // Fallback colors for backward compatibility
        primary: '#18181b',
        'primary-50': '#fafafa',
        'primary-100': '#f4f4f5',
        'primary-200': '#e4e4e7',
        'primary-300': '#d4d4d8',
        'primary-400': '#a1a1aa',
        'primary-500': '#71717a',
        'primary-600': '#52525b',
        'primary-700': '#3f3f46',
        'primary-800': '#27272a',
        'primary-900': '#18181b',
        
        'surface-50': '#fafafa',
        'surface-100': '#f4f4f5',
        'surface-200': '#e4e4e7',
        'surface-300': '#d4d4d8',
        'surface-400': '#a1a1aa',
        'surface-500': '#71717a',
        'surface-600': '#52525b',
        'surface-700': '#3f3f46',
        'surface-800': '#27272a',
        'surface-900': '#18181b',
        
        'success-50': '#fafafa',
        'success-100': '#f4f4f5',
        'success-200': '#e4e4e7',
        'success-300': '#d4d4d8',
        'success-400': '#a1a1aa',
        'success-500': '#71717a',
        
        'warning-50': '#fafafa',
        'warning-100': '#f4f4f5',
        'warning-200': '#e4e4e7',
        'warning-300': '#d4d4d8',
        'warning-400': '#a1a1aa',
        'warning-500': '#71717a',
        
        'error-50': '#fafafa',
        'error-100': '#f4f4f5',
        'error-200': '#e4e4e7',
        'error-300': '#d4d4d8',
        'error-400': '#a1a1aa',
        'error-500': '#71717a',
        
        'background-light': '#fafafa',
        'background-dark': '#18181b',
        
        // Project colors - grayscale
        project: {
          a: '#18181b', // Black
          b: '#27272a', // Dark gray
          c: '#3f3f46', // Medium dark gray
          d: '#52525b', // Medium gray
          e: '#71717a', // Gray
          f: '#a1a1aa', // Light gray
          g: '#d4d4d8', // Very light gray
          h: '#e4e4e7', // Almost white
        },
        
        // Emotion colors - grayscale
        emotion: {
          happy: '#18181b',    // Black
          relaxed: '#27272a',  // Dark gray
          excited: '#3f3f46',  // Medium dark gray
          angry: '#52525b',    // Medium gray
          sad: '#71717a',      // Gray
          anxious: '#a1a1aa',  // Light gray
          surprised: '#d4d4d8', // Very light gray
          bored: '#e4e4e7',    // Almost white
          nostalgic: '#27272a', // Dark gray
          energized: '#18181b', // Black
          normal: '#71717a',    // Gray
          tired: '#a1a1aa',     // Light gray
        }
      },
      fontFamily: {
        // Modern typography system
        'display': ['Inter', 'system-ui', 'sans-serif'],  // For large, impactful text
        'heading': ['Inter', 'system-ui', 'sans-serif'],  // For section headers
        'body': ['Inter', 'system-ui', 'sans-serif'],     // For body text
        'mono': ['JetBrains Mono', 'monospace'],          // For code and numbers
      },
      fontSize: {
        // Type scale with consistent ratios
        'display': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],    // 40px
        'h1': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],         // 32px
        'h2': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],         // 24px
        'h3': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],       // 20px
        'body-lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],        // 18px
        'body': ['1rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],               // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],   // 14px
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],    // 12px
      },
      borderRadius: {
        // Consistent rounding scale
        'none': '0',
        'xs': '0.25rem',    // 4px
        'sm': '0.5rem',     // 8px
        'md': '0.75rem',    // 12px
        'lg': '1rem',       // 16px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        'pill': '9999px',
      },
      spacing: {
        // 4px grid for fine control
        '0': '0',
        '1': '0.25rem',     // 4px
        '2': '0.5rem',      // 8px
        '3': '0.75rem',     // 12px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '8': '2rem',        // 32px
        '10': '2.5rem',     // 40px
        '12': '3rem',       // 48px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '32': '8rem',       // 128px
      },
      boxShadow: {
        // Elevation system
        'none': 'none',
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.05)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.05)',
        'xl': '0 16px 32px rgba(0, 0, 0, 0.05)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'focus': '0 0 0 4px rgba(228, 228, 231, 0.5)', // mono-200 with 50% opacity
      },
      backgroundImage: {
        // Gradients - monochromatic
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-success': 'linear-gradient(to right, #f4f4f5, #e4e4e7)',
        'gradient-warning': 'linear-gradient(to right, #f4f4f5, #e4e4e7)',
        'gradient-error': 'linear-gradient(to right, #f4f4f5, #e4e4e7)',
        'gradient-primary': 'linear-gradient(to right, #f4f4f5, #e4e4e7)',
      },
      animation: {
        // Motion system
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1.05)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
