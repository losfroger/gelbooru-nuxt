<template>
  <v-chip
    :color="color"
    v-bind="$attrs"
    :to="`/search-results?tags=rating:${encodeURIComponent(propsGelbooruRatingChip.rating)},sort:score`"
  >
    <span class="tw-capitalize">
      {{ propsGelbooruRatingChip.rating }}
    </span>
  </v-chip>
</template>

<script setup lang="ts">
const propsGelbooruRatingChip = defineProps({
  rating: {
    type: String,
    default: ''
  }
})

const color = computed(() => {
  switch (propsGelbooruRatingChip.rating) {
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
      return 'gray'
  }
})


</script>

<style scoped>

</style>