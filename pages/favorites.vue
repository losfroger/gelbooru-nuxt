<template>
  <div class="view-container tw-grid tw-grid-cols-1">
    {{ error }}
    <div
      v-if="data"
      class="tw-mt-8 tw-grid tw-grid-cols-1 tw-gap-4 sm:tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-5 2xl:tw-grid-cols-10"
    >
      <GelbooruPostCard
        v-for="post in data.post"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GelbooruPostRes } from '~/types/gelbooru'

definePageMeta({
  middleware: 'auth-middleware'
})

useHead({
  title: 'Favorites'
})

const { data, error } = await useFetch<GelbooruPostRes>('/api/post/favorites', {
  query: {
    pid: 0,
    limit: 50,
  },
})

</script>

<style scoped>

</style>