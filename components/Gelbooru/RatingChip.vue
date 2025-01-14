<template>
  <QChip v-bind="props" :color="color">
    <span class="tw-capitalize">
      {{ props.rating.toLocaleLowerCase() }}
    </span>
  </QChip>
</template>

<script setup lang="ts">
import type { NamedColor, QChipProps } from 'quasar'


interface GelbooruRatingChipProps extends Omit<QChipProps, 'modelValue' | 'dark' | 'color' | 'label'> {
  rating: 'safe' | 'Safe' | 'general' | 'General' | 'questionable' | 'sensitive' | 'Questionable' | 'explicit' | 'Explicit'
}

const props = defineProps<GelbooruRatingChipProps>()

const color = computed((): NamedColor => {
  switch (props.rating) {
    case 'safe':
    case 'Safe':
    case 'general':
    case 'General':
      return 'green'

    case 'questionable':
    case 'sensitive':
    case 'Questionable':
      return 'amber'

    case 'explicit':
    case 'Explicit':
      return 'red'

    default:
      return 'grey'
  }
})

</script>

<style scoped>

</style>