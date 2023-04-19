<template>
  <div class="tw-flex tw-flex-row tw-items-center">
    <v-select
      :model-value="propsSortBy.sortBy"
      :items="items"
      label="Sort by"
      color="primary"
      hide-details
      @update:model-value="(e) => emit('update:sortBy', e)"
    />
    <v-btn
      variant="text"
      :class="{'tw-rotate-180': !propsSortBy.descending}"
      icon="mdi-arrow-down"
      @click="onButtonClick"
    />
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  (e: 'update:sortBy', newSortBy: string): void,
  (e: 'update:descending', newDescending: boolean): void,
  (e: 'update:modelValue', newGelbooruText: string): void,
}>()

const propsSortBy = defineProps({
  sortBy: {
    type: String,
    default: 'score'
  },
  descending: {
    type: Boolean,
    default: true
  }
})
const items = ref([
  {title: 'Id', value: 'id'},
  {title: 'Score', value: 'score'},
  {title: 'Rating', value: 'rating'},
  {title: 'User', value: 'user'},
  {title: 'Height', value: 'height'},
  {title: 'Width', value: 'width'},
  {title: 'Parent', value: 'parent'},
  {title: 'Source', value: 'source'},
  {title: 'Updated', value: 'updated'},
])

function onButtonClick() {
  emit('update:descending', !propsSortBy.descending)
}

watch(() => propsSortBy.descending, (newVal) => {
  console.log('changed props descending')
  emit('update:modelValue', calculateText())
})

watch(() => propsSortBy.sortBy, (newVal) => {
  console.log('changed props sortBy')
  emit('update:modelValue', calculateText())
})

function calculateText() {
  return `sort:${propsSortBy.sortBy}${propsSortBy.descending ? '' : ':asc' }`
}

emit('update:modelValue', calculateText())

</script>

<style scoped>

</style>