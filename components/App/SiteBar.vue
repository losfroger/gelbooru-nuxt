<template>
  <v-app-bar :title="titlePage">
    <template #prepend>
      <v-btn
        v-if="$vuetify.display.mdAndDown"
        icon="mdi-menu"
        @click="appStore.toggleMenu = !appStore.toggleMenu"
      />
      <nuxt-link to="/">
        <v-img
          src="/gelbooru-logo.svg"
          contain
          :width="$vuetify.display.mdAndUp ? '40px' : '25px'"
        />
      </nuxt-link>
      <Title />
    </template>
    <template #append>
      <ClientOnly>
        <v-menu
          location="bottom"
        >
          <template #activator="{ props }">
            <v-fade-transition
              group
              leave-absolute
            >
              <v-btn
                v-if="!authStore.logged_in_computed"
                key="1"
                color="accent"
                variant="tonal"
                to="/login"
                prepend-icon="mdi-login"
              >
                Login
              </v-btn>
              <v-btn
                v-if="authStore.logged_in_computed"
                id="user-menu"
                key="2"
                icon="mdi-account"
                v-bind="props"
              />
            </v-fade-transition>
          </template>
          <v-card
            min-width="200px"
            class="tw-m-2"
          >
            <v-list>
              <v-list-item>
                <v-list-item-title>User ID</v-list-item-title>
                <v-list-item-subtitle>{{ authStore.user_id }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider class="tw-my-2" />
              <v-list-item @click="authStore.logout">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </ClientOnly>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/appStore'
import { useAuthStore } from '~/stores/authStore'

const appStore = useAppStore()
const authStore = useAuthStore()

const titlePage = computed(() => 'Gelbooru')

</script>

<style scoped>

</style>