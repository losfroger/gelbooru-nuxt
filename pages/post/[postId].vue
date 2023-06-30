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
        <div class="post-sidebar tw-flex tw-flex-wrap tw-gap-4 tw-rounded-md tw-bg-neutral-900 tw-p-4 tw-shadow-md">
          <div class="dynamic-category-split">
            <h5>Rating</h5>
            <GelbooruRatingChip :rating="post?.rating" />
          </div>
          <div
            v-if="post?.source"
            class="dynamic-category-split"
          >
            <h5>
              Source
            </h5>
            <ul>
              <li
                v-for="(src, i) in post.source_array"
                :key="i"
                class="my-1"
              >
                <GelbooruSourceLink
                  size="small"
                  :source="src"
                />
              </li>
            </ul>
          </div>
          <div class="tw-flex tw-w-full tw-flex-col">
            <h5>Statistics</h5>
            <div class="tw-flex tw-flex-col tw-items-start">
              <div><GelbooruUserLink :user="{creator_id: post?.creator_id ?? 0, owner: post?.owner ?? ''}" /></div>
              <div>Id: {{ post?.id }}</div>
              <div>Posted: {{ post?.created_at_date?.toLocaleString() }}</div>
              <div>Size: {{ post?.width }}x{{ post?.height }}</div>
              <div>Score: {{ post?.score.toLocaleString() }}</div>
            </div>
            <div class="tw-my-4 tw-flex tw-flex-col tw-gap-2">
              <v-btn
                color="primary"
                variant="tonal"
                append-icon="mdi-open-in-new"
                :href="`https://gelbooru.com/index.php?page=post&s=view&id=${post?.id}`"
                target="_blank"
              >
                View on Gelbooru
              </v-btn>
              <v-btn
                v-if="!isVideoFile"
                color="secondary"
                variant="tonal"
                append-icon="mdi-image-outline"
                :href="post?.file_url ? `/api/image/full/${post?.id}` : `/api/image/${post?.id}`"
                target="_blank"
              >
                View full image
              </v-btn>
            </div>
            <div class="icons-wrapper tw-mt-4 tw-flex tw-w-full tw-grow tw-flex-row tw-flex-wrap tw-justify-center tw-gap-2 md:tw-justify-evenly ">
              <v-icon
                size="18"
                :color="post?.has_note_bool ? 'accent' : 'grey-darken-1'"
                :title="post?.has_note_bool ? 'Has notes' : ''"
                icon="mdi-note-outline"
              />
              <v-icon
                size="18"
                :color="post?.has_comments_bool ? 'accent' : 'grey-darken-1'"
                :title="post?.has_comments_bool ? 'Has comments' : ''"
                icon="mdi-comment-outline"
              />

              <v-icon
                size="18"
                :color="post?.has_children_bool ? 'accent' : 'grey-darken-1'"
                :title="post?.has_children_bool ? 'has_children' : ''"
                icon="mdi-file-tree"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="tw-isolate tw-row-start-1 tw-flex tw-flex-col tw-overflow-clip md:tw-row-start-auto">
        <div v-if="isVideoFile">
          <a
            :href="post?.file_url"
            target="_blank"
            class="tw-block tw-h-min tw-w-full"
          >
            <v-img
              width="100%"
              :lazy-src="post?.preview_url"
              :src="post?.preview_url"
              :class="{
                'tw-aspect-video tw-h-full tw-max-h-[75vh] tw-drop-shadow-xl tw-transition-all md:tw-max-h-[85vh]': true,
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
          class="tw-flex tw-flex-col tw-items-center tw-gap-4"
        >
          <v-img
            width="100%"
            :lazy-src="post?.preview_url"
            :src="loadFullImage ? `/api/image/full/${post?.id}` : `/api/image/${post?.id}`"
            :class="{
              'tw-relative tw-drop-shadow-xl tw-transition-all': true,
              'tw-max-h-[70vh] md:tw-max-h-[80vh]': post?.has_comments_bool,
              'tw-max-h-[75vh] md:tw-max-h-[88vh]': !post?.has_comments_bool,
              'tw-blur-2xl hover:tw-blur-none': settingStore.settings.hideNsfwImages && isNsfw,
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
            <v-expand-transition>
              <v-btn
                v-if="post?.file_url && post?.sample_url && !loadFullImage"
                class="tw-absolute tw-bottom-2 tw-left-1/2 -tw-translate-x-1/2"
                prepend-icon="mdi-image-refresh-outline"
                color="secondary"
                size="small"
                @click="loadFullImage = true"
              >
                Load full image
              </v-btn>
            </v-expand-transition>
          </v-img>
        </div>

        <ClientOnly>
          <GelbooruPostComments
            v-if="post?.has_comments_bool"
            class="tw-z-10 tw-mx-auto tw-mt-3 tw-w-full tw-max-w-2xl"
            :post-id="$route.params.postId.toString()"
          />
        </ClientOnly>
      </div>
      <div>
        <div class="post-sidebar tw-rounded-md tw-bg-neutral-900 tw-p-4 tw-shadow-md">
          <div
            v-if="post?.fetched_tags"
            class="tags-wrapper tw-flex tw-flex-wrap tw-gap-4"
          >
            <div
              v-if="tagsByCategory && tagsByCategory.artist.length > 0"
              class="dynamic-category"
            >
              <h5>
                <v-icon
                  icon="mdi-brush-outline"
                  start
                  class="tw-mb-1 tw-opacity-50"
                />
                Artist
              </h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.artist"
                  :key="tag.id"
                  :simple-tag="tag.name"
                  :full-tag="tag"
                  color="red-darken-3"
                />
              </div>
            </div>
            <div
              v-if="tagsByCategory && tagsByCategory.character.length > 0"
              class="dynamic-category"
            >
              <h5>
                <v-icon
                  icon="mdi-account-outline"
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
                  :simple-tag="tag.name"
                  :full-tag="tag"
                />
              </div>
            </div>
            <div
              v-if="tagsByCategory && tagsByCategory.copyright.length > 0"
              class="dynamic-category"
            >
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
                  :simple-tag="tag.name"
                  :full-tag="tag"
                />
              </div>
            </div>
            <div
              v-if="tagsByCategory && tagsByCategory.metadata.length > 0"
              class="dynamic-category"
            >
              <h5>
                <v-icon
                  icon="mdi-shape-outline"
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
                  :simple-tag="tag.name"
                  :full-tag="tag"
                />
              </div>
            </div>
            <div
              v-if="tagsByCategory && tagsByCategory.general.length > 0"
              class="tw-col-span-2 tw-w-full md:tw-col-span-1"
            >
              <h5>
                <v-icon
                  icon="mdi-tag-outline"
                  start
                  class="tw-mb-1 tw-opacity-50"
                />
                Tag
              </h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.general"
                  :key="tag.id"
                  :simple-tag="tag.name"
                  :full-tag="tag"
                />
              </div>
            </div>
            <div
              v-if="tagsByCategory && tagsByCategory.deprecated.length > 0"
              class="tw-col-span-2 tw-w-full md:tw-col-span-1"
            >
              <h5>Deprecated</h5>
              <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-3 md:tw-gap-1">
                <GelbooruTagChip
                  v-for="tag in tagsByCategory.deprecated"
                  :key="tag.id"
                  :simple-tag="tag.name"
                  :full-tag="tag"
                  color="grey"
                  class="tw-line-through"
                />
              </div>
            </div>
          </div>
          <!--Fallback-->
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

