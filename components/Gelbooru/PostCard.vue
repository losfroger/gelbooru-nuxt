<template>
  <QCard class="tw-grid tw-grid-cols-[1fr_1fr] md:tw-flex md:tw-flex-col" flat>
    <NuxtLink :to="`/post/${props.post.id}`" class="tw-w-full">
      <div class="tw-relative tw-flex tw-h-full tw-w-full tw-max-w-full tw-flex-col tw-overflow-clip tw-shadow-md md:tw-aspect-square">
        <QImg
          :src="props.post.preview_url"
          fit="fill"
          :ratio="1"
          class="tw-absolute tw-m-auto tw-h-full tw-blur-2xl"
          loading="lazy"
        />
        <QImg
          :src="props.post.preview_url"
          fit="contain"
          :ratio="1"
          class="tw-m-auto tw-h-full"
          loading="lazy"
        />
        <div class="icon-shadow tw-absolute tw-left-0 tw-top-0 tw-flex tw-w-full tw-flex-row tw-flex-wrap tw-gap-0.5 tw-p-2 tw-text-lg md:tw-text-2xl">
          <QIcon
            v-if="isGifFile"
            color="accent"
            title="Video"
            name="mdi-file-gif-box"
          />
          <QIcon
            v-if="props.post.is_video"
            color="accent"
            title="Video"
            name="mdi-play-outline"
          />
          <QIcon
            v-if="props.post.is_sound"
            color="accent"
            title="Sound"
            name="mdi-volume-high"
          />
          <QIcon
            v-if="props.post.is_irl"
            color="accent"
            title="Photo medium"
            name="mdi-image-outline"
          />
          <QIcon
            v-if="props.post.is_3d"
            color="accent"
            title="3D"
            name="mdi-cube-outline"
          />

          <div class="tw-flex-1" />
          <template v-if="femaleIcon">
            <QIcon
              :name="femaleIcon.icon"
              color="secondary"
            />
            <QIcon
              v-if="femaleIcon.multiple"
              name="mdi-plus"
              color="secondary"
            />
          </template>
          <template v-if="maleIcon">
            <QIcon
              :name="maleIcon.icon"
              color="secondary"
            />
            <QIcon
              v-if="maleIcon.multiple"
              name="mdi-plus"
              color="secondary"
            />
          </template>
        </div>
      </div>
    </NuxtLink>
    <QCardSection class="tw-flex tw-flex-col tw-gap-1 tw-p-2 md:tw-p-4">
      <div class="tw-flex tw-flex-col tw-gap-1 md:tw-flex-row md:tw-items-center">
        <h2 class="tw-flex-1 tw-text-lg md:tw-text-xl">
          Score: <span :title="`${props.post.score}`">{{ formattedScore }}</span>
        </h2>
        <div class="tw-flex tw-flex-row tw-items-center tw-gap-1">
          <QIcon
            size="xs"
            :color="props.post.has_note_bool ? 'accent' : 'grey'"
            :title="props.post.has_note_bool ? 'Has notes' : ''"
            name="mdi-note-outline"
          />
          <QIcon
            size="xs"
            :color="props.post.has_comments_bool ? 'accent' : 'grey'"
            :title="props.post.has_comments_bool ? 'Has comments' : ''"
            name="mdi-comment-outline"
          />
          <QIcon
            size="xs"
            :color="props.post.has_children_bool ? 'accent' : 'grey'"
            :title="props.post.has_children_bool ? 'has_children' : ''"
            name="mdi-file-tree"
          />
        </div>
      </div>
      <div class="tw-flex tw-flex-col md:tw-flex-row">
        <GelbooruUserLink class="tw-max-w-36 tw-text-xs md:tw-text-sm" :user="{creator_id: props.post.creator_id, owner: props.post.owner}" />
        <ClientOnly>
          <TimeAgo
            class="tw-text-xs tw-font-extralight first-letter:tw-uppercase md:tw-ml-auto md:tw-text-sm"
            :date="new Date(props.post.created_at_utc)"
            locale="en"
          />
        </ClientOnly>
      </div>
      <QSeparator spaced class="tw-opacity-30" />
      <div class="tw-flex tw-flex-row tw-flex-wrap">
        <GelbooruRatingChip
          :rating="props.post.rating"
          outline
          size="sm"
          :dense="$q.screen.lt.md"
        />
        <GelbooruSimpleTagChip
          v-for="(tag, i) in props.post.tags_array.slice(0, 3)"
          :key="i"
          :simple-tag="tag"
          size="sm"
          color="secondary"
          outline
          :dense="$q.screen.lt.md"
        />
        <QChip
          v-if="props.post.tags_array.length > 3"
          size="sm"
          :label="`+${props.post.tags_array.length - 3} more`"
          color="grey"
          outline
          :dense="$q.screen.lt.md"
          clickable
          @click="showMoreTagsDialog = true"
        >
          <QTooltip :delay="800" max-width="300px">
            <p class="text-caption">
              Click for more
            </p>
          </QTooltip>
        </QChip>
        <QDialog v-model="showMoreTagsDialog">
          <QCard class="tw-isolate">
            <QCardSection class="tw-sticky tw-top-0 tw-z-10 tw-bg-neutral-900 tw-shadow-md">
              <h1 class="text-h5">
                Full tags
              </h1>
            </QCardSection>
            <QCardSection>
              <GelbooruSimpleTagChip
                v-for="(tag, i) in props.post.tags_array"
                :key="i"
                :simple-tag="tag"
                color="secondary"
                outline
              />
            </QCardSection>
          </QCard>
        </QDialog>
      </div>
    </QCardSection>
  </QCard>
