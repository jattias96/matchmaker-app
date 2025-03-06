/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937', // Dark gray for sidebar
        secondary: '#6B7280', // Softer gray for text
        accent: {
          500: '#8B5CF6', // Purple for buttons
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};