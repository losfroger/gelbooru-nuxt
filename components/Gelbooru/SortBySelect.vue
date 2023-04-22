<template>
  <div class="tw-flex tw-flex-col-reverse md:tw-flex-col">
    <v-expand-transition>
      <v-text-field
        v-if="sortBy == 'random'"
        v-model="randomSeed"
        type="text"
        pattern="\d*"
        label="Random seed (optional)"
        placeholder="0-10000"
        hide-details
        variant="underlined"
        @input="() => {
          // Only allow numbers between 0 - 10000
          randomSeed = randomSeed.replace(/[^0-9.]/g, '')
          randomSeed = randomSeed.replace(/(\..*)\./g, '$1')
          randomSeed = Math.min(10000, parseInt(randomSeed)).toString()
          randomSeed = Math.max(0, parseInt(randomSeed)).toString()
        }"
        @blur="updateRandomSeed"
      />
    </v-expand-transition>
    <div class="tw-flex tw-flex-row tw-items-center">
      <v-select
        v-model="sortBy"
        :items="items"
        label="Sort by"
        color="primary"
        :error-messages="error"
        hide-details
      />
      <v-btn
        variant="text"
        :class="{'tw-rotate-180': !descending}"
        icon="mdi-arrow-down"
        :disabled="(sortBy == 'random')"
        @click="descending = !descending"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  (e: 'update:modelValue', newGelbooruText: string): void,
}>()

const propsSortBy = defineProps({
  modelValue: {
    type: String,
    default: 'sort:score',
    required: true,
  },
})

const items = ref([
  {title: 'Id', value: 'id'},
  {title: 'Score', value: 'score'},
  {title: 'Updated', value: 'updated'},
  {title: 'Random', value: 'random'},
  {title: 'Rating', value: 'rating'},
  {title: 'User', value: 'user'},
  {title: 'Height', value: 'height'},
  {title: 'Width', value: 'width'},
  {title: 'Parent', value: 'parent'},
  {title: 'Source', value: 'source'},
])

const sortBy = ref('score')
const descending = ref(true)
const randomSeed = ref('')

const error = ref('')

parseTagString()

watch(() => propsSortBy.modelValue, (newVal, oldVal) => {
  if (newVal == oldVal) {
    return
  }

  parseTagString()
})

watch(() => [sortBy.value, descending.value], (newVal, oldVal) => {
  if (newVal == oldVal) {
    return
  }

  console.log('changed props sortBy')
  emit('update:modelValue', calculateText())
})

const sortRegex = new RegExp(/(?<=sort:)(.*)/)

function parseTagString() {
  const auxSplitTags = propsSortBy.modelValue.split(':')

  console.log('Parsing tags', auxSplitTags)
  if (auxSplitTags.length < 2) {
    error.value = 'Incorrect sort value'
    return
  }

  if (auxSplitTags.some((a) => a == 'random')) {
    sortBy.value = 'random'
    randomSeed.value = auxSplitTags[2]
  } else {
    sortBy.value = auxSplitTags[1]
    descending.value = !auxSplitTags.some((a) => a == 'asc')

  }
}

function updateRandomSeed() {
  emit('update:modelValue', calculateText())
}

function calculateText() {
  if (sortBy.value == 'random') {
    return `sort:${sortBy.value}${randomSeed.value ? `:${randomSeed.value}` : ''}`
  }

  return `sort:${sortBy.value}${descending.value ? '' : ':asc' }`
}

emit('update:modelValue', calculateText())

</script>

<style scoped>

</style>