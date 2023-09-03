<template>
  <div class="view-container tw-mb-0 tw-mt-3 tw-flex tw-flex-1 tw-flex-col tw-gap-2 md:tw-mt-[15vh] ">
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
      <div class="tw-relative">
        <v-fade-transition leave-absolute>
          <v-progress-circular
            v-if="pending"
            class="tw-absolute tw-left-1/2 tw-top-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2"
            indeterminate
            color="accent"
          />
        </v-fade-transition>
        <div class="tw-mx-auto tw-flex tw-flex-row md:tw-min-h-[132px]">
          <v-slide-y-reverse-transition
            group
            leave-absolute
          >
            <img
              v-for="(num, id) in postCount?.toString()"
              :key="`${num}-${id}`"
              :src="`/counter/${num}.gif`"
              :alt="num"
              class="tw-h-auto tw-w-8 tw-object-contain md:tw-w-14"
              preload
            >
          </v-slide-y-reverse-transition>
        </div>
      </div>
    </div>
    <v-form @submit.prevent="submitSearch">
      <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2 md:tw-flex-row md:tw-gap-1">
        <GelbooruTagSelector
          v-model="tags"
          :disabled="!authStore.logged_in_computed"
          class="tw-w-full tw-max-w-3xl"
          :hint="!authStore.logged_in_computed ? 'Please login to use the search functions' : ''"
          :persistent-hint="!authStore.logged_in_computed"
          density="comfortable"
          @keyup.enter.prevent="submitSearch"
        />
        <v-btn
          color="primary"
          :size="$vuetify.display.mobile ? 'default' : 'large'"
          :class="{'tw-mb-5': !authStore.logged_in_computed}"
          type="submit"
        >
          Search
        </v-btn>
      </div>
    </v-form>
    <div class="tw-mt-auto tw-flex tw-flex-col tw-gap-2 md:tw-mt-2 md:tw-flex-col-reverse">
      <GelbooruGoToPostId
        variant="text"
        class="tw-mx-auto"
      />
      <div class="links-hero tw-flex tw-flex-row tw-flex-wrap tw-items-center tw-justify-center tw-gap-4">
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
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'


useHead({
  title: 'Search'
})

const authStore = useAuthStore()

const {data: postCount, refresh, pending} = useFetch('/api/post/count')

const autoRefreshCount = setInterval(() => {
  refresh()
}, 30 * 1000)

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
  @apply tw-absolute tw-bg-gradient-to-b tw-from-primary tw-to-blue-950  tw-top-2/3 tw-h-8 md:tw-h-16 -tw-z-10 tw-w-screen -tw-translate-y-1/2;
  content: "";
}

</style>