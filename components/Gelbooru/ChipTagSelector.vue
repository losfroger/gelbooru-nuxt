<template>
  <v-chip
    v-bind="$attrs"
    :color="colorTag"
  />
</template>

<script setup lang="ts">
import { FuzzyQueryRegex, NegativeQueryRegex } from '~/types/gelbooru'

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

const colorTag = computed(() => {
  console.log('Computed', props.text)

  // Is negative
  if (NegativeQueryRegex.test(props.text)) {
    console.log('Negative', props.text)
    return 'red'
  }
  // Is fuzzy
  else if (FuzzyQueryRegex.test(props.text)) {
    console.log('Fuzzy', props.text)
    return 'indigo'
  }
  //Wild card
  else if (props.text.includes('*')) {
    console.log('Wildcard', props.text)
    return 'yellow'
  }
})


</script>

<style scoped>

</style>