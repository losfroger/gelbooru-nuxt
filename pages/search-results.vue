<template>
  <div v-auto-animate class="tw-flex tw-flex-col tw-items-center">
    <div v-if="status == 'pending' && (posts?.post?.length ?? 0) < 1">
      <QCircularProgress
        color="primary"
        indeterminate
        size="50px"
        track-color="dark"
      />
    </div>
    <div v-if="posts" class="tw-flex tw-flex-col tw-gap-4">
      <GelbooruSearchBarFull
        v-model="tags"
        :search-results-count="posts['@attributes'].count"
        class="tw-mx-auto tw-w-full tw-max-w-7xl"
      />
      <GelbooruPostList
        v-model:page="currentPage"
        :posts="posts"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GelbooruPostRes } from '~/types/gelbooru'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// #region Handle page

const currentPage = ref(parseInt(route.query.page?.toString() ?? '1'))
const pid = computed(() => currentPage.value - 1)

watch(currentPage, async () => {
  await new Promise(r => setTimeout(r, 250))
  window.scroll(0, 0)
})

// #endregion

// #region Handle tags

const tags = ref(route.query.tags?.toString() ?? 'sort:score')

// Update internal tag value when the route query changes
watch (() => route.query.tags, (newVal) => {
  if (newVal) {
    tags.value = newVal.toString()
  }
}, { immediate: true })

// Reset scroll on tag change
watch(tags, () => {
  window.scroll(0,0)
})

// #endregion

const { data: posts, status } = await useFetch<GelbooruPostRes>('/api/post', {
  query: {
    pid,
    tags,
  },
})

// Show loading circle
watch(status, (newVal) => {
  if (newVal == 'pending') {
    appStore.loading = true
  } else {
    appStore.loading = false
  }
})

// Update the url query when tags or current page changes
watch(() => [tags, currentPage], () => {
  const searchQuery: Record<string, string | undefined> = {
    page: undefined,
    tags: undefined,
  }

  if (currentPage.value && currentPage.value > 1) {
    searchQuery.page = currentPage.value.toString()
  }

  if (tags.value) {
    searchQuery.tags = tags.value.toString()
  }

  router.push({
    path: '/search-results',
    query: searchQuery,
  })
}, { deep:true })


</script>

<style scoped>

</style>