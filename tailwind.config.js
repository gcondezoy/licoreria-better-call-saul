/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta licorería: fondos oscuros elegantes + acento ámbar/dorado
        ink: {
          950: '#0a0a0b',
          900: '#111113',
          800: '#1a1a1e',
          700: '#26262c',
          600: '#3a3a42',
        },
        amber: {
          DEFAULT: '#c8962c',
          400: '#e0b354',
          500: '#c8962c',
          600: '#a67a1f',
        },
        wine: {
          DEFAULT: '#6b1f2a',
          light: '#8a2a38',
        },
        cream: '#f4efe6',
        muted: '#a19a8c',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px rgba(200,150,44,0.25), 0 8px 40px rgba(200,150,44,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease both',
      },
    },
  },
  plugins: [],
}
