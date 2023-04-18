<template>
  <div class="search-bar tw-flex tw-flex-col tw-justify-center tw-gap-2 md:tw-flex-row md:tw-items-end">
    <GelbooruTagSelector
      v-model="tags"
      class="md:tw-w-9/12"
      hide-details
    />
    <GelbooruSortBySelect
      v-model="sortByText"
      v-model:sort-by="sortBy"
      v-model:descending="descending"
      class="tw-gap-2 md:tw-w-3/12"
    />
  </div>
</template>

<script setup lang="ts">

const tags = ref<string[]>([])

const sortByText = ref('')
const sortBy = ref('score')
const descending = ref(true)

watch(() => [tags, sortByText], () => {
  const auxSearch = [...tags.value]
  auxSearch.push(sortByText.value)

  console.log('Changed search!', auxSearch.join(' '))

}, { deep: true })


</script>

<style scoped>

</style>