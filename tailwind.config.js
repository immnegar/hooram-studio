/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        vazir: ['Vazirmatn', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        studio: {
          950: '#07090E',
          900: '#0B0F19',
          850: '#111726',
          800: '#171F33',
          700: '#232F4D',
          600: '#34456E',
          accent: '#6366F1', // Indigo / Purple modern accent
          cyan: '#06B6D4',
          gold: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

