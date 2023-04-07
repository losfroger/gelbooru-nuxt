import { ThemeDefinition, createVuetify } from "vuetify";

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const darkTheme: ThemeDefinition = {
  dark: true,
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
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'darkTheme',
      themes: {
        darkTheme
      }
    },
  })

  app.vueApp.use(vuetify);
})