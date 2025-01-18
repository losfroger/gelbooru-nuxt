<template>
  <div class="tw-flex tw-flex-row tw-gap-2">
    <QSelect
      :model-value="auxSign"
      filled
      label="Range"
      class="tw-flex-1"
      :options="signOptions"
      @update:model-value="(e) => calculateNewValue(e, auxScore)"
    />
    <QInput
      v-model.number="auxScore"
      type="number"
      filled
      label="Score"
      hint="If empty, posts won't be filtered by score "
      class="tw-flex-[3_3_0%]"
      @update:model-value="(e) => calculateNewValue(auxSign, e)"
    />
  </div>
</template>

<script setup lang="ts">

interface GelbooruScoreFilterSelect {
  modelValue: string,
}

const props = defineProps<GelbooruScoreFilterSelect>()
const emit = defineEmits<{
  (e: 'update:modelValue', newScoreFilterTag: string): void,
}>()

type SignOptions = '>' | '>=' | '<' | '<='
const signOptions = ref<SignOptions[]>([
  '>',
  '>=',
  '<',
  '<=',
])

const auxSign = ref<SignOptions>('>=')
const auxScore = ref<number | undefined>(undefined)

const signRegexFinder = /(?<=score:)([><]+)([=]*)(?=\d+)/
const scoreRegexFinder = /(?<=score:([><]+)([=]*))\d+/

parseScoreString(props.modelValue)
function parseScoreString(scoreTagString: string) {
  if (scoreTagString) {
    // Obtain selector
    auxSign.value = (signRegexFinder.exec(scoreTagString)?.[0] ?? '>=') as SignOptions
    // Obtain score
    auxScore.value = parseInt(scoreRegexFinder.exec(scoreTagString)?.[0] ?? '') || undefined
  } else {
    auxSign.value = '>='
    auxScore.value = undefined
  }
}

function calculateNewValue(sign: SignOptions, score: number | undefined) {
  if (score) {
    emit('update:modelValue', `score:${sign}${score}`)
  } else {
    emit('update:modelValue', '')
  }
  auxSign.value = sign
  auxScore.value = score
}

</script>

<style scoped>

</style>