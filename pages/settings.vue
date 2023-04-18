<template>
  <div>
    <v-card class="tw-min-w-[40vw] tw-max-w-xl tw-shadow-md">
      <v-card-title class="tw-flex tw-flex-row tw-items-center tw-gap-4 tw-pt-4">
        <v-icon
          icon="mdi-cog"
          class="tw-hidden tw-w-8 lg:tw-block"
        />
        My settings
      </v-card-title>
      <v-divider class="tw-my-4" />
      <v-card-text class="tw-pb-8">
        <v-switch
          v-model="auxSettings.hideNsfwImages"
          label="Hide NSFW images"
          color="primary"
          inset
        />
        <GelbooruTagSelector
          v-model="auxSettings.filteredTags"
          label="Tag Blacklist"
          prepend-inner-icon="mdi-cancel"
          :clearable="false"
          hide-default-items
          hint="Any post containing a blacklisted tag will be ignored."
          persistent-hint
        />
      </v-card-text>
      <v-card-actions class="tw-flex tw-flex-col tw-items-start tw-gap-2 md:tw-flex-row">
        <v-fade-transition>
          <div
            v-if="changes"
            class="text-caption tw-flex tw-flex-row tw-gap-2 tw-text-error"
          >
            <v-icon icon="mdi-alert-circle-outline" />
            Changes have been made, please save to avoid losing them.
          </div>
        </v-fade-transition>
        <v-btn
          color="primary"
          class="md:tw-ml-auto"
          @click="saveSettings"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore, type UserSettings } from '~/stores/settingsStore'

useHead({
  title: 'Settings'
})

const settingsStore = useSettingsStore()
const auxSettings = ref<UserSettings>(Object.assign({},settingsStore.settings))
const changes = ref(false)

watch(auxSettings, () => {
  changes.value = true
}, {deep: true})

function saveSettings() {
  settingsStore.settings.filteredTags = auxSettings.value.filteredTags
  settingsStore.settings.hideNsfwImages = auxSettings.value.hideNsfwImages

  changes.value = false
}

</script>

<style scoped>

</style>