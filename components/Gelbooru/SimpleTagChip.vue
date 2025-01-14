<template>
  <QChip v-bind="props">
    <span class="tw-py-1 tw-capitalize">
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

</style>