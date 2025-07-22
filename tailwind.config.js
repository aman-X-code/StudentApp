/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        light: {
          primary: '#FFFFFF',
          secondary: '#FAFAFA',
          tertiary: '#F5F5F5',
          card: '#FFFFFF',
        },
        // Dark Mode Colors
        dark: {
          primary: '#000000',
          secondary: '#121212',
          tertiary: '#1E1E1E',
          card: '#1A1A1A',
        },
        // Text Colors
        text: {
          light: {
            primary: '#1A1A1A',
            secondary: '#4A4A4A',
            tertiary: '#6B7280',
            muted: '#9CA3AF',
          },
          dark: {
            primary: '#FFFFFF',
            secondary: '#E5E5E5',
            tertiary: '#B3B3B3',
            muted: '#737373',
          }
        },
        // Border Colors
        border: {
          light: {
            primary: '#E5E7EB',
            secondary: '#D1D5DB',
          },
          dark: {
            primary: '#2A2A2A',
            secondary: '#404040',
          }
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.8)',
          dark: 'rgba(0, 0, 0, 0.8)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'floating': 'floating 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};