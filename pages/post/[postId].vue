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
    <div v-else-if="status == 'success'" class="tw-grid tw-grid-cols-[1fr_3fr_1fr] tw-gap-4">
      <div>
        <QCard flat>
          <QCardSection class="tw-flex tw-flex-col tw-gap-2">
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
          </QCardSection>
        </QCard>
      </div>
      <QImg
        :placeholder-src="post?.preview_url"
        :src="`/api/image/${post?.id}`"
        fit="contain"
        class="tw-max-h-[80vh]"
      />
      <div>
        <QCard flat>
          <QCardSection class="tw-flex tw-flex-row tw-flex-wrap tw-gap-2">
            <QChip
              v-for="tag in post?.tags_array"
              :key="tag"
              :label="tag"
              outline
              color="primary"
              class="tw-m-0"
            />
          </QCardSection>
        </QCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GelbooruPostWithTags } from '~/types/gelbooru'


const route = useRoute()
const postId = route.params.postId

const { data: post, status, error  } = await useFetch<GelbooruPostWithTags>(`/api/post/${postId}`)

</script>

<style scoped>

</style>