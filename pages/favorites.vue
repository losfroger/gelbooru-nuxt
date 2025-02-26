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
        @update:model-value="currentPage = 1"
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

const appStore = useAppStore()

// #region Handle page

const currentPage = useRouteQuery('page', '1', { transform: Number })

const pid = computed(() => currentPage.value - 1)
watch(currentPage, async () => {
  await new Promise(r => setTimeout(r, 250))
  window.scroll(0, 0)
})

// #endregion

// #region Handle tags

const tags = useRouteQuery<string>('tags', 'sort:score')

// Reset scroll on tag change
watch(tags, () => {
  window.scroll(0,0)
})

// #endregion

const { data: posts, status } = await useFetch<GelbooruPostRes>('/api/post/favorites', {
  query: {
    pid,
    tags,
  },
})

// Show loading circle
watch(status, (newVal) => {
  if (newVal == 'pending') {
    appStore.loading = true
  } else if(newVal == 'success') {
    appStore.loading = false
  }
})


</script>

<style scoped>

</style>