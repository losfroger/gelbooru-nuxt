<template>
  <div>
    <v-card class="tw-max-w-xl tw-shadow-md">
      <v-card-title class="tw-flex tw-flex-row tw-items-center tw-gap-4 tw-pt-4">
        <img
          src="/gelbooru-logo.svg"
          class="tw-hidden tw-w-8 lg:tw-block"
        >
        My settings
      </v-card-title>
      <v-divider class="tw-my-4" />
      <v-card-text>
        <v-switch
          v-model="settingsStore.settings.hideNsfwImages"
          label="Hide NSFW images"
          color="primary"
          inset
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settingsStore'

useHead({
  title: 'Settings'
})

const settingsStore = useSettingsStore()

</script>

<style scoped>

</style>