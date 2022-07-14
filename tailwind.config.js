/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        240: '60rem',
      },
    },
    screens: {
      sm: '450px',
    },
  },
  plugins: [],
};
