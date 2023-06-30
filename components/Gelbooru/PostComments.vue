<template>
  <div class="tw-flex tw-flex-col tw-gap-2 tw-rounded-md tw-bg-neutral-900 tw-p-4 tw-shadow-md">
    <div class="tw-flex tw-flex-row tw-items-center">
      <h4 class="tw-font-light">
        <v-expand-x-transition>
          <span v-if="!pending">
            {{ comments?.length }}
          </span>
        </v-expand-x-transition>
        <span v-if="!!error">
          {{ error?.statusMessage }}
        </span>
        <span v-else>
          Comment<span v-if="pending || moreThanOneComment">s</span>
        </span>
      </h4>
      <v-btn
        :class="{'tw-ml-auto tw-transition-all': true, 'tw-rotate-180': showComments}"
        icon="mdi-chevron-down"
        variant="text"
        size="small"
        :loading="pending"
        :disabled="!!error"
        @click="showComments = !showComments"
      />
    </div>
    <v-expand-transition>
      <div v-if="showComments">
        <div class="tw-flex tw-flex-col tw-gap-6">
          <v-divider />
          <GelbooruPostComment
            v-for="(comment, i) in comments"
            :key="i"
            :comment="comment"
          />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { GelbooruComment } from '~/types/gelbooru'


const propsComments = defineProps({
  postId: {
    type: String,
    required: true,
  }
})

const showComments = ref(false)
const {data: comments, pending, error} = useFetch<GelbooruComment[]>(`/api/comments/${propsComments.postId}`, {
  server: false,
})

const moreThanOneComment = computed(() => comments.value?.length && comments.value?.length > 1)

</script>

<style scoped>

</style>