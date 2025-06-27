/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette based on provided hex codes
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#f638dc', // Main bright pink
          600: '#e11d87',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724'
        },
        secondary: {
          50: '#faf9fb',
          100: '#f4f2f6',
          200: '#e9e5ec',
          300: '#d9d2de',
          400: '#c4b5cb',
          500: '#a996b5',
          600: '#8e7b9b',
          700: '#7a6885',
          800: '#5a3d5c', // Medium purple
          900: '#382039', // Dark purple
          950: '#200f21' // Darkest navy
        },
        accent: {
          blue: '#f638dc',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          pink: '#f638dc'
        },
        profit: '#10b981',
        loss: '#ef4444',
        warning: '#f59e0b'
      },
      backdropBlur: {
        xs: '2px'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(246, 56, 220, 0.3)',
        'glow-purple': '0 0 20px rgba(90, 61, 92, 0.4)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glass': '0 8px 32px 0 rgba(32, 15, 33, 0.37)',
        'inner-glow': 'inset 0 1px 0 0 rgba(246, 56, 220, 0.1)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px rgba(246, 56, 220, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(246, 56, 220, 0.8)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-5%)' }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem'
      }
    }
  },
  plugins: [
    // Custom plugin for glassmorphism
    function({ addUtilities }) {
      addUtilities({
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        },
        '.neon-glow': {
          textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
        },
        '.gradient-shimmer': {
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite'
        }
      })
    }
  ]
};
