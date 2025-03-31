<template>
  <QChip
    v-bind="props"
    :color="color"
  />
</template>

<script setup lang="ts">
/**
 * Tag for use inside the search bar, automatically changes color based on the label to
 * indicate different types of searches
 */
import type { NamedColor, QChipProps } from 'quasar'
import { Gelbooru } from '~/types/gelbooru'


interface GelbooruSearchBarChipTagProps extends Omit<QChipProps, 'label' | 'modelValue' | 'dark' | 'color' | 'onUpdate:modelValue'> {
  label: string,
  negativeTagColor?: NamedColor,
  fuzzyTagColor?: NamedColor,
  wildCardTagColor?: NamedColor,
  normalTagColor?: NamedColor,
}

const props = withDefaults(defineProps<GelbooruSearchBarChipTagProps>(), {
  negativeTagColor: 'red',
  fuzzyTagColor: 'indigo',
  wildCardTagColor: 'orange',
  normalTagColor: 'grey-10',
})

const color = computed(() => {
  // Is negative
  if (Gelbooru.NegativeQueryRegex.test(props.label)) {
    return props.negativeTagColor
  }
  // Is fuzzy
  else if (Gelbooru.FuzzyQueryRegex.test(props.label)) {
    return props.fuzzyTagColor
  }
  //Wild card
  else if (props.label.includes('*')) {
    return props.wildCardTagColor
  }
  // Normal color
  else {
    return props.normalTagColor
  }
})

</script>

<style scoped>

</style>