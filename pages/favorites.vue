<template>
  <div>
    <div v-if="favorites?.post && status =='success'" class="tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2 md:tw-grid-cols-4 md:tw-gap-4 lg:tw-grid-cols-5">
      <GelbooruPostCard
        v-for="post in favorites.post"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GelbooruPostRes } from '~/types/gelbooru'


const route = useRoute()

const currentPage = ref(parseInt(route.query.page?.toString() ?? '1'))
const pid = computed(() => currentPage.value - 1)
const tags = ref(route.query.tags?.toString() ?? 'sort:score')

const { data: favorites, status } = await useFetch<GelbooruPostRes>('/api/post/favorites', {
  query: {
    pid,
    tags,
  },
})

</script>

<style scoped>

</style>