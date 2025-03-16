import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user_id = useCookie<string | undefined>('user-id')
  const logged_in_computed = computed(() => user_id.value ? true : false)

  const queryGeneratorStore = useQueryGeneratorStore()

  async function login(newApi_key: string, newUser_id: string) {
    return await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        api_key: newApi_key,
        user_id: newUser_id,
      },
    })
      .then(() => {
        user_id.value = newUser_id
        queryGeneratorStore.clearQuery()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function logout() {
    return $fetch('/api/auth/logout')
      .then(() => {
        const router = useRouter()
        user_id.value = undefined
        router.replace('/login')
        queryGeneratorStore.clearQuery()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return {
    user_id,
    logged_in_computed,

    login,
    logout,
  }
})
