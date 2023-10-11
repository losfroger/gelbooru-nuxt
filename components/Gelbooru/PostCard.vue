<template>
  <v-card class="tw-flex tw-w-full tw-flex-row md:tw-flex-col">
    <div class="tw-relative tw-aspect-square tw-w-full tw-overflow-clip tw-shadow-xl md:tw-max-w-[40vw]">
      <v-img
        class="tw-absolute tw-top-0 tw-aspect-square tw-h-full tw-w-full tw-object-cover tw-opacity-40 tw-blur-lg"
        :src="propsPostCard.post.preview_url"
        aria-hidden="true"
        cover
        loading="lazy"
      />
      <NuxtLink
        :to="`/post/${propsPostCard.post.id}`"
      >
        <v-img
          :src="propsPostCard.post.preview_url"
          :class="{
            'tw-absolute tw-top-0 tw-aspect-square tw-h-full tw-w-full tw-object-contain tw-shadow-sm tw-transition-all': true,
            'tw-blur-md hover:tw-blur-none': settingStore.settings.hideNsfwImages && isNsfw
          }"
          :alt="`Post image-${propsPostCard.post.id}-${propsPostCard.post.rating}-${propsPostCard.post.tags_array.slice(0, 5)}`"
          loading="lazy"
        />
      </NuxtLink>
      <div class="tw-absolute tw-right-0 tw-top-0 tw-flex tw-flex-row tw-flex-wrap tw-items-center tw-p-1 tw-drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        <div>
          <v-icon
            v-if="femaleIcon"
            :size="$vuetify.display.mdAndUp ? 'default' : 'small'"
            color="secondary"
            :icon="femaleIcon.icon"
          />
          <v-icon
            v-if="femaleIcon && femaleIcon.multiple"
            :size="$vuetify.display.mdAndUp ? 'small' : 'x-small'"
            color="secondary"
            icon="mdi-plus"
          />
        </div>
        <div>
          <v-icon
            v-if="maleIcon"
            :size="$vuetify.display.mdAndUp ? 'default' : 'small'"
            color="secondary"
            :icon="maleIcon.icon"
          />
          <v-icon
            v-if="maleIcon && maleIcon.multiple"
            :size="$vuetify.display.mdAndUp ? 'small' : 'x-small'"
            color="secondary"
            icon="mdi-plus"
          />
        </div>
      </div>
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
    <div class="tw-w-9/12 tw-px-4 tw-pb-4 md:tw-w-full">
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
          <GelbooruSimpleTagChip
            v-for="(tag, i) in propsPostCard.post.tags_array.slice(0, 3)"
            :key="i"
            :simple-tag="tag"
            size="x-small"
          />
          <v-chip
            v-if="propsPostCard.post.tags_array.length > 3"
            size="x-small"
          >
            +{{ propsPostCard.post.tags_array.length - 3 }} more
            <v-tooltip
              activator="parent"
              location="bottom"
              open-delay="800"
              max-width="300"
            >
              <p class="text-caption">
                {{ propsPostCard.post.tags_array.slice(3).join(', ').replaceAll('_', ' ') }}
              </p>
            </v-tooltip>
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
      is_animated: false,
      is_irl: false,
      is_sound: false,
    })
  }
})

const sfwRatings = ['General', 'general', 'safe', 'Safe']
const isNsfw = computed(() => !sfwRatings.includes(propsPostCard.post.rating))

const multipleFemaleTags = ['3girls', '4girls', '5girls', '6+girls', 'harem']
const femaleIcon = computed(() => {
  if (propsPostCard.post.tags_array.includes('1girl') && propsPostCard.post.tags_array.includes('1boy')) {
    return {
      icon: 'mdi-human-male-female',
      multiple: false
    }
  }
  if (propsPostCard.post.tags_array.includes('1girl')) {
    return {
      icon: 'mdi-human-female',
      multiple: false
    }
  } else if (propsPostCard.post.tags_array.includes('2girls')) {
    return {
      icon: 'mdi-human-female-female',
      multiple: false
    }
  } else if (multipleFemaleTags.some(tag => propsPostCard.post.tags_array.includes(tag))) {
    return {
      icon: 'mdi-human-female-female',
      multiple: true
    }
  }

  return undefined
})

const multipleMaleTags = ['3boys', '4boys', '5boys', '6+boys', 'male_harem']
const maleIcon = computed(() => {
  if (propsPostCard.post.tags_array.includes('1girl') && propsPostCard.post.tags_array.includes('1boy')) {
    return undefined
  }
  if (propsPostCard.post.tags_array.includes('1boy')) {
    return {
      icon: 'mdi-human-male',
      multiple: false
    }
  } else if (propsPostCard.post.tags_array.includes('2boys')) {
    return {
      icon: 'mdi-human-male-male',
      multiple: false
    }
  } else if (multipleMaleTags.some(tag => propsPostCard.post.tags_array.includes(tag))) {
    return {
      icon: 'mdi-human-male-male',
      multiple: true
    }
  }

  return undefined
})

const isGifFile = computed(() => {
  return /.(gif)$/.test(propsPostCard.post.file_url)
})

</script>

<style scoped>
</style>