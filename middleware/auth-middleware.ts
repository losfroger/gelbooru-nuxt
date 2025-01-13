import { useAuthStore } from '~/stores/authStore'
import type { UserCredentials } from '~/types/auth-types'

export default defineNuxtRouteMiddleware((to, _from) => {
  if (import.meta.server) {
    const user_creds = useCookie<UserCredentials | undefined>('user-credentials')

    console.log('Server auth middleware:', !user_creds?.value)

    if (!user_creds.value) {
      console.log('no! login!')
      return navigateTo('/login')
    }
  }
  if (import.meta.client) {
    console.log('Auth client!', to)
    const authStore = useAuthStore()
    if (!authStore.logged_in_computed) {
      return abortNavigation()
    }
  }
})