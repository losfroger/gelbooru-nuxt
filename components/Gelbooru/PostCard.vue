<template>
  <QCard class="tw-flex tw-flex-col" flat>
    <NuxtLink :to="`/post/${props.post.id}`">
      <div class="tw-relative tw-flex tw-aspect-square tw-w-full tw-max-w-full tw-flex-col tw-overflow-clip tw-shadow-md">
        <QImg
          :src="props.post.preview_url"
          fit="fill"
          :ratio="1"
          class="tw-absolute tw-m-auto tw-blur-2xl"
        />
        <QImg
          :src="props.post.preview_url"
          fit="contain"
          :ratio="1"
          class="tw-m-auto tw-blur-md"
        />
        <div class="icon-shadow tw-absolute tw-left-0 tw-top-0 tw-flex tw-w-full tw-flex-row tw-flex-wrap tw-gap-0.5 tw-p-2">
          <QIcon
            v-if="isGifFile"
            size="sm"
            color="accent"
            title="Video"
            name="mdi-file-gif-box"
          />
          <QIcon
            v-if="props.post.is_video"
            size="sm"
            color="accent"
            title="Video"
            name="mdi-play-outline"
          />
          <QIcon
            v-if="props.post.is_sound"
            size="sm"
            color="accent"
            title="Sound"
            name="mdi-volume-high"
          />
          <QIcon
            v-if="props.post.is_irl"
            size="sm"
            color="accent"
            title="Photo medium"
            name="mdi-image-outline"
          />
          <QIcon
            v-if="props.post.is_3d"
            size="sm"
            color="accent"
            title="3D"
            name="mdi-cube-outline"
          />

          <div class="tw-flex-1" />
          <template v-if="femaleIcon">
            <QIcon
              :name="femaleIcon.icon"
              size="sm"
              color="secondary"
            />
            <QIcon
              v-if="femaleIcon.multiple"
              name="mdi-plus"
              size="sm"
              color="secondary"
            />
          </template>
          <template v-if="maleIcon">
            <QIcon
              :name="maleIcon.icon"
              size="sm"
              color="secondary"
            />
            <QIcon
              v-if="maleIcon.multiple"
              name="mdi-plus"
              size="sm"
              color="secondary"
            />
          </template>
        </div>
      </div>
    </NuxtLink>
    <QCardSection class="tw-flex tw-flex-col tw-gap-1">
      <div class="tw-flex tw-flex-row tw-items-center">
        <h2 class="text-h5 tw-flex-1">
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
      <GelbooruUserLink :user="{creator_id: props.post.creator_id, owner: props.post.owner}" />
      <QSeparator spaced class="tw-opacity-30" />
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

const formattedScore = computed(() => Utils.formatter.format(props.post.score))

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
</script>

<style scoped>

.icon-shadow {
  text-shadow: 0px 2px 2px rgba(0,0,0,0.53);
}

</style>