/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deco-black': '#121212',
        'deco-silver': '#C0C0C0',
        'deco-red': '#8B0000',
        'deco-dark-surface': '#1E1E1E',

        'deco-white': '#F5F5F5',
        'deco-gold': '#D4AF37',
        'deco-purple': '#4B0082',
        'deco-light-surface': '#FFFFFF',
      },
      fontFamily: {
        'deco': ['"Limelight"', '"Courier New"', 'cursive'],
        'sans': ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'deco-pattern-dark': "repeating-linear-gradient(45deg, #121212 0px, #121212 10px, #1E1E1E 10px, #1E1E1E 11px)",
        'deco-pattern-light': "repeating-linear-gradient(45deg, #F5F5F5 0px, #F5F5F5 10px, #E0E0E0 10px, #E0E0E0 11px)",
      }
    },
  },
  plugins: [],
}
