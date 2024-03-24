import { screens } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '321px',
        ...screens
      },
      flex: {
        2: '2 2 0%',
        3: '3 3 0%'
      }
    }
  },
  plugins: []
}
