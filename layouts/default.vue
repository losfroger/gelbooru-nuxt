<template>
  <QLayout
    class="default-layout"
    view="lHh lpR lff"
  >
    <QHeader reveal class="tw-bg-transparent tw-shadow-lg tw-shadow-black/25">
      <QToolbar class="tw-bg-neutral-700 tw-px-6 tw-py-3 dark:tw-bg-neutral-800">
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
      <div v-if="$q.screen.gt.sm" class="tw-py-1.5">
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
      <QList padding>
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
    </QDrawer>

    <QPageContainer class="page-container tw-flex tw-max-w-[100vw] tw-flex-col tw-items-center tw-overflow-hidden tw-bg-[#f2f2f2] dark:tw-bg-neutral-900">
      <QPage padding class="tw-min-h-[90vh] tw-w-full tw-max-w-[1400px] tw-p-4 tw-pb-14 md:tw-p-6">
        <NuxtPage />
      </QPage>
    </QPageContainer>

    <PageFooter />
  </QLayout>
</template>

<script setup lang="ts">
import { QToolbarTitle } from 'quasar'


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
</style>

<style>
.drawer-item-active {
  @apply tw-bg-primary/20 tw-text-primary
}

</style>