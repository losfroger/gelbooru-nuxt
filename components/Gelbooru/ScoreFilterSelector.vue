<template>
  <div>
    <div>
      Post score:
    </div>
    <div class="tw-flex tw-flex-row tw-gap-2">
      <v-select
        v-model="selector"
        :items="selectItems"
        label="Range"
        color="primary"
        class="tw-w-1/3"
      />
      <v-text-field
        v-model="score"
        label="Score"
        color="primary"
        class="tw-w-2/3"
        type="number"
        pattern="\d*"
        clearable
        hint="If empty, posts won't be filtered by score"
        persistent-hint
        @input="() => {
          // Only allow positive integer numbers
          score = score.replace(/[^0-9.]/g, '')
          score = score.replace(/(\..*)\./g, '$1')
          score = isFinite(parseInt(score)) ? Math.max(1, parseInt(score)).toString() : ''
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  (e: 'update:modelValue', newScoreFilter: string): void,
}>()

const propsScoreFilter = defineProps({
  modelValue: {
    type: String,
    default: '',
    required: true,
  },
})

const selectItems = ref([
  '>',
  '>=',
  '<',
  '<=',
])

const score = ref('')
const selector = ref('>=')

watch(selector, (newVal, oldVal) => {
  if (newVal == oldVal) {
    return
  }
  calculateNewValue()
})

watch(score, (newVal, oldVal) => {
  if (newVal == oldVal) {
    return
  }
  calculateNewValue()
})

function calculateNewValue() {
  if (score.value) {
    console.log('Update', `score:${selector.value}${score.value}`)
    emit('update:modelValue', `score:${selector.value}${score.value}`)
  } else {
    console.log('Update', '')
    emit('update:modelValue', '')
  }
}

parseScoreString()
function parseScoreString() {
  if (propsScoreFilter.modelValue) {
    // Obtain selector
    selector.value = /(?<=score:)([><]+)([=]*)(?=\d+)/.exec(propsScoreFilter.modelValue)?.[0] ?? '>='
    // Obtain score
    score.value = /(?<=score:([><]+)([=]*))\d+/.exec(propsScoreFilter.modelValue)?.[0] ?? ''
  } else {
    selector.value = '>='
    score.value = ''
  }
}


</script>

<style scoped>

</style>