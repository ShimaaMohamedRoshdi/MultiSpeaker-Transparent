/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Sora"', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(242, 204, 143, 0.5)' },
          '70%': { boxShadow: '0 0 0 12px rgba(242, 204, 143, 0)' },
        },
      },
      animation: {
        'float-in': 'floatIn 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-out infinite',
      },
    },
  },
  plugins: [],
}

