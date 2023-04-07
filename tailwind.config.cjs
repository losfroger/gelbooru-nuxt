/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  important: true,
  corePlugins: {
    preflight: false
  },
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    screens: {
      'xs': '0px',
      'sm': '600px',
      'md': '960px',
      'lg': '1264px',
      'xl': '1904px',
      '2xl': '2500px',
    },
    extend: {
      colors: {
        background: '#121212',
        error: '#CF6679',
        info: '#2196F3',
        primary: '#006FFA',
        secondary: '#BB86FC',
        accent: '#03DAC5',
        success: '#4CAF50',
        surface: '#212121',
        warning: '#FB8C00',
      }
    },
  },
  plugins: [],
}
