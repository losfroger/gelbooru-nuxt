import { defineStore } from 'pinia'
import { watch, reactive, computed } from 'vue'

interface settingsInt {
  hideNsfwImages: boolean,
  filteredTags: string[],
}

export const useSettingsStore = defineStore('settings', () => {

  const settings = reactive<settingsInt>({
    hideNsfwImages: false,
    filteredTags: ['loli', 'age_difference', 'bestiality', 'futanari']
  })

  const filteredTagsWithMinus = computed(() => settings.filteredTags.map((tag) => `-${tag}`))

  // When settins change, save them to localstorage
  watch(settings, onSettingsChange)

  function onSettingsChange(newValue: typeof settings) {
    console.log('Saving settings!', JSON.stringify({ ...newValue }))
    localStorage.setItem('settings', JSON.stringify({ ...newValue }))
  }

  function loadSettings() {
    const aux = localStorage.getItem('settings')

    if (!aux) {
      return
    }

    const auxJson = JSON.parse(aux)

    for (const setting of Object.keys(auxJson)) {
      if (setting in settings) {
        settings[setting as keyof typeof settings] = auxJson[setting]
      }
    }
  }


  return {
    settings,
    filteredTagsWithMinus,

    loadSettings,
  }
})
