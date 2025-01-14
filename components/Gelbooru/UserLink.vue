<template>
  <a
    class="tw-flex tw-flex-row tw-items-center tw-text-white tw-no-underline tw-transition-colors visited:tw-text-white hover:tw-text-accent"
    :href="`https://gelbooru.com/index.php?page=account&s=profile&id=${props.user.creator_id}`"
    target="_blank"
  >
    <QIcon
      name="mdi-account"
      size="xs"
      class="tw-mr-1"
    />
    {{ props.user.owner }}
  </a>
</template>

<script setup lang="ts">
import type { GelbooruUser } from '~/types/gelbooru'

interface GelbooruUserLinkProps {
  user: GelbooruUser
}

const props = defineProps<GelbooruUserLinkProps>()

</script>

<style scoped>

</style>