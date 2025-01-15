<template>
  <div class="tw-flex tw-flex-col tw-items-center">
    <div v-if="favorites">
      <GelbooruPostList v-model:page="currentPage" :posts="favorites" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { QPagination } from 'quasar'
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

const pageCount = computed(() => Math.min(
  400,
  // Calculate page count from count divided by limit
  Math.ceil(
    (favorites.value?.['@attributes'].count ?? 1) / (favorites.value?.['@attributes'].limit ?? 1)
  )
))


</script>

<style scoped>

</style>