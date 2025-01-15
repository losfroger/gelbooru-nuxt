<template>
  <div class="tw-flex tw-flex-col tw-items-center">
    <div
      v-auto-animate
      class="tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2 md:tw-grid-cols-4 md:tw-gap-4 lg:tw-grid-cols-5"
    >
      <GelbooruPostCard
        v-for="post in props.posts.post"
        :key="post.id"
        :post="post"
      />
    </div>
    <QPagination
      v-model="currentPage"
      :max="pageCount"
      max-pages="10"
      boundary-numbers
      boundary-links
      direction-links
      class="tw-mt-4"
      active-color="primary"
      color="grey"
      active-design="outline"
      rounded
    />
    <QBtn
      label="Go to page"
      flat
      class="tw-mt-3"
    >
      <QMenu
        transition-show="jump-down"
        transition-hide="jump-up"
        anchor="bottom middle"
        self="top middle"
        :offset="[0,10]"
        @before-show="goToPage = currentPage"
        @before-hide="currentPage = Math.max(1, Math.min(pageCount, goToPage ?? 1))"
      >
        <QInput
          v-model.number="goToPage"
          type="number"
          :placeholder="`1 / ${pageCount}`"
          autofocus
          filled
        />
      </QMenu>
    </QBtn>
  </div>
</template>

<script setup lang="ts">
import type { GelbooruPostRes } from '~/types/gelbooru'


interface GelbooruPostListProps {
  posts: GelbooruPostRes
}

const props = defineProps<GelbooruPostListProps>()
const currentPage = defineModel<number>('page', {default: 1})

const goToPage = ref<number | undefined>(undefined)

const pageCount = computed(() => Math.min(
  400,
  // Calculate page count from count divided by limit
  Math.ceil(
    (props.posts['@attributes'].count ?? 1) / (props.posts['@attributes'].limit ?? 1)
  )
))

</script>

<style scoped>

</style>