<template>
  <v-chip
    v-bind="$attrs"
    variant="tonal"
    color="secondary"
    class="tag-chip"
    :to="`/search-results?tags=${encodeURIComponent(propGelbooruTagChip.simpleTag)},sort:score`"
  >
    <span class="tw-py-1 tw-capitalize">
      {{ simpleTag.replaceAll('_', ' ') }}
    </span>
  </v-chip>
</template>

<script setup lang="ts">
const propGelbooruTagChip = defineProps({
  simpleTag: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.dark-tooltip {
  background-color: black;
  opacity: 1 !important;
}
.text {
  @apply tw-max-w-[120px] tw-overflow-hidden;
  overflow: hidden;
  display: -webkit-box;
  word-wrap: break-word;
  text-overflow: ellipsis;

  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;

  height: 1.3em; /* Fallback for non-webkit, line-height * 2 */
  line-height: 1.3em;
}
.tag-chip {
  white-space: pre-line !important;
  height: auto !important;

  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none !important;
}



</style>