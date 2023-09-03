<template>
  <v-btn
    v-bind="$attrs"
    :disabled="!authStore.logged_in_computed"
  >
    Go to post ID
    <v-menu
      v-model="menuOpen"
      :disabled="!authStore.logged_in_computed"
      :close-on-content-click="false"
      :location="$vuetify.display.mdAndUp ? 'bottom center' : 'top center'"
      activator="parent"
    >
      <v-card min-width="300">
        <v-form @submit.prevent="goToPostId">
          <v-card-text>
            <v-text-field
              ref="idTextFieldRef"
              v-model="postId"
              autofocus
              label="ID"
              color="primary"
              type="number"
              prepend-inner-icon="mdi-key"
              hide-details="auto"
              :rules="[v => !!v || 'Please introduce an ID']"
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
import { useAuthStore } from '~/stores/authStore'
import { VTextField } from 'vuetify/lib/components/index.mjs'

const authStore = useAuthStore()
const router = useRouter()

const menuOpen = ref(false)

const idTextFieldRef = ref<InstanceType<typeof VTextField> | null>(null)
const postId = ref('')

// Grab focus when menu is opened
watch(idTextFieldRef, (newVal) => {
  if (newVal) {
    const input: HTMLElement = idTextFieldRef.value?.$el?.querySelector('input')

    if (input) {
      setTimeout(() => {
        input.focus()
      }, 20)
    }
  }
})


function goToPostId() {
  // check id is valid
  if (isNaN(parseInt(postId.value))) {
    return
  }

  router.push(`post/${parseInt(postId.value)}`)
}

</script>

<style scoped>

</style>