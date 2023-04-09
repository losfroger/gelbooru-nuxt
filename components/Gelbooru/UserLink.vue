<template>
  <a
    class="tw-flex tw-flex-row tw-items-center tw-text-white tw-no-underline tw-transition-colors visited:tw-text-white hover:tw-text-accent"
    :href="`https://gelbooru.com/index.php?page=account&s=profile&id=${propsUser.user.creator_id}`"
    target="_blank"
  >
    <v-icon
      icon="mdi-account"
      size="small"
      class="tw-mr-1"
    />
    {{ propsUser.user.owner }}
  </a>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

import { GelbooruUser } from '@/types/gelbooru'

const propsUser = defineProps({
  user: {
    type: Object as PropType<GelbooruUser>,
    default: (): GelbooruUser => ({
      creator_id: 0,
      owner: ''
    })
  }
})


</script>

<style scoped>

</style>