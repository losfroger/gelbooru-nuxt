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
const route = useRoute()

// #region Handle page

const currentPage = useRouteQuery('page', '1', { transform: Number, mode: 'push' })

const pid = computed(() => currentPage.value - 1)
watch(currentPage, async () => {
  await new Promise(r => setTimeout(r, 250))
  window.scroll(0, 0)
})

// #endregion

// #region Handle tags

const tags = useRouteQuery<string>('tags', 'sort:score', { mode: 'push' })

// Reset scroll on tag change
watch(tags, () => {
  window.scroll(0,0)
})

// #endregion

watch(() => route.params, () => {
  if (route.path == '/search-results') {
    refresh()
  }
})

const { data: posts, status, refresh } = await useFetch<GelbooruPostRes>('/api/post', {
  query: {
    pid,
    tags,
  },
  watch: false,
})

// Show loading circle
watch(status, (newVal) => {
  if (newVal == 'pending') {
    appStore.loading = true
  } else if(newVal == 'success') {
    appStore.loading = false
  }
})

// Page title
useHead({
  title: () => {
    const aux = ['Favorites', `Page ${currentPage.value}`]
    if (tags.value) {
      const auxTags = tags.value
          .split(',')
          .filter((x) => !x.includes('sort:') && !x.includes('score:'))
          .join(', ')

      if (auxTags) {
        aux.push(auxTags)
      }
    }

    return aux.join(' | ')
  },
})

</script>

<style scoped>

</style>