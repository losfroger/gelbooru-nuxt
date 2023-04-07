/* eslint-disable @typescript-eslint/ban-ts-comment */
import vuetify from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: { transpile: ['vuetify'] },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) =>
        // @ts-ignore
        config.plugins.push(vuetify())
      )
    },
  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
})
