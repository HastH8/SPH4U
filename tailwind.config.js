/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#DC2626',
          'red-dark': '#B91C1C',
          'red-light': '#EF4444',
        }
      }
    },
  },
  plugins: [],
}

