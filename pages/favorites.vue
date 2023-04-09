<template>
  <div class="view-container tw-grid tw-grid-cols-1">
    {{ error }}
    <div v-if="data">
      <div
        class="tw-mt-8 tw-grid tw-grid-cols-1 tw-gap-4 sm:tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-5 2xl:tw-grid-cols-10"
      >
        <v-slide-y-reverse-transition group>
          <GelbooruPostCard
            v-for="post in data.post"
            :key="post.id"
            :post="post"
          />
        </v-slide-y-reverse-transition>
      </div>
      <div>
        <v-pagination
          v-model="currentPage"
          class="tw-col-span-full tw-mt-8 md:tw-mx-8"
          active-color="primary"
          rounded="circle"
          :length="pageCount"
          :show-first-last-page="$vuetify.display.mdAndUp"
          :size="$vuetify.display.mdAndUp ? 'default' : 40"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GelbooruPostRes } from '~/types/gelbooru'
import { useAppStore } from '~/stores/appStore'

const route = useRoute()
const router = useRouter()

const appStore = useAppStore()

definePageMeta({
  middleware: 'auth-middleware'
})

useHead({
  title: 'Favorites'
})

/*
  PAGINATION THINGS
*/

const pid = computed(() => currentPage.value - 1)
const currentPage = ref(parseInt(route.query.page?.toString() ?? '1'))

// Max page count is 400
const pageCount = computed(() => Math.min(
  400,
  // Calculate page count from count divided by limit
  Math.ceil(
    (data.value?.['@attributes'].count ?? 1) / (data.value?.['@attributes'].limit ?? 1)
  )
))

// Watch router query page
watch(() => route.query.page, (newVal) => {
  console.log('Page', newVal?.toString())
  currentPage.value = parseInt(newVal?.toString() ?? '1')
})

// Use refresh to fetch data with new page
watch(currentPage, (newValue, oldValue) => {
  if (newValue == oldValue) {
    return
  }

  console.log('Pushing new page!')
  router.push(`/favorites?page=${newValue}`)

  appStore.loading = true

  refresh()
})

const { data, error, refresh } = await useFetch<GelbooruPostRes>('/api/post/favorites', {
  query: {
    pid,
    limit: 50,
  },
  onResponse: () => {
    window.scroll(0, 0)
    if (process.client) {
      appStore.loading = false
    }
  }
})


</script>

<style scoped>

</style>