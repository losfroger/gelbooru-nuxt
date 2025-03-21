/** @type {import('tailwindcss').Config} */
module.exports = {
  // Hacer que Tailwind pueda usar el dark mode de Quasar
  darkMode: ['class', '[class~="body--dark"]'],
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  important: true,
  prefix: 'tw-',
  theme: {
    screens: {
      xs: '0px',
      sm: '599.99px',
      md: '1023.99px',
      lg: '1439.99px',
      xl: '1919.99px',
    },
    extend: {
      colors: {
        primary: '#006FFA',
        secondary: '#BB86FC',
        accent: '#03DAC5',
        info: '#2196F3',
        positive: '#4CAF50',
        warning: '#FB8C00',
        negative: '#CF6679',
        background: {
          DEFAULT: '#f2f2f2',
          'light-dark': '#262626',
          dark: '#171717',
        },
      },
    },
  },
}
