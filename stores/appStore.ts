export interface NotificationInterface {
  uuid: string,
  title?: string,
  text?: string,
  icon?: string,
  timeout: number,
  color: string
}

export const useAppStore = defineStore('appStore', () => {
  const toggleMenu = ref(false)
  const loading = ref(false)

  const notification = ref<NotificationInterface[]>([])

  function addNotification(options: {
    title?: string,
    text?: string,
    icon?: string,
    timeout?: number,
    color?: string
  }) {
    notification.value.push({
      uuid: Date.now().toString(),
      title: options.title,
      text: options.text,
      icon: options.icon,
      timeout: options.timeout ?? 5000,
      color: options.color ?? 'success',
    })
  }

  function removeNotification(uuid: string) {
    notification.value = notification.value.filter((notif) => notif.uuid !== uuid)
  }


  return {
    toggleMenu,
    loading,
    notification,
    addNotification,
    removeNotification,
  }
})
