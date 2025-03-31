import { defineStore } from 'pinia'
import { Gelbooru } from '~/types/gelbooru'

export interface UserSettings {
  hideNsfwImages: boolean,
  filteredTags: string[],
  numberPostsPerPage: number,
  syncQueryBetweenTabs: boolean,
}

export const defaultUserSettings: UserSettings = {
  hideNsfwImages: false,
  filteredTags: Gelbooru.DefaultFilteredTags,
  numberPostsPerPage: 24,
  syncQueryBetweenTabs: true,
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<UserSettings>({
    hideNsfwImages: false,
    filteredTags: Gelbooru.DefaultFilteredTags,
    numberPostsPerPage: 24,
    syncQueryBetweenTabs: true,
  })

  const filteredTagsWithMinus = computed(() => settings.value.filteredTags.map((tag) => `-${tag}`))

  function resetSettings() {
    settings.value = defaultUserSettings
  }

  watch(settings, (newVal) => {
    if (newVal.syncQueryBetweenTabs) {
      const queryGenStore = useQueryGeneratorStore()
      queryGenStore.initQueryBroadcastChannel()
    } else {
      const queryGenStore = useQueryGeneratorStore()
      queryGenStore.closeQueryBroadcastChannel()
      localStorage.removeItem(localStorageQuerySyncKey)
    }
  }, { deep: true })

  return {
    settings,
    filteredTagsWithMinus,
    resetSettings,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 50 * 365 * 24 * 60 * 60,
    }),
  },
})
