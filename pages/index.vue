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
    <div v-auto-animate class="counter-hero-banner tw-relative tw-flex tw-min-h-14 tw-flex-row">
      <PageCuteCounter
        v-for="(number, idx) in postCount.value?.toString()"
        :key="idx"
        :number="number"
      />
      <div v-if="status == 'pending'" class="absolute-center tw-rounded-full tw-bg-neutral-950/70 tw-p-2 tw-backdrop-blur-sm">
        <QCircularProgress
          color="accent"
          indeterminate
          track-color="dark"
          size="lg"
          rounded
          :thickness="0.3"
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
          class="tw-w-full tw-max-w-3xl"
        />
        <QBtn
          type="submit"
          label="Search"
          color="primary"
          size="lg"
          class="tw-my-auto"
        />
      </QForm>
      <div class="links-hero-wrapper tw-flex tw-flex-row tw-gap-4">
        <a
          href="https://gelbooru.com/index.php?page=comment&s=list"
          target="_blank"
        >
          Comments
        </a>
        <a
          href="https://gelbooru.com/index.php?page=forum&s=list"
          target="_blank"
        >
          Forum
        </a>
        <a
          href="https://gelbooru.com/index.php?page=wiki&s=list"
          target="_blank"
        >
          Wiki
        </a>
        <a
          href="https://gelbooru.com/index.php?page=account&s=home"
          target="_blank"
        >
          My account
        </a>
      </div>
      <GelbooruGoToPostId :button-props="{ flat: true, color: 'white' }" />
    </div>
  </div>
</template>

<script setup lang="ts">

const appStore = useAppStore()
const router = useRouter()

const postCount = computed(() => postCountRes ?? appStore.homePostCount)

const { data: postCountRes, refresh, status } = useFetch('/api/post/count', {
  onResponse: ({ response }) => {
    appStore.homePostCount = response._data
  },
})
useIntervalFn(refresh, 60_000)

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

.links-hero-wrapper {
  a {
    @apply tw-text-primary hover:tw-text-accent tw-transition-colors tw-no-underline tw-text-lg
  }
}

.counter-hero-banner::before {
  content: "";
  @apply tw-bg-primary tw-h-8 md:tw-h-14 tw-w-screen tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2
  tw-bg-gradient-to-b tw-from-primary tw-to-blue-950;
}

</style>