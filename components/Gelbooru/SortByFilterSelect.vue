<template>
  <div v-auto-animate class="tw-flex tw-flex-col tw-gap-2">
    <div class="tw-flex tw-flex-row tw-items-center tw-gap-4">
      <QSelect
        :model-value="auxSortBy"
        class="tw-flex-1"
        label="Sort by"
        filled
        emit-value
        map-options
        :error-message="error"
        :options="items"
        @update:model-value="(e: SortByOptions) => onUpdateModelValue(e, auxAscending, auxRandomSeed)"
      />
      <QBtn
        flat
        round
        :disable="auxSortBy == 'random'"
        @click="onUpdateModelValue(auxSortBy, !auxAscending, auxRandomSeed)"
      >
        <QIcon
          class="tw-transition-transform"
          :class="{'tw-rotate-180': auxAscending}"
          name="mdi-arrow-down"
        />
      </QBtn>
    </div>
    <div v-if="auxSortBy == 'random'">
      <QInput
        :model-value="auxRandomSeed"
        label="Random seed (optional)"
        type="number"
        placeholder="0-10000"
        @update:model-value="(e) => onUpdateModelValue(auxSortBy, auxAscending, parseInt(`${e}`))"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

interface GelbooruSortBySelectProps {
  modelValue: string,
}

const props = defineProps<GelbooruSortBySelectProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', newGelbooruText: string): void,
}>()


type SortByOptions = 'id' | 'score' | 'updated' | 'random' | 'rating' | 'user' | 'height' | 'width' | 'source'

const items = ref<{label: string, value: SortByOptions}[]>([
  {label: 'Id', value: 'id'},
  {label: 'Score', value: 'score'},
  {label: 'Updated', value: 'updated'},
  {label: 'Random', value: 'random'},
  {label: 'Rating', value: 'rating'},
  {label: 'User', value: 'user'},
  {label: 'Height', value: 'height'},
  {label: 'Width', value: 'width'},
  {label: 'Source', value: 'source'},
])

const auxSortBy = ref<SortByOptions>('score')
const auxAscending = ref(false)
const auxRandomSeed = ref<number | undefined>(undefined)

const error = ref('')

parseTagString(props.modelValue)
watch(() => props.modelValue, (newVal, oldVal) => {
  if (newVal == oldVal) {
    return
  }

  parseTagString(newVal)
})

function parseTagString(sortByTag: string) {
  const auxSplitTags = sortByTag.split(':')

  if (auxSplitTags.length < 2) {
    error.value = 'Incorrect sort value'
    return
  }

  if (auxSplitTags.some((a) => a == 'random')) {
    auxSortBy.value = 'random'
    auxRandomSeed.value = parseInt(auxSplitTags[2])
  } else {
    auxSortBy.value = (auxSplitTags[1] as SortByOptions)
    auxAscending.value = auxSplitTags.some((a) => a == 'asc')
  }
}

function onUpdateModelValue(sortBy: SortByOptions, ascending: boolean, randomSeed: number | undefined) {
  auxSortBy.value = sortBy
  auxAscending.value = ascending
  auxRandomSeed.value = randomSeed

  emit('update:modelValue', calculateText(sortBy, ascending, randomSeed))
}

function calculateText(sortBy: SortByOptions, ascending: boolean, randomSeed: number | undefined) {
  if (sortBy == 'random') {
    return `sort:${auxSortBy.value}${randomSeed ? `:${randomSeed}` : ''}`
  }
  return `sort:${auxSortBy.value}${ascending ? ':asc' : '' }`
}

</script>

<style scoped>

</style>