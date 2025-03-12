<template>
  <QLayout
    class="default-layout"
    view="lHh lpR lff"
  >
    <NuxtLoadingIndicator color="#006FFA" class="tw-z-[9999]" />
    <QHeader reveal class="tw-bg-transparent tw-shadow-lg tw-shadow-black/25">
      <QToolbar class="tw-relative tw-bg-neutral-700 tw-px-6 tw-py-3 dark:tw-bg-neutral-800">
        <div v-auto-animate class="tw-flex tw-flex-1 tw-flex-row tw-items-center tw-gap-2">
          <QBtn
            v-if="$q.screen.lt.md"
            icon="mdi-menu"
            dense
            round
            flat
            class="tw-my-auto"
            @click="leftDrawerOpen = true"
          />
          <NuxtLink
            v-if="$q.screen.lt.md"
            to="/"
            class="tw-my-auto"
          >
            <img src="/gelbooru-logo.svg" class="tw-my-auto tw-h-auto tw-w-7">
          </NuxtLink>
          <QToolbarTitle>
            Gelbooru
          </QToolbarTitle>
        </div>
        <UserMenu />
        <Transition
          appear
          enter-active-class="animated fadeInDown animate__faster"
          leave-active-class="animated fadeOutUp animate__faster"
        >
          <div v-if="appStore.loading" class="loading-circle-wrapper -tw-ml-[27px]">
            <QCircularProgress
              indeterminate
              color="primary"
              track-color="dark"
              size="30px"
              rounded
              :thickness="0.3"
            />
          </div>
        </Transition>
      </QToolbar>
    </QHeader>

    <QDrawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :mini="miniState"
      mini-to-overlay
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
    >
      <div class="tw-flex tw-h-full tw-flex-col">
        <div v-if="$q.screen.gt.sm" class="tw-py-3">
          <NuxtLink
            to="/"
            class="tw-my-auto tw-flex tw-flex-col tw-justify-center tw-rounded-sm tw-align-middle tw-transition-colors hover:tw-bg-neutral-700"
          >
            <img
              src="/gelbooru-logo.svg"
              class="tw-mx-auto tw-h-auto tw-w-6 tw-object-contain md:tw-w-10"
            >
          </NuxtLink>
        </div>
        <QList class="tw-flex-1" padding>
          <QItem
            v-ripple
            clickable
            to="/"
            active-class="drawer-item-active"
          >
            <QItemSection avatar>
              <QIcon name="mdi-magnify" />
            </QItemSection>
            <QItemSection>
              Search
            </QItemSection>
          </QItem>
          <QItem
            v-ripple
            clickable
            :disable="!authStore.logged_in_computed"
            to="/favorites"
            active-class="drawer-item-active"
          >
            <QItemSection avatar>
              <QIcon name="mdi-heart-outline" />
            </QItemSection>
            <QItemSection>
              Favorites
            </QItemSection>
          </QItem>
        </QList>
        <QList padding>
          <QItem
            v-ripple
            clickable
            to="/settings"
            active-class="drawer-item-active"
          >
            <QItemSection avatar>
              <QIcon name="mdi-cog-outline" />
            </QItemSection>
            <QItemSection>
              Settings
            </QItemSection>
          </QItem>
        </QList>
      </div>
    </QDrawer>


    <QPageContainer class="page-container tw-flex tw-max-w-[100vw] tw-flex-col tw-items-center tw-overflow-hidden tw-bg-[#f2f2f2] dark:tw-bg-neutral-900">
      <QPage padding class="tw-min-h-[90vh] tw-w-full tw-max-w-[2400px] tw-p-4 tw-pb-14 md:tw-p-6">
        <NuxtPage />
      </QPage>
    </QPageContainer>

    <PageFooter />
  </QLayout>
</template>

<script setup lang="ts">
import { QCircularProgress, QToolbarTitle } from 'quasar'

const authStore = useAuthStore()
const appStore = useAppStore()

const miniState = ref(true)
const leftDrawerOpen = ref(true)

</script>

<style scoped>
.page-container {
  min-height: 93vh !important;
}

.default-layout {
  @apply tw-bg-cover tw-bg-center tw-bg-no-repeat;
}

.loading-circle-wrapper {
  @apply tw-absolute -tw-bottom-16 tw-left-1/2 tw-z-[9999] tw-rounded-full tw-bg-neutral-950/70 tw-p-3 tw-backdrop-blur-sm tw-shadow-sm;
}

</style>

<style>
.drawer-item-active {
  @apply tw-bg-primary/20 tw-text-primary
}

.animate__faster {
  --animate-duration: 500ms;
}

</style>