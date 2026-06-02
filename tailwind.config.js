/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tavern: {
          dark: '#0f0d0e',     // Very dark background
          card: '#161414',     // Card background
          cardHover: '#1c1919',// Card hover
          border: '#2a2424',   // Subtle borders
          accent: '#e4573d',   // Orange/Red highlight (from 'Play Now' button)
          accentGlow: 'rgba(228, 87, 61, 0.2)',
          text: '#e6dfdc',     // Primary text
          textMuted: '#8a827f',// Secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(228, 87, 61, 0.15)',
        'glow-strong': '0 0 40px rgba(228, 87, 61, 0.3)',
      }
    },
  },
  plugins: [],
}
