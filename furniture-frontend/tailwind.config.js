/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#da291c',
        'primary-active': '#b01e0a',
        'primary-hover': '#9d2211',
        'on-primary': '#ffffff',
        ink: '#ffffff',
        body: '#969696',
        'body-strong': '#ffffff',
        'body-on-light': '#181818',
        muted: '#666666',
        'muted-soft': '#8f8f8f',
        hairline: '#303030',
        'hairline-on-light': '#d2d2d2',
        'hairline-soft': '#ebebeb',
        canvas: '#181818',
        'canvas-elevated': '#303030',
        'canvas-light': '#ffffff',
        'surface-card': '#303030',
        'surface-soft-light': '#f7f7f7',
        'surface-strong-light': '#ebebeb',
        'on-dark': '#ffffff',
        'on-light': '#181818',
        'accent-yellow': '#f6e500',
        'semantic-info': '#4c98b9',
        'semantic-success': '#03904a',
        'semantic-warning': '#f13a2c',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tighter-display': '-0.04em',
        'button': '0.1em',
        'nav': '0.05em',
        'cap': '0.1em',
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
