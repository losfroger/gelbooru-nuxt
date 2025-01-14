<template>
  <div>
    <div v-if="favorites?.post && status =='success'" class="tw-grid tw-grid-cols-4 tw-gap-4">
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