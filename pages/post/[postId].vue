<template>
  <div class="view-container tw-flex tw-flex-row tw-justify-center">
    <div v-if="error">
      <h1>
        Error {{ error.statusCode }}
      </h1>
      <h2>Error fetching the requested post</h2>
    </div>
    <div
      v-else
      class="tw-grid tw-grid-cols-1 tw-gap-12 md:tw-grid-cols-[1fr_3fr_1fr] md:tw-gap-8"
    >
      <div>
        <div class="post-sidebar tw-flex tw-flex-col tw-items-start tw-gap-1 tw-rounded-md tw-bg-neutral-900 tw-p-4 tw-shadow-md">
          <h5>Rating</h5>
          <GelbooruRatingChip :rating="post?.rating" />
          <h5 v-if="post?.source">
            Source
          </h5>
          <ul v-if="post?.source">
            <li
              v-for="(src, i) in post.source_array"
              :key="i"
            >
              <GelbooruSourceLink
                size="small"
                :source="src"
              />
            </li>
          </ul>
          <h5>Statistics</h5>
          <ul>
            <li><GelbooruUserLink :user="{creator_id: post?.creator_id ?? 0, owner: post?.owner ?? ''}" /></li>
            <li>Id: {{ post?.id }}</li>
            <li>Posted: {{ post?.created_at_date?.toLocaleString() }}</li>
            <li>Size: {{ post?.width }}x{{ post?.height }}</li>
            <li>Score: {{ post?.score.toLocaleString() }}</li>
          </ul>
          <v-btn
            class="tw-mt-4"
            color="primary"
            append-icon="mdi-open-in-new"
            :href="`https://gelbooru.com/index.php?page=post&s=view&id=${post?.id}`"
            target="_blank"
          >
            View on Gelbooru
          </v-btn>
        </div>
      </div>
      <div class="tw-overflow-clip">
        <div
          v-if="isVideoFile"
          class="tw-flex tw-h-full tw-w-full tw-flex-col tw-justify-start"
        >
          <a
            :href="post?.file_url"
            target="_blank"
            class="tw-block tw-h-min tw-w-full"
          >
            <v-img
              max-height="88vh"
              width="100%"
              height="100%"
              :lazy-src="post?.preview_url"
              :src="post?.preview_url"
              :class="{
                'tw-aspect-video tw-drop-shadow-xl tw-transition-all': true,
                'tw-blur-2xl hover:tw-blur-none': settingStore.settings.hideNsfwImages && isNsfw
              }"
            >
              <div class="tw-flex tw-h-full tw-flex-row tw-items-center tw-justify-center">
                <div class="tw-rounded-full tw-bg-black tw-bg-opacity-40 tw-p-4">
                  <v-icon
                    size="x-large"
                    icon="mdi-play"
                    color="white"
                  />
                </div>
              </div>
            </v-img>
          </a>
        </div>
        <v-img
          v-else
          max-height="88vh"
          width="100%"
          :lazy-src="post?.preview_url"
          :src="`/api/image/${post?.id}`"
          :class="{
            'tw-drop-shadow-xl tw-transition-all': true,
            'tw-blur-2xl hover:tw-blur-none': settingStore.settings.hideNsfwImages && isNsfw
          }"
        />
      </div>
      <div>
        <div class="post-sidebar tw-flex tw-flex-col tw-items-start tw-gap-1 tw-rounded-md tw-bg-neutral-900 tw-p-4 tw-shadow-md">
          <h5>Tags</h5>
          <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
            <GelbooruTagChip
              v-for="tag in post?.tags_array"
              :key="tag"
              :tag="tag"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GelbooruPost } from '~/types/gelbooru'
import { useSettingsStore } from '~/stores/settingsStore'

const route = useRoute()
const settingStore = useSettingsStore()

useHead({
  title: 'Details'
})

const { data: post, error  } = await useFetch<GelbooruPost>(`/api/post/${route.params.postId}`)

const isVideoFile = computed(() => {
  return /.(mp4|mov|avi|mkv|flv)$/.test(post.value?.file_url ?? '')
})

const sfwRatings = ['General', 'general', 'safe', 'Safe']
const isNsfw = computed(() => !sfwRatings.includes(post.value?.rating ?? ''))

</script>

<style scoped>
li {
  @apply tw-list-none;
}
.post-sidebar > h5 {
  @apply tw-w-full tw-mt-4 tw-mb-4;
}

.post-sidebar > h5::after {
  @apply tw-bg-neutral-800 tw-rounded-full;
  content: "";
  float: left;
  width: 100%;
  height: 2px;
}
</style>