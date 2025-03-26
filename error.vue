<template>
  <QLayout
    class="default-layout"
    view="lHh lpR lff"
  >
    <QHeader reveal class="tw-bg-transparent tw-shadow-lg tw-shadow-black/25">
      <QToolbar class="tw-relative tw-flex tw-flex-row tw-gap-2 tw-bg-neutral-700 tw-px-6 tw-py-3 dark:tw-bg-neutral-800">
        <NuxtLink
          to="/"
          class="tw-my-auto tw-flex tw-flex-col tw-justify-center tw-rounded-sm tw-align-middle"
        >
          <img
            src="/gelbooru-logo.svg"
            class="tw-mx-auto tw-h-auto tw-w-6 tw-object-contain md:tw-w-10"
          >
        </NuxtLink>
        <div v-auto-animate class="tw-flex tw-flex-1 tw-flex-row tw-items-center tw-gap-2">
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
      </QToolbar>
    </QHeader>
    <QPageContainer class="page-container tw-flex tw-max-w-[100vw] tw-flex-col tw-items-center tw-overflow-hidden tw-bg-[#f2f2f2] dark:tw-bg-neutral-900">
      <QPage padding class="tw-min-h-[90vh] tw-w-full tw-max-w-[2400px] tw-p-4 tw-pb-14 md:tw-p-6">
        <div class="tw-flex tw-flex-col tw-items-center">
          <div class="tw-flex tw-flex-col tw-gap-2 tw-py-12">
            <div class="tw-mx-auto tw-flex tw-flex-row">
              <PageCuteCounter
                v-for="(number, idx) in props.error?.statusCode.toString() ?? '500'"
                :key="idx"
                :number="number"
                class="test"
              />
            </div>
            <h1 class="text-h3 tw-mt-6 tw-text-center">
              Nani!? There was an error! :(
            </h1>
            <p class="text-body1 tw-text-center tw-text-2xl">
              {{ props.error?.message ?? 'Unknown error' }}
            </p>
            <QBtn
              class="tw-mx-auto tw-mt-6"
              color="primary"
              to="/"
              label="Go back home"
              icon="mdi-home"
            />
          </div>
        </div>
      </QPage>
    </QPageContainer>
    <PageFooter />
  </QLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

</script>

<style scoped>

.test {
  :deep(.cute-counter) {
    @apply tw-w-16 md:tw-w-20;
  }
}

</style>