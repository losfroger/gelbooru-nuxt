<template>
  <div class="tw-mt-14 tw-flex tw-flex-col tw-items-center tw-gap-3">
    <a
      href="https://gelbooru.com/index.php"
      target="_blank"
      class="tw-text-white tw-no-underline tw-transition-colors hover:tw-text-primary"
    >
      <h1 class="tw-mb-1 tw-text-center tw-text-6xl tw-font-semibold">
        Gelbooru
      </h1>
    </a>
    <div v-auto-animate class="counter-hero-banner tw-relative tw-flex tw-min-h-8 tw-flex-row">
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
    <div class="tw-mt-4 tw-flex tw-w-full tw-flex-col tw-items-center tw-gap-2">
      <QForm
        class="tw-flex tw-w-full tw-flex-1 tw-flex-row tw-items-center tw-justify-center tw-gap-4"
        @submit="onSubmitSearch"
      >
        <GelbooruSearchBar
          v-model="searchTags"
          filled
          clearable
          hide-bottom-space
          class="tw-w-full tw-max-w-4xl"
        />
        <QBtn
          type="submit"
          label="Search"
          color="primary"
          size="lg"
          class="tw-my-auto"
        />
      </QForm>
      <GelbooruGoToPostId :button-props="{ flat: true, color: 'white' }" />
    </div>
  </div>
</template>

<script setup lang="ts">

const router = useRouter()

const { data: postCount, refresh, status } = useFetch('/api/post/count')

const searchTags = ref<string[]>([])
function onSubmitSearch() {
  const auxTags = searchTags.value.concat('sort:score')
  console.log(auxTags)
  router.push({
    path: '/search-results',
    query: {
      tags: `${auxTags.join(',')}`,
    },
  })
}

</script>

<style scoped>

.counter-hero-banner::before {
  content: "";
  @apply tw-bg-primary tw-h-8 md:tw-h-14 tw-w-screen tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2
  tw-bg-gradient-to-b tw-from-primary tw-to-blue-950;
}

</style>