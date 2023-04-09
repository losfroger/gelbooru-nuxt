import { UserCredentials } from '~/types/auth-types'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) {
    const user_creds = useCookie<UserCredentials | undefined>('user-credentials')

    console.log('Server auth middleware:', user_creds?.value)

    if (user_creds.value?.api_key && user_creds.value?.user_id) {
      console.log('Yes! login!')
      return navigateTo('/favorites')
    }
  }
})