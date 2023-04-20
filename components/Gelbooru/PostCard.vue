<template>
  <v-card class="tw-flex tw-w-full tw-flex-row md:tw-flex-col">
    <div class="tw-relative tw-aspect-square tw-w-full tw-max-w-[40vw] tw-overflow-clip tw-shadow-xl">
      <v-img
        aspect-ratio="1"
        cover
        :src="propsPostCard.post.preview_url"
        class="tw-absolute tw-top-0 tw-h-full tw-w-full tw-opacity-40 tw-blur-lg"
        alt=""
      />
      <NuxtLink
        :to="`/post/${propsPostCard.post.id}`"
      >
        <ClientOnly>
          <v-img
            aspect-ratio="1"
            :src="propsPostCard.post.preview_url"
            :class="{
              'tw-absolute tw-top-0 tw-h-full tw-w-full tw-shadow-sm tw-transition-all': true,
              'tw-blur-md hover:tw-blur-none': settingStore.settings.hideNsfwImages && isNsfw
            }"
            alt=""
          />
        </ClientOnly>
      </NuxtLink>
      <div class="tw-absolute tw-top-0 tw-flex tw-flex-row tw-flex-wrap tw-p-1 tw-drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        <v-icon
          v-if="isGifFile"
          :size="$vuetify.display.mdAndUp ? 'default' : 'small'"
          color="accent"
          title="Video"
          icon="mdi-file-gif-box"
        />
        <v-icon
          v-if="propsPostCard.post.is_video"
          :size="$vuetify.display.mdAndUp ? 'default' : 'small'"
          color="accent"
          title="Video"
          icon="mdi-play-outline"
        />
        <v-icon
          v-if="propsPostCard.post.is_sound"
          :size="$vuetify.display.mdAndUp ? 'default' : 'small'"
          color="accent"
          title="Sound"
          icon="mdi-volume-high"
        />
        <v-icon
          v-if="propsPostCard.post.is_irl"
          :size="$vuetify.display.mdAndUp ? 'default' : 'small'"
          color="accent"
          title="Photo medium"
          icon="mdi-image-outline"
        />
        <v-icon
          v-if="propsPostCard.post.is_3d"
          :size="$vuetify.display.mdAndUp ? 'default' : 'small'"
          color="accent"
          title="3D"
          icon="mdi-cube-outline"
        />
      </div>
    </div>
    <div class="tw-w-full tw-px-4 tw-pb-4">
      <div class="tw-flex tw-flex-col tw-gap-1 tw-pt-1 md:tw-gap-0">
        <div class=" tw-flex tw-flex-col tw-flex-wrap tw-justify-center tw-gap-1 md:tw-flex-row md:tw-items-center md:tw-justify-start">
          <v-card-title class="= tw-p-0">
            Score: <span :title="propsPostCard.post.score.toLocaleString()">{{ formatter.format(propsPostCard.post.score) }}</span>
            <v-spacer class="tw-hidden" />
          </v-card-title>
          <v-spacer class="tw-hidden md:tw-block" />
          <div class="tw-flex tw-flex-row tw-gap-1">
            <v-icon
              size="18"
              :color="propsPostCard.post.has_note_bool ? 'accent' : 'grey-darken-1'"
              :title="propsPostCard.post.has_note_bool ? 'Has notes' : ''"
              icon="mdi-note-outline"
            />
            <v-icon
              size="18"
              :color="propsPostCard.post.has_comments_bool ? 'accent' : 'grey-darken-1'"
              :title="propsPostCard.post.has_comments_bool ? 'Has comments' : ''"
              icon="mdi-comment-outline"
            />

            <v-icon
              size="18"
              :color="propsPostCard.post.has_children_bool ? 'accent' : 'grey-darken-1'"
              :title="propsPostCard.post.has_children_bool ? 'has_children' : ''"
              icon="mdi-file-tree"
            />
          </div>
        </div>
        <h2 class="text-caption tw-mr-auto">
          <GelbooruUserLink :user="{creator_id: propsPostCard.post.creator_id, owner: propsPostCard.post.owner}" />
        </h2>
      </div>
      <v-divider class="tw-my-2" />
      <div class=" tw-my-auto">
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-1">
          <GelbooruRatingChip
            variant="tonal"
            size="x-small"
            class=""
            :rating="propsPostCard.post.rating"
          />
          <GelbooruTagChip
            v-for="(tag, i) in propsPostCard.post.tags_array.slice(0, 3)"
            :key="i"
            :tag="tag"
            size="x-small"
            disable-tooltip
          />
          <v-chip
            v-if="propsPostCard.post.tags_array.length > 3"
            size="x-small"
          >
            +{{ propsPostCard.post.tags_array.length - 3 }} more
          </v-chip>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { GelbooruPost } from '~/types/gelbooru'
import { useSettingsStore } from '~/stores/settingsStore'
import { computed } from 'vue'

const settingStore = useSettingsStore()

const formatter = Intl.NumberFormat('en', {notation: 'compact'})

const propsPostCard = defineProps({
  post: {
    type: Object as PropType<GelbooruPost>,
    default: (): GelbooruPost => ({
      id: 0,
      created_at: '',
      created_at_date: new Date(),
      score: 0,
      width: 0,
      height: 0,
      md5: '',
      directory: '',
      image: '',
      rating: '',
      source: '',
      source_array: [],
      change: 0,
      owner: '',
      creator_id: 0,
      parent_id: 0,
      sample: 0,
      preview_height: 0,
      preview_width: 0,
      tags: '',
      tags_array: [],
      title: '',
      has_notes: '',
      has_note_bool: false,
      has_comments: '',
      has_comments_bool: false,
      file_url: '',
      preview_url: '',
      sample_url: '',
      sample_height: 0,
      sample_width: 0,
      status: '',
      post_locked: 0,
      has_children: '',
      has_children_bool: false,
      is_3d: false,
      is_video: false,
      is_irl: false,
      is_sound: false,
    })
  }
})

const sfwRatings = ['General', 'general', 'safe', 'Safe']
const isNsfw = computed(() => !sfwRatings.includes(propsPostCard.post.rating))

const isGifFile = computed(() => {
  return /.(gif)$/.test(propsPostCard.post.file_url)
})

</script>

<style scoped>
</style>