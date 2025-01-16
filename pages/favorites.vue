<template>
  <div class="tw-flex tw-flex-col tw-items-center">
    <div v-if="favorites">
      <GelbooruPostList v-model:page="currentPage" :posts="favorites" />
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

watch(currentPage, async () => {
  await new Promise(r => setTimeout(r, 250))
  window.scrollTo({ behavior: 'instant', left: 0, top: 0})
})


</script>

<style scoped>

</style>