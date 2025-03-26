<template>
  <div v-auto-animate>
    <img
      :key="props.number"
      :src="`/counter/${props.number}.gif`"
      :alt="number"
      class="cute-counter"
    >
  </div>
</template>

<script setup lang="ts">

interface CuteCounterProps {
  number: string
}

const props = defineProps<CuteCounterProps>()


</script>

<style scoped>
.cute-counter {
  @apply tw-h-auto tw-w-8 md:tw-w-14;
  image-rendering: pixelated;
}

</style>