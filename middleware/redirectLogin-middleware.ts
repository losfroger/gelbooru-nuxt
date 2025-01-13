import type { UserCredentials } from '~/types/auth-types'

export default defineNuxtRouteMiddleware((_to, _from) => {
  if (import.meta.server) {
    const user_creds = useCookie<UserCredentials | undefined>('user-credentials')

    console.log('Server auth middleware:', user_creds?.value)

    if (user_creds.value?.api_key && user_creds.value?.user_id) {
      console.log('Yes! login!')
      return navigateTo('/')
    }
  }
})