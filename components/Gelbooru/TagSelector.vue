<template>
  <v-autocomplete
    v-model="selected"
    v-model:search="search"
    v-bind="$attrs"
    :items="selectableItems"
    :loading="loading"
    type="search"
    label="Tags"
    placeholder="Ex: blue_sky cloud 1girl"
    color="primary"
    prepend-inner-icon="mdi-magnify"
    chips
    closable-chips
    hide-no-data
    multiple
    clearable
    clear-icon="mdi-close-circle-outline"
    item-title="name"
    item-value="name"
    hide-details="auto"
    @keydown.delete="onDelete"
    @keyup.enter="onSearchAutocompleteKeyEnter"
    @update:model-value="search = ''"
  >
    <template #chip="{ props, item }">
      <GelbooruChipTagSelector
        v-bind="props"
        :text="item.value"
      />
    </template>

    <template #item="{ props, item }: {props: any, item: {raw: GelbooruTag}}">
      <v-list-item
        v-bind="props"
      >
        <v-list-item-subtitle>
          {{ item.raw.type_string }}
          <span v-if="item.raw.count > 0"> - {{ numberFormatter.format(item.raw.count) }} </span>
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { GelbooruTag } from '~/types/gelbooru'
import { FetchError } from 'ofetch'

import { useAppStore } from '~/stores/appStore'
const appStore = useAppStore()

const emit = defineEmits<{
  (e: 'update:modelValue', newVal: string[]): void
}>()

const propsTagSelector = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: (): string[] => []
  },
  hideDefaultItems: {
    type: Boolean,
    default: false,
  }
})


// List of selected items
const selected = ref<string[]>(propsTagSelector.modelValue)

/*
  V-MODEL
*/
watch(() => propsTagSelector.modelValue, (newVal) => selected.value = newVal)

const numberFormatter = Intl.NumberFormat('en', {notation: 'compact'})

// Default items that can be selected
const defaultItems = ref<(GelbooruTag)[]>([
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
    name: '-rating:safe',
    type_string: 'Rating safe - remove',
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
    name: '-rating:general',
    type_string: 'Rating general - remove',
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
    name: '-rating:questionable',
    type_string: 'Rating questionable - remove',
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
    name: '-rating:sensitive',
    type_string: 'Rating sensitive - remove',
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
    name: '-rating:explicit',
    type_string: 'Rating explicit - remove',
  },
])
// Tags that have been found through search
const searchItems = ref<Array<GelbooruTag>>([])

// Items show on dropdown
const selectableItems = computed(() => {
  if (propsTagSelector.hideDefaultItems) {
    return searchItems.value
  } else {
    return searchItems.value.concat(defaultItems.value)
  }
})


const search = ref('')
const loading = ref(false)
const timer = ref<NodeJS.Timeout | undefined>(undefined)
const aborter = ref<AbortController | undefined>(undefined)

const commaRegex = new RegExp(/.*,$/)

watch(search, (newVal, oldValue) => {
  console.log('Search', newVal, oldValue)

  if (commaRegex.test(newVal)) {
    selected.value.push(oldValue)
    search.value = ''
    return
  }

  if (aborter.value) {
    console.log('Aborting')
    aborter.value.abort()
  }

  if (newVal.length < 1) {
    searchItems.value = []
    loading.value = false
    return
  }

  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = undefined
  }

  loading.value = true
  timer.value = setTimeout(() => {
    aborter.value = new AbortController()

    const searchAux = search.value.replaceAll(' ', '_')
    $fetch('/api/tag', {
      signal: aborter.value.signal,
      params: {
        name_pattern: searchAux
      }
    })
    .then((res) => {
      console.debug('Res tags', res)
      loading.value = false
      searchItems.value = res.tag
    })
    .catch((err: FetchError) => {
      if (err.statusCode) {
        loading.value = false
        appStore.addNotification({
          color: 'info',
          text: err.statusMessage
        })
      }
    })
  }, 500)

})

function onDelete() {
  console.debug('Backspace!')
  if (search.value == '') {
    console.debug('Removing last!')
    selected.value = selected.value.slice(0, -1)
  }
}

watch(selected, (newVal) => emit('update:modelValue', newVal))

function onSearchAutocompleteKeyEnter() {
  if (document.activeElement) {
    (document.activeElement as HTMLElement).blur()
  }
}

function onBlur() {
  console.log('Blur')
  emit('update:modelValue', selected.value)
}


</script>

<style scoped>

</style>