const { data: post, error  } = await useFetch<GelbooruPostWithTags>(`/api/post/${route.params.postId}`, {
  parseResponse: (res) => {
    const aux: GelbooruPostWithTags = JSON.parse(res)
    if (aux.created_at_date) {
      aux.created_at_date = new Date(aux.created_at_date)
    }

    return aux
  }
})

const showComments = ref(false)

const isVideoFile = computed(() => {
  return /.(mp4|mov|avi|mkv|flv)$/.test(post.value?.file_url ?? '')
})

const sfwRatings = ['General', 'general', 'safe', 'Safe']
const isNsfw = computed(() => !sfwRatings.includes(post.value?.rating ?? ''))

const loadFullImage = ref(false)

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

useHead({
  title: () => {
    const aux = ['Post details']

    if (tagsByCategory.value?.artist && tagsByCategory.value?.artist.length > 0) {
      aux.push(
        tagsByCategory.value?.artist
          .map((tag) => tag.name)
          .join(', ')
      )
    }

    if (tagsByCategory.value?.character && tagsByCategory.value?.character.length > 0) {
      aux.push(
        tagsByCategory.value?.character
          .map((tag) => tag.name)
          .join(', ')
      )
    }

    if (tagsByCategory.value?.copyright && tagsByCategory.value?.copyright.length > 0) {
      aux.push(
        tagsByCategory.value?.copyright
          .map((tag) => tag.name)
          .join(', ')
      )
    }

    if (tagsByCategory.value?.general && tagsByCategory.value?.general.length > 0) {
      aux.push(
        tagsByCategory.value?.general
          .map((tag) => tag.name)
          .slice(0, 15)
          .join(', ')
      )
    }

    return aux.join(' | ')
  }
})


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

.dynamic-category-split {
  @apply tw-w-1/3 tw-flex-grow;
}

.dynamic-category {
  @apply tw-w-1/3 tw-flex-grow md:tw-w-full;
}

</style>