<template>
  <div>
    <div v-if="status == 'error'">
      <h1 class="text-h5">
        There was an error:
      </h1>
      <p>
        {{ error?.message }}
      </p>
    </div>
    <div v-else-if="status == 'success' && post" class="tw-grid tw-grid-cols-[1fr_3fr_1fr] tw-gap-4">
      <div>
        <QCard flat class="post-info-card">
          <QCardSection class="tw-flex tw-flex-col tw-gap-3">
            <div class="tw-grid tw-grid-cols-1 tw-gap-2 md:tw-grid-cols-2">
              <div class="tw-flex tw-flex-col">
                <h1>
                  Rating
                </h1>
                <GelbooruRatingChip
                  :rating="post.rating"
                  outline
                  class="tw-my-auto tw-w-min"
                />
              </div>
              <div class="tw-flex tw-flex-col">
                <h1>
                  Source
                </h1>
                <QBtn
                  color="accent"
                  label="Original"
                  flat
                  dense
                  no-caps
                  icon="mdi-link"
                  class="tw-my-auto"
                  :href="post.source"
                  target="_blank"
                />
              </div>
            </div>
            <div class="tw-mb-1">
              <h1>
                Statistics
              </h1>
              <ul class="tw-flex tw-flex-col tw-gap-1">
                <li>
                  <GelbooruUserLink class="tw-w-min" :user="{creator_id: post?.creator_id ?? 0, owner: post?.owner ?? ''}" />
                </li>
                <li>
                  Id: {{ post.id }}
                </li>
                <li>
                  Posted: {{ new Date(post.created_at_utc).toLocaleString(undefined, dateFormat) }} - <TimeAgo
                    class="first-letter:tw-uppercase"
                    :date="new Date(post.created_at_utc)"
                    locale="en"
                  />
                </li>
                <li>
                  Size: {{ post.width }} x {{ post.height }}
                </li>
                <li>
                  Score: {{ post.score }}
                </li>
              </ul>
            </div>
            <QBtn
              label="View on Gelbooru"
              icon="mdi-open-in-new"
              color="primary"
              outline
              :href="`https://gelbooru.com/index.php?page=post&s=view&id=${post?.id}`"
              target="_blank"
            />
            <QBtn
              label="View full image"
              icon="mdi-image-outline"
              color="secondary"
              outline
              :href="post?.file_url ? `/api/image/full/${post?.id}` : `/api/image/${post?.id}`"
              target="_blank"
            />
            <div class="tw-mt-3 tw-grid tw-grid-cols-3 tw-items-center tw-justify-center">
              <div class="tw-flex tw-flex-row tw-justify-center">
                <QIcon
                  size="xs"
                  :color="post.has_note_bool ? 'accent' : 'grey'"
                  :title="post.has_note_bool ? 'Has notes' : ''"
                  name="mdi-note-outline"
                />
              </div>
              <div class="tw-flex tw-flex-row tw-justify-center">
                <QIcon
                  size="xs"
                  :color="post.has_comments_bool ? 'accent' : 'grey'"
                  :title="post.has_comments_bool ? 'Has comments' : ''"
                  name="mdi-comment-outline"
                />
              </div>
              <div class="tw-flex tw-flex-row tw-justify-center">
                <QIcon
                  size="xs"
                  :color="post.has_children_bool ? 'accent' : 'grey'"
                  :title="post.has_children_bool ? 'has_children' : ''"
                  name="mdi-file-tree"
                />
              </div>
            </div>
          </QCardSection>
        </QCard>
      </div>
      <div>
        <a
          v-if="isVideoFile"
          class="tw-relative"
          :href="post.file_url"
        >
          <QImg
            :src="post?.preview_url"
            fit="contain"
            class="tw-max-h-[80vh] tw-blur-sm"
          />
          <div class="absolute-center  tw-aspect-square tw-rounded-full tw-bg-neutral-950/40 tw-p-4 tw-text-white tw-backdrop-blur-sm">
            <QIcon name="mdi-play" size="xl" />
          </div>
        </a>
        <QImg
          v-else
          :placeholder-src="post?.preview_url"
          :src="`/api/image/${post?.id}`"
          fit="contain"
          class="tw-max-h-[80vh]"
        />
      </div>
      <div>
        <QCard flat class="post-info-card">
          <QCardSection class="tw-flex tw-flex-col">
            <template v-if="post?.fetched_tags && post?.fetched_tags?.length > 0">
              <template v-if="tagsByCategory?.artist.length ?? 0 > 0">
                <h1 class="tw-flex-1">
                  <QIcon name="mdi-brush-outline" left />
                  Artist
                </h1>
                <div class="tag-wrapper">
                  <GelbooruTagChip
                    v-for="tag in tagsByCategory?.artist"
                    :key="tag.id"
                    :simple-tag="tag.name"
                    :full-tag="tag"
                    outline
                    color="red"
                  />
                </div>
              </template>

              <template v-if="tagsByCategory?.character.length ?? 0 > 0">
                <h1 class="tw-flex-1">
                  <QIcon name="mdi-account-outline" left />
                  Character
                </h1>
                <div class="tag-wrapper">
                  <GelbooruTagChip
                    v-for="tag in tagsByCategory?.character"
                    :key="tag.id"
                    :simple-tag="tag.name"
                    :full-tag="tag"
                    :artist-tags="tagsByCategory?.artist"
                    outline
                    color="green"
                  />
                </div>
              </template>

              <template v-if="tagsByCategory?.copyright.length ?? 0 > 0">
                <h1 class="tw-flex-1">
                  <QIcon name="mdi-copyright" left />
                  Copyright
                </h1>
                <div class="tag-wrapper">
                  <GelbooruTagChip
                    v-for="tag in tagsByCategory?.copyright"
                    :key="tag.id"
                    :simple-tag="tag.name"
                    :full-tag="tag"
                    :artist-tags="tagsByCategory?.artist"
                    outline
                    color="purple"
                  />
                </div>
              </template>

              <template v-if="tagsByCategory?.metadata.length ?? 0 > 0">
                <h1 class="tw-flex-1">
                  <QIcon name="mdi-shape-outline" left />
                  Metadata
                </h1>
                <div class="tag-wrapper">
                  <GelbooruTagChip
                    v-for="tag in tagsByCategory?.metadata"
                    :key="tag.id"
                    :simple-tag="tag.name"
                    :full-tag="tag"
                    :artist-tags="tagsByCategory?.artist"
                    outline
                    color="yellow"
                  />
                </div>
              </template>

              <template v-if="tagsByCategory?.general.length ?? 0 > 0">
                <h1 class="tw-flex-1">
                  <QIcon name="mdi-tag-outline" left />
                  Tag
                </h1>
                <div class="tag-wrapper">
                  <GelbooruTagChip
                    v-for="tag in tagsByCategory?.general"
                    :key="tag.id"
                    :simple-tag="tag.name"
                    :full-tag="tag"
                    :artist-tags="tagsByCategory?.artist"
                    outline
                    color="secondary"
                  />
                </div>
              </template>

              <template v-if="tagsByCategory?.deprecated.length ?? 0 > 0">
                <h1 class="tw-flex-1">
                  <QIcon name="mdi-tag-outline" left />
                  Deprecated
                </h1>
                <div class="tag-wrapper">
                  <GelbooruTagChip
                    v-for="tag in tagsByCategory?.deprecated"
                    :key="tag.id"
                    :simple-tag="tag.name"
                    :full-tag="tag"
                    :artist-tags="tagsByCategory?.artist"
                    outline
                    color="grey"
                  />
                </div>
              </template>
            </template>
            <template v-else>
                <GelbooruSimpleTagChip
                v-for="tag in post?.tags_array"
                :key="tag"
                  :simple-tag="tag"
                outline
                color="primary"
                class="tw-m-0"
              />
            </template>
            <p class="text-body-2 tw-mt-6 tw-text-center tw-opacity-40">
              {{ post?.tags_array.length }} tags
            </p>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GelbooruPostWithTags, GelbooruTag } from '~/types/gelbooru'


const route = useRoute()
const postId = route.params.postId

const { data: post, status, error  } = await useFetch<GelbooruPostWithTags>(`/api/post/${postId}`)

const dateFormat: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
}

const isVideoFile = computed(() => {
  return /.(mp4|mov|avi|mkv|flv)$/.test(post.value?.file_url ?? '')
})

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
  { artist: [], character: [], copyright: [], deprecated: [], general: [], metadata: [], unknown: []} as TagsByCategory
  )
)

</script>

<style scoped>

.post-info-card {
  @apply tw-flex tw-flex-col tw-gap-3;
  h1 {
    @apply tw-text-base tw-font-semibold tw-pb-0.5 tw-border-b-2 tw-border-neutral-50/10 tw-mb-2;
  }
}

.tag-wrapper {
  @apply tw-flex tw-flex-row tw-flex-wrap tw-mb-3
}

</style>