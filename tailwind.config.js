import { screens } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // corePlugins: {
  //   preflight: false,
  // },
  important: true,
  theme: {
    extend: {
      screens: {
        xs: '321px',
        ...screens,
      },
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
      },
    },
  },
  plugins: [],
};
