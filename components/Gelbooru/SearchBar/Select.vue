<template>
  <QSelect
    v-bind="props"
    ref="searchBarRef"
    :model-value="props.modelValue"
    use-input
    use-chips
    emit-value
    option-label="name"
    option-value="name"
    :options="itemsSearchBar"
    :loading="loading"
    @filter="onFilter"
    @filter-abort="onFilterAbort"
    @input-value="onInputValue"
    @update:model-value="(e) => emit('update:modelValue', e)"
    @popup-show="popupShown = true"
    @popup-hide="popupShown = false"
  >
    <template #prepend>
      <QIcon :name="props.icon" />
    </template>
    <template #no-option>
      <QItem>
        <QItemSection>
          No tags found
        </QItemSection>
      </QItem>
    </template>
    <template #option="{ itemProps, opt } : { itemProps: any, opt: GelbooruTag }">
      <QItem v-bind="itemProps">
        <QItemSection>
          <QItemLabel>
            {{ opt.name }}
          </QItemLabel>
          <QItemLabel caption>
            {{ opt.type_string }}
            <span v-if="opt.count > 0">- {{ Utils.numberFormatter.format(opt.count) }}</span>
          </QItemLabel>
        </QItemSection>
      </QItem>
    </template>
    <template v-if="$q.platform.is.mobile && popupShown" #append>
      <QBtn
        v-close-popup
        outline
        rounded
        size="xs"
        label="Close"
      />
    </template>
    <template #selected-item="scope">
      <GelbooruSearchBarChipTag
        removable
        dense
        :tabindex="scope.tabindex"
        :label="scope.opt"
        @remove="scope.removeAtIndex(scope.index)"
      />
    </template>

    <template #after>
      <slot name="after" />
    </template>
  </QSelect>
</template>

<script setup lang="ts">
/**
 * Search bar for filtering tags, supports negative and fuzzy tags
 */

import  { type QSelectProps, QSelect } from 'quasar'
import type { GelbooruTag } from '~/types/gelbooru'
import { Utils } from '~/types/utils'

interface GelbooruSearchBar extends Omit<QSelectProps, 'options' | 'loading' | 'optionValue' | 'optionLabel' | 'emitValue' | 'onUpdate:modelValue' | 'modelValue' | 'useInput' | 'dark' | 'optionsDark' > {
  modelValue: string[],
  placeholder?: string | undefined,
  hideDefaultItems?: boolean,
  icon?: string,
}

const props = withDefaults(defineProps<GelbooruSearchBar>(), {
  dark: true,
  label: 'Tags',
  icon: 'mdi-magnify',
  placeholder: undefined,
  inputDebounce: 500,
  multiple: true,
  clearIcon: 'mdi-close-circle-outline',
})

const emit = defineEmits<{
  (e: 'update:modelValue', newVal: string[]): void
}>()

const quasar = useQuasar()

const searchBarRef = ref<QSelect | null>(null)
const loading = ref(false)

const popupShown = ref(false)

// #region Search bar options

/**
 * List of default options for the searchbar, since ratings don't show up on search
 */
const defaultItems = ref<GelbooruTag[]>([
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'rating:safe',
    type_string: 'Rating safe',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'rating:general',
    type_string: 'Rating general',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'rating:questionable',
    type_string: 'Rating questionable',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'rating:sensitive',
    type_string: 'Rating sensitive',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'rating:explicit',
    type_string: 'Rating explicit',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: '-rating:safe',
    type_string: 'Posts without rating safe',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: '-rating:general',
    type_string: 'Remove posts with rating general',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: '-rating:questionable',
    type_string: 'Remove posts with rating questionable',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: '-rating:sensitive',
    type_string: 'Remove posts with rating sensitive',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: '-rating:explicit',
    type_string: 'Remove posts with rating explicit',
  },
])

/**
 * Array with the tags returned by the backend when searching
 */
const tagSearchResultItems = ref<GelbooruTag[]>([])
/**
 * Combines the default items with the result from the search into a single array to display
 */
const itemsSearchBar = computed((): GelbooruTag[] =>
  props.hideDefaultItems
    ? tagSearchResultItems.value
    : tagSearchResultItems.value.concat(defaultItems.value)
)

// #endregion

const abortController = ref<AbortController | null>(null)

/**
 * Function to get data from backend and update the list of tags
 * @param searchVal
 * @param update
 * @param abortFn
 */
async function onFilter (
  searchVal: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
  abortFn: () => void
) {
  if (searchVal.length < 3) {
    update(() => {
      tagSearchResultItems.value = []
    })
    return
  }

  try {
    loading.value = true
    const searchAux = searchVal
      .toLowerCase()
      .trim()
      .replaceAll(' ', '_')

    abortController.value = new AbortController()
    const res = await $fetch('/api/tag', {
      signal: abortController.value.signal,
      params: { name_pattern: searchAux },
    })
    update(() => {
      tagSearchResultItems.value = res.tag
    })
  } catch (error) {
    console.error(error)
    quasar.notify({
      type: 'negative',
      caption: 'Error',
      message: `${error}`,
    })
    abortFn()
  } finally {
    loading.value = false
  }
}

function onFilterAbort () {
  if (abortController.value) {
    abortController.value.abort()
  }
}

function onInputValue (searchString: string) {
  if (!searchString.includes(',')) {
    return
  }

  searchBarRef.value?.add(searchString.substring(0, searchString.length - 1))
  searchBarRef.value?.updateInputValue('')
  onFilterAbort()
}

</script>

<style scoped>

</style>

