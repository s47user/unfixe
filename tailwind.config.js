/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--md-sys-color-primary)',
          container: 'var(--md-sys-color-primary-container)',
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#006971',
          600: '#00838f',
          700: '#00695c',
          800: '#004d40',
          900: '#003d33',
        },
        secondary: {
          DEFAULT: 'var(--md-sys-color-secondary)',
          container: 'var(--md-sys-color-secondary-container)',
          50: '#fffef7',
          100: '#fffaeb',
          200: '#fff2c7',
          300: '#ffe599',
          400: '#ffd54f',
          500: '#B8860B',
          600: '#ffa000',
          700: '#ff8f00',
          800: '#ff6f00',
          900: '#e65100',
        },
        surface: {
          DEFAULT: 'var(--md-sys-color-surface)',
          variant: 'var(--md-sys-color-surface-variant)',
        },
        outline: {
          DEFAULT: 'var(--md-sys-color-outline)',
          variant: 'var(--md-sys-color-outline-variant)',
        },
        success: 'var(--md-sys-color-success)',
        error: 'var(--md-sys-color-error)',
        warning: 'var(--md-sys-color-warning)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'elevation-1': 'var(--md-sys-elevation-1)',
        'elevation-2': 'var(--md-sys-elevation-2)',
        'elevation-3': 'var(--md-sys-elevation-3)',
        'elevation-4': 'var(--md-sys-elevation-4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};