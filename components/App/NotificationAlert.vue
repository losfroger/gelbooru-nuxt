<template>
  <v-alert
    :title="props.notification.title"
    :text="props.notification.text"
    :icon="props.notification.icon"
    :color="props.notification.color"
    closable
  >
    <template #close>
      <v-btn
        icon="mdi-close"
        @click="appStore.removeNotification(props.notification.uuid)"
      />
    </template>
  </v-alert>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useAppStore, type NotificationInterface } from '~/stores/appStore'

const props = defineProps({
  notification: {
    type: Object as PropType<NotificationInterface>,
    default: (): NotificationInterface => ({
      uuid: '-1',
      title: 'Error',
      timeout: -1,
      color: 'success'
    })
  }
})

const appStore = useAppStore()

if ((props.notification.timeout ?? -1) > 0) {
  setTimeout(() => appStore.removeNotification(props.notification.uuid), props.notification.timeout)
}



</script>

<style scoped>

</style>