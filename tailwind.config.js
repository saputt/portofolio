/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: '#2563EB',
        deep: '#1D4ED8',
        ink: '#0F172A',
        mist: '#F8FAFC',
        sky: '#EFF6FF',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero-mobile': ['2.3rem', { letterSpacing: '-0.045em', lineHeight: '0.92' }],
        'hero-desktop': ['6rem', { letterSpacing: '-0.045em', lineHeight: '0.92' }],
        'hero-large': ['11rem', { letterSpacing: '-0.045em', lineHeight: '0.92' }],
        'section-mobile': ['2.2rem', { letterSpacing: '-0.045em', lineHeight: '1.05' }],
        'section-desktop': ['4.5rem', { letterSpacing: '-0.045em', lineHeight: '1.05' }],
        'section-large': ['6.5rem', { letterSpacing: '-0.045em', lineHeight: '1.05' }],
        'heading-mobile': ['2.4rem', { letterSpacing: '-0.045em', lineHeight: '1.05' }],
        'heading-desktop': ['4rem', { letterSpacing: '-0.045em', lineHeight: '1.05' }],
        'display-sm': ['2.1rem', { letterSpacing: '-0.03em', lineHeight: '0.98' }],
        'display-lg': ['4.6rem', { letterSpacing: '-0.03em', lineHeight: '0.98' }],
      },
      spacing: {
        '18': '4.5rem',
        '128': '32rem',
      },
      maxWidth: {
        'prose': '65ch',
        '40rem': '40rem',
      },
      animation: {
        'up': 'up 36s linear infinite',
        'down': 'down 42s linear infinite',
        'marquee': 'marquee 28s linear infinite',
      },
      keyframes: {
        up: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(0, -50%, 0)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        down: {
          '0%': { transform: 'translate3d(0, -50%, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
}