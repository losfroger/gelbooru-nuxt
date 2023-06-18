<template>
  <div class="tw-flex tw-flex-col">
    <div class="tw-flex tw-flex-row tw-gap-3">
      <a :href="`https://gelbooru.com/index.php?page=account&s=profile&id=${comment.creator}`">
        <NuxtImg
          src="/icons/comment-user.png"
          width="45px"
          height="45px"
          fit="cover"
          class="tw-rounded-full tw-shadow-sm"
        />
      </a>
      <div class="tw-flex tw-flex-col">
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-text-sm">
          <GelbooruUserLink
            :user="{creator_id: comment.creator, owner: `# ${comment.creator}`}"
          />
          <v-icon
            class="tw-opacity-50"
            icon="mdi-circle-small"
          />
          <TimeAgo
            class="tw-opacity-50"
            :date="new Date(comment.created_at)"
          />
        </div>
        <p class="tw-whitespace-pre-wrap">
          {{ comment.body }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GelbooruComment } from '~/types/gelbooru'

const propsComment = defineProps({
  comment: {
    type: Object as PropType<GelbooruComment>,
    required: true,
  }
})

</script>

<style scoped>

</style>