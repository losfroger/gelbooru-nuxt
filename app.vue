<template>
  <v-app>
    <AppSiteBar />
    <v-navigation-drawer
      v-model="appStore.toggleMenu"
      expand-on-hover
      :rail="$vuetify.display.lgAndUp"
    >
      <v-list nav>
        <v-list-item
          v-for="(item, i) in itemList"
          :key="i"
          :disabled="!authStore.logged_in_computed"
          color="primary"
          :to="item.to"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>

          <v-list-item-title> {{ item.text }} </v-list-item-title>
        </v-list-item>
        <v-spacer />
      </v-list>
      <template #append>
        <div>
          <v-divider />
          <v-list nav>
            <v-list-item
              :disabled="!authStore.logged_in_computed"
              color="primary"
              to="/settings"
            >
              <template #prepend>
                <v-icon icon="mdi-cog" />
              </template>

              <v-list-item-title> Settings </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <NuxtLoadingIndicator color="#006FFA" />
      <ClientOnly>
        <v-fade-transition>
          <div
            v-if="appStore.loading"
            class="tw-fixed tw-left-1/2 tw-z-50 tw-mt-1 -tw-translate-x-1/2 tw-rounded-full tw-bg-black tw-bg-opacity-70 tw-p-3 tw-backdrop-blur-sm"
          >
            <v-progress-circular
              color="primary"
              indeterminate
            />
          </div>
        </v-fade-transition>
        <AppNotificationsAlerts class="tw-fixed tw-bottom-2 tw-right-2 tw-z-50" />
      </ClientOnly>
      <v-container
        fluid
        class="tw-flex tw-min-h-[91vh] tw-flex-col tw-items-center tw-pb-24"
      >
        <NuxtPage />
      </v-container>
      <v-footer class="tw-flex tw-flex-col tw-gap-4 tw-bg-neutral-950 tw-p-8 tw-shadow-md">
        <v-btn
          icon
          variant="text"
          href="https://github.com/losfroger/gelbooru-nuxt"
          target="_blank"
        >
          <v-icon icon="mdi-github" />
          <v-tooltip
            location="top center"
            activator="parent"
          >
            See source code
          </v-tooltip>
        </v-btn>
        <v-divider class="tw-w-full tw-border-opacity-70" />
        <p class="text-body-2 tw-text-center">
          This site is an unofficial third party client for Gelbooru.
        </p>
      </v-footer>
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

useHead({
  htmlAttrs: {
    lang: 'es',
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Gelbooru` : 'Gelbooru'
  }
})

const itemList = ref([
  {text: 'Search', icon: 'mdi-magnify', to: '/'},
  {text: 'Favorites', icon: 'mdi-heart', to: '/favorites?page=1&tags=sort:score'},
])

</script>

<style scoped>

</style>