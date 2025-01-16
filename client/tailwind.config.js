/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        'slate': {
          800: '#1e293b',
          900: '#0f172a',
        },
        'purple': {
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          900: '#581c87',
        },
        'pink': {
          400: '#f472b6',
          500: '#ec4899',
        },
        // Additional UI colors
        'white': {
          DEFAULT: '#ffffff',
          '10': 'rgba(255, 255, 255, 0.1)',
          '20': 'rgba(255, 255, 255, 0.2)',
          '90': 'rgba(255, 255, 255, 0.9)',
        },
        // Chart colors
        'chart': {
          'blue': '#0088FE',
          'green': '#00C49F',
          'yellow': '#FFBB28',
          'orange': '#FF8042',
        },
        'blue': {
          500: '#3b82f6',
        },
        'cyan': {
          500: '#06b6d4',
        },
        'green': {
          500: '#22c55e',
        },
        'emerald': {
          500: '#10b981',
        },
        'orange': {
          500: '#f97316',
        },
        'amber': {
          500: '#f59e0b',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}