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
      // => @media (min-width: 640px) { ... }

      sm: '599.99px',
      // => @media (min-width: 768px) { ... }

      md: '1023.99px',
      // => @media (min-width: 1024px) { ... }

      lg: '1439.99px',
      // => @media (min-width: 1280px) { ... }

      xl: '1919.99px',
    },
    extend: {
      colors: {
        primary: '#e9672e',
        secondary: '#0cb9c5',
        accent: '#fc4b6c',
        info: '#03c9d7',
        success: '#05b187',
        positive: '#05b187',
        warning: '#fec90f',
        error: '#fc4b6c',
        negative: '#fc4b6c',
        background: {
          DEFAULT: '#f2f2f2',
          dark: '#171717',
        },
      },
    },
  },
}
