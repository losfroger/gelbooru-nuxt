<template>
  <div v-auto-animate>
    <img
      :key="props.number"
      :src="`/counter/${props.number}.gif`"
      :alt="number"
      class="tw-h-auto tw-w-8 md:tw-w-14"
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

</style>