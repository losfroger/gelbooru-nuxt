<template>
  <div class="tw-flex tw-flex-col tw-gap-2">
    <v-slide-x-reverse-transition
      group
    >
      <AppNotificationAlert
        v-for="notification in appStore.notification"
        :key="notification.uuid"
        :notification="notification"
      />
    </v-slide-x-reverse-transition>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/appStore'

const appStore = useAppStore()

</script>

<style scoped>

</style>