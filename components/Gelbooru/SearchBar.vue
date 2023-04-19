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

const emit = defineEmits<{
  (e: 'update:modelValue', newTags: string): void
}>()

const propsSearchBar = defineProps({
  /**
   * Comma separated tags
   */
  modelValue: {
    type: String,
    default: ''
  }
})

const tags = ref<string[]>([])

const sortByText = ref('')
const sortBy = ref('score')
const descending = ref(true)

// Parse tags at start, converting the tag string into the different types
parseTags()

// When the props change, parse tags again
watch(() => propsSearchBar.modelValue, (newValue, oldValue) => {
  console.log('Changed prop tags', newValue, oldValue)
  if (newValue !== oldValue) {
    parseTags()
  }
})

// Update modelvalue when changing tags or the sort by text
watch(() => [tags, sortByText], (newVal, oldVal) => {
  if (newVal == oldVal) {
    return
  }

  const auxSearch = [...tags.value]
  auxSearch.push(sortByText.value)

  emit('update:modelValue', auxSearch.join(','))
}, { deep: true })

// Tag parser
function parseTags() {
  if (!propsSearchBar.modelValue) {
    return
  }

  const auxTagsArray = propsSearchBar.modelValue.split(',')

  const auxTags: string[] = []
  auxTagsArray.forEach((tag) => {
    if (tag.includes('sort')) {
      const sortRegex = new RegExp(/(?<=sort:)(.*)/)

      sortBy.value = sortRegex.exec(tag)?.[0].replaceAll(':asc', '') ?? 'score'
      descending.value = !tag.includes('asc')
    } else {
      auxTags.push(tag)
    }
  })
  tags.value = auxTags
}

</script>

<style scoped>

</style>