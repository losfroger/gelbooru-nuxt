// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'nuxt-quasar-ui',
    '@nuxtjs/google-fonts',
    '@formkit/auto-animate/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    public: {
      version: '2.0.2',
    },
  },
  css: [
    '@/assets/css/global.scss',
  ],
  tailwindcss: {
    cssPath: '@/assets/css/tailwind.css',
  },
  quasar: {
    iconSet: 'mdi-v7',
    quietSassWarnings: true,
    config: {
      ripple: true,
      dark: true,
      brand: {
        primary: '#006FFA',
        secondary: '#BB86FC',
        accent: '#03DAC5',
        dark: '#262626',
        positive: '#4CAF50',
        negative: '#CF6679',
        info: '#2196F3',
        warning: '#FB8C00',
      },
    },
    extras: {
      animations: 'all',
    },
    plugins: [
      'Notify',
      'Dark',
      'Dialog',
    ],
  },
  googleFonts: {
    preconnect: true,
    download: false,
    families: {
      Barlow: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'JetBrains Mono': [400],
    },
  },
})