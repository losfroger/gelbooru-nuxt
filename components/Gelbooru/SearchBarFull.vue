<template>
  <div class="tw-flex tw-flex-col tw-gap-1">
    <div class="tw-flex tw-flex-row tw-gap-4">
      <QBtn
        flat
        icon="mdi-filter"
        round
        class="tw-m-auto"
      >
        <QMenu v-model="showFilterMenu" @before-show="onBeforeShowFilterMenu">
          <QCard>
            <QCardSection class="tw-flex tw-flex-row">
              <h1 class="text-h6 tw-min-w-96">
                Filters
              </h1>
              <QBtn
                flat
                class="tw-ml-auto"
                color="accent"
                icon="mdi-help-circle-outline"
              />
            </QCardSection>
            <QSeparator class="tw-opacity-40" />
            <QForm @submit="onFilterMenuSubmit">
              <QCardSection class="tw-flex tw-flex-col tw-gap-4">
                <div class="tw-flex tw-flex-col tw-gap-8">
                  <GelbooruSortByFilterSelect v-model="auxSortByTag" class="tw-flex-1" />
                  <GelbooruScoreFilterSelect v-model="auxScoreFilterTag" class="tw-flex-1" />
                </div>
                <QBtn
                  flat
                  label="Apply"
                  color="primary"
                  class="tw-ml-auto"
                  type="submit"
                />
              </QCardSection>
            </QForm>
          </QCard>
        </QMenu>
      </QBtn>
      <QForm
        class="tw-flex tw-w-full tw-flex-1 tw-flex-row tw-items-center tw-justify-center tw-gap-4"
        @submit="onSearchSubmit"
      >
        <GelbooruSearchBar
          v-model="tags"
          filled
          clearable
          hide-bottom-space
          class="tw-flex-1"
        />
        <QBtn
          type="submit"
          label="Search"
          color="primary"
          size="lg"
          class="tw-my-auto"
        />
      </QForm>
    </div>
    <p class="q-field__messages tw-pl-16 tw-text-xs tw-opacity-80">
      {{ searchResultsText }}
    </p>
  </div>
</template>

<script setup lang="ts">

interface GelbooruSearchBarFullProps {
  modelValue: string,
  searchResultsCount: number,
}

const props = defineProps<GelbooruSearchBarFullProps>()
const emit = defineEmits<{
  (e: 'update:modelValue', newTags: string): void
}>()

// #region Filter menu

const showFilterMenu = ref(false)
const auxSortByTag = ref('sort:score')
const auxScoreFilterTag = ref('')

const sortByTag = ref('sort:score')
const scoreFilterTag = ref('')

function onBeforeShowFilterMenu() {
  auxSortByTag.value = sortByTag.value
  auxScoreFilterTag.value = scoreFilterTag.value
}

function onFilterMenuSubmit() {
  sortByTag.value = auxSortByTag.value
  scoreFilterTag.value = auxScoreFilterTag.value
  showFilterMenu.value = false
  onSearchSubmit()
}

// #endregion

// Tag parser
const tags = ref<string[]>([])

watch(() => props.modelValue, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    parseTags(newValue)
  }
}, { immediate: true })


parseTags(props.modelValue)
function parseTags(tagsString: string) {
  if (!tagsString) {
    return
  }

  const auxTagsArray = tagsString.split(',')

  sortByTag.value = auxTagsArray.find((tag) => tag.includes('sort:')) ?? 'sort:score'
  scoreFilterTag.value = auxTagsArray.find((tag) => tag.includes('score:')) ?? ''

  tags.value = auxTagsArray.filter((tag) => !tag.includes('sort:') && !tag.includes('score:'))
}

function onSearchSubmit() {
  const auxSearch = [...tags.value]
  auxSearch.push(sortByTag.value)

  if (scoreFilterTag.value) {
    auxSearch.push(scoreFilterTag.value)
  }

  emit('update:modelValue', auxSearch.join(','))
}

const searchResultsText = computed(() => `${(props.searchResultsCount ?? 0)?.toLocaleString()} posts` )

</script>

<style scoped>

</style>