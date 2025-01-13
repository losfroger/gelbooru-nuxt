import { defineStore } from 'pinia'
import { useAppStore } from '~/stores/appStore'
import { DefaultFilteredTags } from '~/types/gelbooru'

export interface UserSettings {
  hideNsfwImages: boolean,
  filteredTags: string[],
  numberPostsPerPage: number,
}

let firstLoad = false

export const defaultUserSettings: UserSettings = {
  hideNsfwImages: false,
  filteredTags: DefaultFilteredTags,
  numberPostsPerPage: 50,
}

export const useSettingsStore = defineStore('settings', () => {

  const settings = ref<UserSettings>({
    hideNsfwImages: false,
    filteredTags: DefaultFilteredTags,
    numberPostsPerPage: 50,
  })

  const filteredTagsWithMinus = computed(() => settings.value.filteredTags.map((tag) => `-${tag}`))

  // When settins change, save them to localstorage
  watch(settings, onSettingsChange, { deep: true })

  function onSettingsChange() {
    console.log('Saving settings!', firstLoad)

    if (firstLoad) {
      const appStore = useAppStore()
      appStore.addNotification({ text: 'Settings saved!' })
    }

    firstLoad = true
  }

  function resetSettings() {
    settings.value = defaultUserSettings
  }

  return {
    settings,
    filteredTagsWithMinus,
    resetSettings,
  }
}, {
  persist: {
    storage: persistedState.cookiesWithOptions({
      maxAge: 50 * 365 * 24 * 60 * 60,
    }),
  },
})
