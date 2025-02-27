<template>
  <NuxtLink
    :to=" props.favoritesMode
      ? `/favorites?tags=${props.simpleTag},sort:score`
      : `/search-results?tags=${props.simpleTag},sort:score`
    "
  >
    <QChip v-bind="props">
      <span class="tw-line-clamp-1 tw-truncate tw-capitalize">
        {{ simpleTag.replaceAll('_', ' ') }}
      </span>
      <GelbooruSimpleContextMenu :favorites-mode="props.favoritesMode" :simple-tag="props.simpleTag" />
    </QChip>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * Tag chip that only requires a string
 */
import type { QChipProps } from 'quasar'


interface GelbooruRatingChipProps extends Omit<QChipProps, 'modelValue' | 'dark' | 'label'> {
  simpleTag: string,
  favoritesMode?: boolean,
}

const props = defineProps<GelbooruRatingChipProps>()

</script>

<style scoped>

.tag-chip {
  @apply tw-whitespace-pre-line
}

:deep(.q-chip) {
  @apply tw-h-auto tw-rounded-full tw-px-2 tw-py-0.5;
}

</style>