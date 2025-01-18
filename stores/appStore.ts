export interface NotificationInterface {
  uuid: string,
  title?: string,
  text?: string,
  icon?: string,
  timeout: number,
  color: string
}

export const useAppStore = defineStore('appStore', () => {
  const router = useRouter()
  const toggleMenu = ref(false)
  const loading = ref(false)

  router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
      loading.value = false
    }

    next()
  })

  return {
    toggleMenu,
    loading,
  }
})
