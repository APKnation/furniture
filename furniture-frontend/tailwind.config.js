/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1ed760',
        'primary-pressed': '#1db954',
        'on-primary': '#000000',
        ink: '#ffffff',
        body: '#b3b3b3',
        charcoal: '#cbcbcb',
        muted: '#7c7c7c',
        ash: '#4d4d4d',
        stone: '#272727',
        'on-dark': '#ffffff',
        'on-dark-mute': '#b3b3b3',
        canvas: '#121212',
        surface: '#181818',
        'surface-elevated': '#1f1f1f',
        'surface-card': '#252525',
        hairline: '#4d4d4d',
        'hairline-soft': 'rgba(255,255,255,0.1)',
        'hairline-strong': '#7c7c7c',
        sale: '#f3727f',
        success: '#1ed760',
        // Legacy mappings
        'body-strong': '#ffffff',
        'body-on-light': '#000000',
        'muted-soft': '#7c7c7c',
        'canvas-elevated': '#181818',
        'canvas-light': '#121212',
        'semantic-warning': '#ffa42b',
        'semantic-success': '#1ed760',
        'semantic-info': '#539df5',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'spotify-heavy': 'rgba(0,0,0,0.5) 0px 8px 24px',
        'spotify-medium': 'rgba(0,0,0,0.3) 0px 8px 8px',
        'spotify-inset': 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset',
      },
      letterSpacing: {
        'tighter-display': '0',
        'button': '1.5px',
        'nav': '0',
        'cap': '0',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
