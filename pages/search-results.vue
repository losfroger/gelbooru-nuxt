<template>
  <div class="view-container tw-grid tw-grid-cols-1">
    <div>
      <GelbooruSearchBar
        v-model="tags"
        :search-results="data ? data['@attributes'].count : 0"
      />
      <div
        v-if="error"
        class="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-py-16"
      >
        {{ error.statusMessage }}
        <v-btn
          prepend-icon="mdi-arrow-left"
          @click="router.back()"
        >
          Back
        </v-btn>
      </div>
      <div
        v-else-if="data"
        class="tw-mt-8 tw-grid tw-grid-cols-1 tw-gap-4 sm:tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-5 2xl:tw-grid-cols-8"
      >
        <v-slide-y-reverse-transition group>
          <GelbooruPostCard
            v-for="post in data.post"
            :key="post.id"
            :post="post"
          />
        </v-slide-y-reverse-transition>
      </div>
      <div v-if="data">
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

/*
  PAGINATION THINGS
*/

const pid = computed(() => currentPage.value - 1)
const currentPage = ref(parseInt(route.query.page?.toString() ?? '1'))
console.log('Starting tags', route.query.tags?.toString())
const tags = ref(route.query.tags?.toString() ?? 'sort:score')

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

watch(() => route.query.tags, (newVal) => {
  console.log('Tags', newVal?.toString())
  tags.value = newVal?.toString() ?? ''
})

// Reset page when tags change
watch(tags, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    currentPage.value = 1
  }
})

// Push on router when tags or current page change
watch(() => [tags, currentPage], () => {
  const query: string[] = []

  if (currentPage.value) {
    query.push(`page=${encodeURIComponent(currentPage.value)}`)
  }

  if (tags.value) {
    query.push(`tags=${encodeURIComponent(tags.value)}`)
  }

  router.push(`/search-results?${query.join('&')}`)
}, {deep:true})

const firstLoad = ref(false)
const { data, error } = await useFetch<GelbooruPostRes>('/api/post', {
  query: {
    pid,
    tags,
  },
  onRequest: () => {
    if (process.client && firstLoad.value) {
      appStore.loading = true
    }
  },
  onResponse: () => {
    window.scroll(0, 0)
    if (process.client) {
      appStore.loading = false
    }
  }
})

firstLoad.value = true

useHead({
  title: () => {
    const aux = ['Search results', `Page ${currentPage.value}`]
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
  }
})

</script>

<style scoped>

</style>