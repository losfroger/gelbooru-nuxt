<template>
  <div class="tw-flex tw-flex-col tw-items-center">
    <div
      v-if="props.posts.post.length > 0"
      v-auto-animate
      class="tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2 md:tw-grid-cols-4 md:tw-gap-4 lg:tw-grid-cols-5 xl:tw-grid-cols-7"
    >
      <GelbooruPostCard
        v-for="post in props.posts.post"
        :key="post.id"
        :post="post"
        :favorites-mode="props.favoritesMode"
      />
    </div>
    <div v-else class="tw-flex tw-h-[70vh] tw-max-h-96 tw-flex-col tw-items-center tw-justify-center tw-gap-2">
      <QIcon name="mdi-robot-confused-outline" size="xl" />
      <h1 class="text-h4 tw-text-center">
        No posts were found
      </h1>
      <p class="tw-text-center">
        Maybe try with a different search <b>uwu</b>
      </p>
    </div>
    <QPagination
      v-model="currentPage"
      :max="pageCount"
      :max-pages="$q.screen.lt.md ? 3 : 10"
      boundary-numbers
      direction-links
      class="tw-mt-4"
      active-color="primary"
      color="grey"
      active-design="outline"
      rounded
    />
    <QBtn
      flat
      label="Go to page"
      class="tw-mt-3"
      :disable="props.posts.post.length < 1"
    >
      <QMenu
        v-model="showGoToPageMenu"
        transition-show="jump-down"
        transition-hide="jump-up"
        anchor="bottom middle"
        self="top middle"
        no-refocus
        :offset="[0,10]"
        @before-show="goToPage = currentPage"
        @before-hide="onHideGoToPageMenu"
      >
        <QForm @submit="showGoToPageMenu = false">
          <QInput
            v-model.number="goToPage"
            type="number"
            :placeholder="`1 / ${pageCount}`"
            autofocus
            filled
          />
        </QForm>
      </QMenu>
    </QBtn>
  </div>
</template>

<script setup lang="ts">
import type { Gelbooru } from '~/types/gelbooru'


interface GelbooruPostListProps {
  posts: Gelbooru.PostRes,
  favoritesMode?: boolean,
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

const showGoToPageMenu = ref(false)
function onHideGoToPageMenu() {
  currentPage.value = Math.max(1, Math.min(pageCount.value, goToPage.value ?? 1))
}

</script>

<style scoped>

</style>