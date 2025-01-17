<template>
  <QChip v-bind="props">
      <div class=" tag-chip tw-line-clamp-2">
      {{ label }}
      </div>
  </QChip>
</template>

<script setup lang="ts">
import type { QChipProps } from 'quasar'
import type { GelbooruTag } from '~/types/gelbooru'
import { Utils } from '~/types/utils'


interface GelbooruTagChipProps extends Omit<QChipProps, 'modelValue' | 'label'> {
  simpleTag: string,
  fullTag?: GelbooruTag,
  artistTags?: GelbooruTag[]
}

const props = defineProps<GelbooruTagChipProps>()

const label = computed(() => `${props.simpleTag.replaceAll('_', ' ')}${props.fullTag ? ` - ${Utils.numberFormatter.format(props.fullTag.count)}` : ''}`)

</script>

<style scoped>

.tag-chip {
  white-space: pre-line !important;
}

:deep(.q-chip) {
  @apply tw-h-auto tw-rounded-full tw-px-3 tw-py-0.5;
}

</style>