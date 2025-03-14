<template>
  <NuxtLink
    :to="url"
  >
    <QChip v-bind="props">
      <span class="tw-line-clamp-1 tw-truncate tw-capitalize">
        {{ simpleTag.replaceAll('_', ' ') }}
      </span>
      <GelbooruTagSimpleContextMenu
        :favorites-mode="props.favoritesMode"
        :simple-tag="props.simpleTag"
        :disable-add-to-current-search="props.disableAddToCurrentSearch"
      />
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
  disableAddToCurrentSearch?: boolean,
}

const props = defineProps<GelbooruRatingChipProps>()

const url = computed(() => props.favoritesMode
  ? `/favorites?tags=${encodeURIComponent(props.simpleTag)},sort:score`
  : `/search-results?tags=${encodeURIComponent(props.simpleTag)},sort:score`
)

</script>

<style scoped>

.tag-chip {
  @apply tw-whitespace-pre-line
}

:deep(.q-chip) {
  @apply tw-h-auto tw-rounded-full tw-px-2 tw-py-0.5;
}

</style>