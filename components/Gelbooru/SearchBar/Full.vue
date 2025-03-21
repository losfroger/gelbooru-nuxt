<template>
  <div class="tw-flex tw-flex-col tw-gap-1">
    <div class="tw-flex tw-flex-col tw-gap-4 md:tw-flex-row">
      <div class="tw-flex tw-flex-row tw-flex-wrap tw-items-center tw-gap-4">
        <QBtn
          flat
          icon="mdi-filter"
          :round="$q.screen.gt.sm"
          :label="$q.screen.gt.sm ? undefined : 'Filters'"
        >
          <QMenu v-model="showFilterMenu" @before-show="onBeforeShowFilterMenu">
            <QCard class="tw-w-[80vw] tw-max-w-md">
              <QCardSection class="tw-flex tw-flex-row">
                <h1 class="text-h6">
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
        <QBtn
          icon="mdi-tag-heart"
          flat
          :disable="tags.length < 1"
          :round="$q.screen.gt.sm"
          :label="$q.screen.gt.sm ? undefined : 'Save current search'"
          @click="saveCurrentSearchToDb"
        >
          <QTooltip>
            Save current search
          </QTooltip>
        </QBtn>
      </div>
      <QForm
        class="tw-flex tw-w-full tw-flex-1 tw-flex-row tw-items-center tw-justify-center tw-gap-4"
        @submit="onSearchSubmit"
      >
        <GelbooruSearchBarSelect
          v-model="tags"
          filled
          clearable
          hide-bottom-space
          class="tw-flex-1"
        />
        <QBtn
          type="submit"
          color="primary"
          icon="mdi-check"
          round
          class="tw-my-auto"
        >
          <QTooltip>Search</QTooltip>
        </QBtn>
      </QForm>
    </div>
    <p class="q-field__messages tw-text-xs tw-opacity-80 md:tw-pl-[7.5rem]">
      {{ searchResultsText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { QueryUserDB } from '~/types/queryUserDb'


interface GelbooruSearchBarFullProps {
  modelValue: string,
  searchResultsCount: number,
}

const props = defineProps<GelbooruSearchBarFullProps>()
const emit = defineEmits<{
  (e: 'update:modelValue', newTags: string): void
}>()

const { $event } = useNuxtApp()
const quasar = useQuasar()

const queryDbStore = useQueryDBStore()

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

$event.on('pushed-tag-to-search', (data) => {
  console.log(`On test event from search bar: ${data.tag}`)
  tags.value.push(data.tag)
  onSearchSubmit()
})

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

function saveCurrentSearchToDb() {
  quasar.dialog({
    title: 'Saving query',
    message: 'Name of your query:',
    color: 'primary',
    prompt: {
      model: '',
      isValid: (val) => val.length > 0,
      type: 'text',
    },
    cancel: {
      flat: true,
      color: 'grey',
    },
    persistent: true,
  }).onOk(async (data: string) => {
    const queryToSave: QueryUserDB.QueryToSave = {
      name: data,
      tags: [...tags.value],
    }

    const _res = await queryDbStore.pushQuery(queryToSave)
    quasar.notify({
      type: 'positive',
      message: 'Saved correctly',
    })
  })
}

</script>

<style scoped>

</style>