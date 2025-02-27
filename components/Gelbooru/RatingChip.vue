<template>
  <NuxtLink
    :to="
      props.favoritesMode
        ?`/favorites?page=1&tags=rating:${props.rating.toLowerCase()},sort:score`
        :`/search-results?tags=rating:${props.rating.toLowerCase()},sort:score`
    "
  >
    <QChip v-bind="props" :color="color">
      <span class="tw-capitalize">
        {{ props.rating.toLocaleLowerCase() }}
      </span>
      <GelbooruSimpleContextMenu
        :simple-tag="`rating:${props.rating.toLowerCase()}`"
        :favorites-mode="props.favoritesMode"
      />
    </QChip>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * Chip that changes color based on the rating
 */
import type { NamedColor, QChipProps } from 'quasar'


interface GelbooruRatingChipProps extends Omit<QChipProps, 'modelValue' | 'dark' | 'color' | 'label'> {
  rating: 'safe' | 'Safe' | 'general' | 'General' | 'questionable' | 'sensitive' | 'Questionable' | 'explicit' | 'Explicit',
  favoritesMode?: boolean,
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