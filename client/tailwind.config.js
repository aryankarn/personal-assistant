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
          50: '#e6f0ff',
          100: '#bfd7ff',
          200: '#99beff',
          300: '#73a5ff',
          400: '#4d8cfe',
          500: '#2673fa',
          600: '#1c5cd0',
          700: '#1245a7',
          800: '#092e7d',
          900: '#051754',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}