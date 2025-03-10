import { useAuthStore } from '~/stores/authStore'
import type { UserCredentials } from '~/types/auth-types'

export default defineNuxtRouteMiddleware((to, _from) => {
  if (import.meta.server) {
    const user_creds = useCookie<UserCredentials | undefined>('user-credentials')

    if (!user_creds.value) {
      return navigateTo('/login')
    }
  }
  if (import.meta.client) {
    const authStore = useAuthStore()
    if (!authStore.logged_in_computed) {
      return abortNavigation()
    }
  }
})