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
  ],
  runtimeConfig: {
    public: {
      VERSION: 'rewrite 0.0.1',
    },
  },
  tailwindcss: {
    cssPath: '@/assets/css/tailwind.css',
  },
  quasar: {
    iconSet: 'mdi-v7',
    quietSassWarnings: true,
    config: {
      ripple: true,
      dark: 'auto',
    },
    extras: {
      animations: 'all',
    },
    plugins: [
      'Notify',
      'Dark',
    ],
  },
})