</template>

<script setup lang="ts">
import type { GelbooruPost } from '~/types/gelbooru'
import { Utils } from '~/types/utils'

interface GelbooruPostCardProps {
  post: GelbooruPost
}

const props = defineProps<GelbooruPostCardProps>()

const formattedScore = computed(() => Utils.numberFormatter.format(props.post.score))

const sfwRatings = ['General', 'general', 'safe', 'Safe']
const isNsfw = computed(() => !sfwRatings.includes(props.post.rating))

const multipleFemaleTags = ['3girls', '4girls', '5girls', '6+girls', 'harem']
const femaleIcon = computed(() => {
  if (props.post.tags_array.includes('1girl') && props.post.tags_array.includes('1boy')) {
    return {
      icon: 'mdi-human-male-female',
      multiple: false,
    }
  }
  if (props.post.tags_array.includes('1girl')) {
    return {
      icon: 'mdi-human-female',
      multiple: false,
    }
  } else if (props.post.tags_array.includes('2girls')) {
    return {
      icon: 'mdi-human-female-female',
      multiple: false,
    }
  } else if (multipleFemaleTags.some(tag => props.post.tags_array.includes(tag))) {
    return {
      icon: 'mdi-human-female-female',
      multiple: true,
    }
  }

  return undefined
})

const multipleMaleTags = ['3boys', '4boys', '5boys', '6+boys', 'male_harem']
const maleIcon = computed(() => {
  if (props.post.tags_array.includes('1girl') && props.post.tags_array.includes('1boy')) {
    return undefined
  }
  if (props.post.tags_array.includes('1boy')) {
    return {
      icon: 'mdi-human-male',
      multiple: false,
    }
  } else if (props.post.tags_array.includes('2boys')) {
    return {
      icon: 'mdi-human-male-male',
      multiple: false,
    }
  } else if (multipleMaleTags.some(tag => props.post.tags_array.includes(tag))) {
    return {
      icon: 'mdi-human-male-male',
      multiple: true,
    }
  }

  return undefined
})

const isGifFile = computed(() => {
  return /.(gif)$/.test(props.post.file_url)
})

const showMoreTagsDialog = ref(false)
</script>

<style scoped>

.icon-shadow {
  text-shadow: 0px 2px 2px rgba(0,0,0,0.53);
}

</style>