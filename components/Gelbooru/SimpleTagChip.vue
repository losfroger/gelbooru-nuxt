<template>
  <QChip v-bind="props">
      <span class="tw-line-clamp-1 tw-truncate tw-capitalize">
      {{ simpleTag.replaceAll('_', ' ') }}
    </span>
  </QChip>
</template>

<script setup lang="ts">
import type { QChipProps } from 'quasar'


interface GelbooruRatingChipProps extends Omit<QChipProps, 'modelValue' | 'dark' | 'label'> {
  simpleTag: string
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