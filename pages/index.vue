<template>
  <div class="view-container tw-mt-3 tw-flex tw-flex-col tw-gap-2 md:tw-mt-[15vh]">
    <div class="hero-gelbooru tw-relative tw-flex tw-flex-col tw-items-center">
      <a
        href="https://gelbooru.com/index.php"
        target="_blank"
        class="tw-text-white tw-no-underline tw-transition-colors hover:tw-text-primary"
      >
        <h1 class="tw-mb-1 tw-text-center tw-text-5xl">
          Gelbooru
        </h1>
      </a>
      <ClientOnly>
        <v-fade-transition leave-absolute>
          <div
            v-if="firstLoad"
            class="tw-grid tw-aspect-[68/150] tw-h-auto tw-w-[10vw] tw-max-w-[60px] tw-grid-cols-1 tw-items-center tw-justify-center md:tw-w-[12vw]"
          >
            <v-progress-circular
              indeterminate
              color="secondary"
              class=""
            />
          </div>
          <div
            v-else-if="postCount"
            class="tw-mx-auto tw-flex tw-flex-row"
          >
            <v-slide-y-reverse-transition
              group
              leave-absolute
            >
              <div
                v-for="(num, id) in postCount?.toString()"
                :key="`${num}-${id}`"
              >
                <img
                  :src="`/counter/${num}.gif`"
                  class="tw-h-auto  tw-w-[10vw] tw-max-w-[60px] tw-object-contain md:tw-w-[12vw]"
                >
              </div>
            </v-slide-y-reverse-transition>
          </div>
        </v-fade-transition>
      </ClientOnly>
    </div>
    <ClientOnly>
      <v-form @submit.prevent="submitSearch">
        <div class="tw-flex tw-flex-row tw-items-center tw-justify-center tw-gap-2 md:tw-gap-1">
          <GelbooruTagSelector
            v-model="tags"
            :disabled="!authStore.logged_in_computed"
            class="tw-w-full tw-max-w-3xl"
            :hint="!authStore.logged_in_computed ? 'Please login to use the search functions' : ''"
            :persistent-hint="!authStore.logged_in_computed"
            density="comfortable"
          />
          <v-btn
            color="primary"
            :size="$vuetify.display.mobile ? 'default' : 'large'"
            type="submit"
          >
            Search
          </v-btn>
        </div>
      </v-form>
    </ClientOnly>
    <div class="links-hero tw-mt-4 tw-flex tw-flex-row tw-flex-wrap tw-items-center tw-justify-center tw-gap-4">
      <a
        href="https://gelbooru.com/index.php?page=comment&s=list"
        target="_blank"
      >
        Comments
      </a>
      <a
        href="https://gelbooru.com/index.php?page=forum&s=list"
        target="_blank"
      >
        Forum
      </a>
      <a
        href="https://gelbooru.com/index.php?page=wiki&s=list"
        target="_blank"
      >
        Wiki
      </a>
      <a
        href="https://gelbooru.com/index.php?page=account&s=home"
        target="_blank"
      >
        My account
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'


useHead({
  title: 'Search'
})

const authStore = useAuthStore()

const firstLoad = ref(true)
const postCount = ref(0)

function getData() {
  $fetch('/api/post/count')
  .then((res) => {
    postCount.value = res
    firstLoad.value = false
  })
}

getData()

const autoRefreshCount = setInterval(() => {
  getData()
}, 60 * 1000)

onUnmounted(() => {
  clearInterval(autoRefreshCount)
})

const tags = ref<string[]>([])
const router = useRouter()

function submitSearch() {

  const auxTags = tags.value.concat('sort:score')

  router.push({
    path: 'search-results',
    query: {
      tags: `${auxTags.join(',')}`
    }
  })
}

</script>

<style scoped>

.links-hero > a {
  @apply tw-text-primary hover:tw-text-accent tw-transition-colors visited:tw-text-primary tw-no-underline;
}

.hero-gelbooru{
  @apply tw-isolate;
}

.hero-gelbooru::before{
  @apply tw-absolute tw-bg-gradient-to-b tw-from-primary tw-to-blue-950  tw-top-2/3 tw-h-16 -tw-z-10 tw-w-screen -tw-translate-y-1/2;
  content: "";
}

</style>