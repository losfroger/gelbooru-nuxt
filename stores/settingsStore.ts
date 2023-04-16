import { defineStore } from 'pinia'
import { watch, reactive, computed } from 'vue'
import { useAppStore } from '~/stores/appStore'

interface UserSettings {
  hideNsfwImages: boolean,
  filteredTags: string[],
}

let firstLoad = false

export const useSettingsStore = defineStore('settings', () => {

  const settings = reactive<UserSettings>({
    hideNsfwImages: false,
    filteredTags: ['loli', 'age_difference', 'bestiality', 'futanari']
  })

  const filteredTagsWithMinus = computed(() => settings.filteredTags.map((tag) => `-${tag}`))

  // When settins change, save them to localstorage
  watch(settings, onSettingsChange)

  function onSettingsChange(newValue: typeof settings) {
    console.log('Saving settings!', firstLoad)

    if (firstLoad) {
      const appStore = useAppStore()
      appStore.addNotification({ text: 'Settings saved!' })
    }

    firstLoad = true
  }

  return {
    settings,
    filteredTagsWithMinus,

    //loadSettings,
  }
}, {
  persist: {
    storage: persistedState.cookiesWithOptions({
      maxAge: 50 * 365 * 24 * 60 * 60
    }),
  }
})
