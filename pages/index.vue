<template>
  <div class="tw-flex tw-flex-col tw-items-center tw-gap-3">
    <div v-auto-animate class="counter-hero-banner tw-relative tw-flex tw-flex-row">
      <PageCuteCounter
        v-for="(number, idx) in postCount?.toString()"
        :key="idx"
        :number="number"
      />
      <div v-if="status == 'pending'" class="absolute-center tw-rounded-full tw-bg-neutral-800/50 tw-p-2 tw-backdrop-blur-sm">
        <QCircularProgress
          color="accent"
          indeterminate
          size="lg"
          rounded
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const { data: postCount, refresh, status } = useFetch('/api/post/count')
</script>

<style scoped>

.counter-hero-banner::before {
  content: "";
  @apply tw-bg-primary tw-h-16 tw-w-screen tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2
  tw-bg-gradient-to-b tw-from-primary tw-to-blue-950;
}

</style>