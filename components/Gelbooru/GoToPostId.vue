<template>
  <v-btn
    v-bind="$attrs"
  >
    Go to post ID
    <v-menu
      :close-on-content-click="false"
      :location="$vuetify.display.mdAndUp ? 'bottom center' : 'top center'"
      activator="parent"
    >
      <v-card min-width="300">
        <v-form @submit.prevent="goToPostId">
          <v-card-text>
            <v-text-field
              v-model="postId"
              label="ID"
              color="primary"
              type="number"
              prepend-inner-icon="mdi-key"
              hide-details="auto"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              type="submit"
              color="primary"
            >
              Go
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
const router = useRouter()

const postId = ref('')

function goToPostId() {
  // check id is valid
  if (isNaN(parseInt(postId.value))) {
    appStore.addNotification({
      color: 'error',
      title: 'Not a valid ID',
      icon: 'mdi-close',
      text: 'Please introduce a valid ID'
    })
  }

  router.push(`post/${parseInt(postId.value)}`)
}

</script>

<style scoped>

</style>