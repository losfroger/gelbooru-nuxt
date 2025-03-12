import { defineStore } from 'pinia'
import { DefaultFilteredTags } from '~/types/gelbooru'

export interface UserSettings {
  hideNsfwImages: boolean,
  filteredTags: string[],
  numberPostsPerPage: number,
}

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
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 50 * 365 * 24 * 60 * 60,
    }),
  },
})
