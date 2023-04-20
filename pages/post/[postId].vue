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
      class="tw-grid tw-grid-cols-1 tw-gap-12 md:tw-grid-cols-[1fr_2fr_1fr] md:tw-gap-2 lg:tw-grid-cols-[1fr_3fr_1fr] lg:tw-gap-8"
    >
      <div>
        <div class="post-sidebar tw-grid tw-grid-cols-2 tw-gap-4 tw-rounded-md tw-bg-neutral-900 tw-p-4 tw-shadow-md">
          <div
            :class="{
              'md:tw-col-span-2 2xl:tw-col-span-1': true,
              'tw-col-span-2': !post?.source
            }"
          >
            <h5>Rating</h5>
            <GelbooruRatingChip :rating="post?.rating" />
          </div>
          <div class="md:tw-col-span-2 2xl:tw-col-span-1">
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
          </div>
          <div class="tw-col-span-2">
            <h5>Statistics</h5>
            <div class="tw-flex tw-flex-col tw-items-start">
              <div><GelbooruUserLink :user="{creator_id: post?.creator_id ?? 0, owner: post?.owner ?? ''}" /></div>
              <div>Id: {{ post?.id }}</div>
              <div>Posted: {{ post?.created_at_date?.toLocaleString() }}</div>
              <div>Size: {{ post?.width }}x{{ post?.height }}</div>
              <div>Score: {{ post?.score.toLocaleString() }}</div>
            </div>
            <v-btn
              color="primary"
              class="tw-mt-4"
              append-icon="mdi-open-in-new"
              :href="`https://gelbooru.com/index.php?page=post&s=view&id=${post?.id}`"
              target="_blank"
            >
              View on Gelbooru
            </v-btn>
          </div>
        </div>
      </div>
      <div class="tw-row-start-1 tw-overflow-clip md:tw-row-start-auto">
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
        <div
          v-else
          class="tw-flex tw-flex-col tw-items-center tw-gap-2"
        >
          <v-img
            max-height="88vh"
            width="100%"
            :lazy-src="post?.preview_url"
            :src="`/api/image/${post?.id}`"
            :class="{
              'tw-drop-shadow-xl tw-transition-all': true,
              'tw-blur-2xl hover:tw-blur-none': settingStore.settings.hideNsfwImages && isNsfw
            }"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="accent"
                  indeterminate
                />
              </div>
            </template>
          </v-img>
        </div>
      </div>
      <div>
        <div class="post-sidebar tw-rounded-md tw-bg-neutral-900 tw-p-4 tw-shadow-md">
          <div
            v-if="post?.fetched_tags"
            class="tw-grid tw-grid-cols-2 tw-gap-4 md:tw-grid-cols-1"
          >
            <div v-if="tagsByCategory && tagsByCategory.artist.length > 0">
              <h5>
                <v-icon
                  icon="mdi-brush"
                  start
                  class="tw-mb-1 tw-opacity-50"
                />
                Artist
              </h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.artist"
                  :key="tag.id"
                  :tag="tag.name"
                  color="red-darken-3"
                />
              </div>
            </div>
            <div v-if="tagsByCategory && tagsByCategory.character.length > 0">
              <h5>
                <v-icon
                  icon="mdi-account"
                  start
                  class="tw-mb-1 tw-opacity-50"
                />
                Character
              </h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.character"
                  :key="tag.id"
                  color="green"
                  :tag="tag.name"
                />
              </div>
            </div>
            <div v-if="tagsByCategory && tagsByCategory.copyright.length > 0">
              <h5>
                <v-icon
                  icon="mdi-copyright"
                  start
                  class="tw-mb-1 tw-opacity-50"
                />
                Copyright
              </h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.copyright"
                  :key="tag.id"
                  color="purple"
                  :tag="tag.name"
                />
              </div>
            </div>
            <div v-if="tagsByCategory && tagsByCategory.metadata.length > 0">
              <h5>
                <v-icon
                  icon="mdi-drawing"
                  start
                  class="tw-mb-1 tw-opacity-50"
                />
                Metadata
              </h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.metadata"
                  :key="tag.id"
                  color="yellow"
                  :tag="tag.name"
                />
              </div>
            </div>
            <div
              v-if="tagsByCategory && tagsByCategory.general.length > 0"
              class="tw-col-span-2 md:tw-col-span-1"
            >
              <h5>
                <v-icon
                  icon="mdi-tag"
                  start
                  class="tw-mb-1 tw-opacity-50"
                />
                Tag
              </h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.general"
                  :key="tag.id"
                  :tag="tag.name"
                />
              </div>
            </div>
            <div
              v-if="tagsByCategory && tagsByCategory.deprecated.length > 0"
              class="tw-col-span-2 md:tw-col-span-1"
            >
              <h5>Deprecated</h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.deprecated"
                  :key="tag.id"
                  :tag="tag.name"
                  color="grey"
                  class="tw-line-through"
                />
              </div>
            </div>
          </div>
          <div v-else>
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
  </div>
</template>

<script setup lang="ts">
import { GelbooruPostWithTags, GelbooruTag } from '~/types/gelbooru'
import { useSettingsStore } from '~/stores/settingsStore'

const route = useRoute()
const settingStore = useSettingsStore()

definePageMeta({
  middleware: 'auth-middleware'
})

useHead({
  title: 'Post Details'
})

const { data: post, error  } = await useFetch<GelbooruPostWithTags>(`/api/post/${route.params.postId}`, {
  parseResponse: (res) => {
    const aux: GelbooruPostWithTags = JSON.parse(res)
    if (aux.created_at_date) {
      aux.created_at_date = new Date(aux.created_at_date)
    }

    return aux
  }
})

const isVideoFile = computed(() => {
  return /.(mp4|mov|avi|mkv|flv)$/.test(post.value?.file_url ?? '')
})

const sfwRatings = ['General', 'general', 'safe', 'Safe']
const isNsfw = computed(() => !sfwRatings.includes(post.value?.rating ?? ''))

interface TagsByCategory {
  general: GelbooruTag[],
  artist: GelbooruTag[],
  copyright: GelbooruTag[],
  character: GelbooruTag[],
  metadata: GelbooruTag[],
  deprecated: GelbooruTag[],
  unknown: GelbooruTag[],
}

const tagsByCategory = computed(
  () => post.value?.fetched_tags?.reduce<TagsByCategory>(
    (accumulator: TagsByCategory, tag) => {
      switch (tag.type) {
      //general
        case 0:
          accumulator.general.push(tag)
          break
        //artist
        case 1:
          accumulator.artist.push(tag)
          break
        //copyright
        case 3:
          accumulator.copyright.push(tag)
          break
        //character
        case 4:
          accumulator.character.push(tag)
          break
        //metadata
        case 5:
          accumulator.metadata.push(tag)
          break
        //deprecated
        case 6:
          accumulator.deprecated.push(tag)
          break
        //not identified
        default:
          accumulator.unknown.push(tag)
          break
      }
      return accumulator
    },
  { artist: [], character: [], copyright: [], deprecated: [], general: [], metadata: [], unknown: []} as TagsByCategory,
  )
)

</script>

<style scoped>
li {
  @apply tw-list-none;
}
.post-sidebar h5 {
  @apply tw-w-full tw-mb-4;
}

.post-sidebar h5::after {
  @apply tw-bg-neutral-800 tw-rounded-full;
  content: "";
  float: left;
  width: 100%;
  height: 2px;
}
</style>