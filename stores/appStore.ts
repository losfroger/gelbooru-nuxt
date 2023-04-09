export const useAppStore = defineStore('appStore', () => {
  const toggleMenu = ref(true)
  const loading = ref(false)

  return {
    toggleMenu,
    loading,
  }
})
