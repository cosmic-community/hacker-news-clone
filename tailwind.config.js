/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        hn: {
          orange: '#ff6600',
          'orange-dark': '#cc5200',
          beige: '#f6f6ef',
          gray: '#828282',
        },
      },
      fontFamily: {
        sans: ['Verdana', 'Geneva', 'sans-serif'],
      },
    },
  },
  plugins: [],
}