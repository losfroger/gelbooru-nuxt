<template>
  <v-app>
    <AppSiteBar />
    <v-navigation-drawer
      expand-on-hover
      :rail="$vuetify.display.lgAndUp"
    >
      <v-list nav>
        <v-list-item
          v-for="(item, i) in itemList"
          :key="i"
          :value="item"
          :disabled="!authStore.logged_in_computed"
          active-color="primary"
          :to="item.to"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>

          <v-list-item-title> {{ item.text }} </v-list-item-title>
        </v-list-item>
      </v-list>
      <template #append>
        <div v-if="authStore.logged_in_computed">
          <v-list-item
            active-color="primary"
            to="/settings"
          >
            <template #prepend>
              <v-icon icon="mdi-cog" />
            </template>

            <v-list-item-title> Settings </v-list-item-title>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <NuxtLoadingIndicator color="#006FFA" />
      <ClientOnly>
        <v-fade-transition>
          <div
            v-if="appStore.loading"
            class="tw-fixed tw-left-1/2 tw-z-50 tw-mt-1 -tw-translate-x-1/2 tw-rounded-full tw-bg-black tw-bg-opacity-50 tw-p-2 tw-backdrop-blur-sm"
          >
            <v-progress-circular
              color="primary"
              indeterminate
            />
          </div>
        </v-fade-transition>
      </ClientOnly>
      <v-container
        fluid
        class="tw-flex tw-min-h-[90vh] tw-flex-col tw-items-center tw-pb-20"
      >
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
import { useSettingsStore } from '~/stores/settingsStore'
import { useAppStore } from '~/stores/appStore'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const appStore = useAppStore()

if (process.client) {
  settingsStore.loadSettings()
}


useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Gelbooru` : 'Gelbooru'
  }
})

const itemList = ref([
  {text: 'Favorites', icon: 'mdi-heart', to: '/favorites'}
])

</script>

<style scoped>

</style>