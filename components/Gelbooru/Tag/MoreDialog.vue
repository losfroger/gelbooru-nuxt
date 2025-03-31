<template>
  <QDialog :model-value="props.modelValue" @update:model-value="(e) => emits('update:modelValue', e)">
    <QCard class="tw-isolate tw-w-full">
      <QCardSection class="tw-sticky tw-top-0 tw-z-10 tw-bg-neutral-900 tw-shadow-md">
        <h1 class="text-h5">
          Full tags
        </h1>
      </QCardSection>
      <QCardSection v-auto-animate class="tw-w-full">
        <div v-if="status == 'pending'" class="tw-flex tw-w-full tw-flex-col tw-py-12">
          <QCircularProgress
            indeterminate
            color="primary"
            class="tw-m-auto"
            size="lg"
            rounded
          />
        </div>
        <template v-else-if="status == 'success' && post?.fetched_tags && post?.fetched_tags?.length > 0">
          <GelbooruTagSimpleChip
            v-for="tag in tagsByCategory?.artist"
            :key="tag.id"
            :favorites-mode="props.favoritesMode"
            :simple-tag="tag.name"
            :full-tag="tag"
            outline
            color="red"
            icon="mdi-brush-outline"
          />
          <GelbooruTagSimpleChip
            v-for="tag in tagsByCategory?.character"
            :key="tag.id"
            :favorites-mode="props.favoritesMode"
            :simple-tag="tag.name"
            :full-tag="tag"
            :artist-tags="tagsByCategory?.artist"
            outline
            color="green"
            icon="mdi-account-outline"
          />
          <GelbooruTagSimpleChip
            v-for="tag in tagsByCategory?.copyright"
            :key="tag.id"
            :favorites-mode="props.favoritesMode"
            :simple-tag="tag.name"
            :full-tag="tag"
            :artist-tags="tagsByCategory?.artist"
            outline
            color="purple"
            icon="mdi-copyright"
          />
          <GelbooruTagSimpleChip
            v-for="tag in tagsByCategory?.metadata"
            :key="tag.id"
            :favorites-mode="props.favoritesMode"
            :simple-tag="tag.name"
            :full-tag="tag"
            :artist-tags="tagsByCategory?.artist"
            outline
            color="yellow"
            icon="mdi-shape-outline"
          />
          <GelbooruTagSimpleChip
            v-for="tag in tagsByCategory?.general"
            :key="tag.id"
            :favorites-mode="props.favoritesMode"
            :simple-tag="tag.name"
            :full-tag="tag"
            :artist-tags="tagsByCategory?.artist"
            outline
            color="secondary"
          />
          <GelbooruTagSimpleChip
            v-for="tag in tagsByCategory?.deprecated"
            :key="tag.id"
            :favorites-mode="props.favoritesMode"
            :simple-tag="tag.name"
            :full-tag="tag"
            :artist-tags="tagsByCategory?.artist"
            outline
            color="grey"
          />
        </template>
        <template v-else>
          <GelbooruTagSimpleChip
            v-for="(tag, i) in props.simpleTags"
            :key="i"
            :favorites-mode="props.favoritesMode"
            :simple-tag="tag"
            color="secondary"
            outline
          />
        </template>
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script setup lang="ts">
import { Gelbooru } from '~/types/gelbooru'


interface GelbooruMoreTagsDialogProps {
  postId: number,
  simpleTags: string[],
  modelValue: boolean,
  favoritesMode: boolean,
}

const props = defineProps<GelbooruMoreTagsDialogProps>()

const emits = defineEmits<{
  'update:modelValue': [newVal: boolean],
}>()

watch(() => props.postId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    clear()
    loaded.value = false
  }
})

watch(() => props.modelValue, (newVal) => {
  console.log('Changed modelvalue', newVal)
  if (newVal) {
    loadPostdata()
  }
})

const loaded = ref(false)
const { data: post, status, clear, execute  } = await useFetch<Gelbooru.PostWithTags>(`/api/post/${props.postId}`, {
  immediate: false,
  onResponse: () => {
    loaded.value = true
  },
})

function loadPostdata() {
  try {
    if (status.value == 'pending' || loaded.value) {
      return
    }
    execute()
  } catch (error) {
    console.error(error)
  }
}

interface TagsByCategory {
  general: Gelbooru.Tag[],
  artist: Gelbooru.Tag[],
  copyright: Gelbooru.Tag[],
  character: Gelbooru.Tag[],
  metadata: Gelbooru.Tag[],
  deprecated: Gelbooru.Tag[],
  unknown: Gelbooru.Tag[],
}

const tagsByCategory = computed(
  () => post.value?.fetched_tags?.reduce<TagsByCategory>(
    (accumulator: TagsByCategory, tag) => {
      switch (tag.type) {
        //general
        case Gelbooru.TagTypes.GENERAL:
          accumulator.general.push(tag)
          break
        //artist
        case Gelbooru.TagTypes.ARTIST:
          accumulator.artist.push(tag)
          break
        //copyright
        case Gelbooru.TagTypes.COPYRIGHT:
          accumulator.copyright.push(tag)
          break
        //character
        case Gelbooru.TagTypes.CHARACTER:
          accumulator.character.push(tag)
          break
        //metadata
        case Gelbooru.TagTypes.METADATA:
          accumulator.metadata.push(tag)
          break
        //deprecated
        case Gelbooru.TagTypes.DEPRECATED:
          accumulator.deprecated.push(tag)
          break
        //not identified
        default:
          accumulator.unknown.push(tag)
          break
      }
      return accumulator
    },
  { artist: [], character: [], copyright: [], deprecated: [], general: [], metadata: [], unknown: []} as TagsByCategory
  )
)


</script>

<style scoped>

</style>