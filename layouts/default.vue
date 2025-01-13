<template>
  <QLayout
    class="default-layout"
    view="lHh  lpR fff"
  >
    <QHeader reveal class="tw-bg-transparent tw-shadow-lg tw-shadow-black/25">
      <QToolbar class="tw-flex tw-flex-row tw-gap-4 tw-bg-neutral-700 tw-px-6 tw-py-3 dark:tw-bg-neutral-800">
        <h1 class="text-h5">
          Gelbooru
        </h1>
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
      <div class="tw-py-1.5">
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
            <QIcon name="mdi-heart" />
          </QItemSection>
          <QItemSection>
            Favorites
          </QItemSection>
        </QItem>
      </QList>
    </QDrawer>
    <QPageContainer class="page-container tw-flex tw-flex-col tw-items-center tw-bg-[#f2f2f2] dark:tw-bg-neutral-900">
      <QPage padding class="tw-min-h-[90vh] tw-w-full tw-max-w-[1400px] tw-p-4 tw-pb-14 md:tw-p-6">
        <NuxtPage />
      </QPage>
    </QPageContainer>
    <PageFooter />
  </QLayout>
</template>

<script setup lang="ts">

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