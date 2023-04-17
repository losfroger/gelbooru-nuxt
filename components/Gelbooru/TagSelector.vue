<template>
  <v-autocomplete
    v-model="selected"
    v-model:search="search"
    :items="selectableItems"
    :loading="loading"
    type="search"
    label="Search"
    color="primary"
    prepend-inner-icon="mdi-magnify"
    chips
    closable-chips
    hide-no-data
    multiple
    clearable
    clear-icon="mdi-close-circle-outline"
    hint="Please enter a search term."
    persistent-hint
    item-title="name"
    item-value="name"
    @keydown.delete="onDelete"
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

const selected = ref<string[]>([])
const numberFormatter = Intl.NumberFormat('en', {notation: 'compact'})
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
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:random',
    type_string: 'Sort randomly',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:id',
    type_string: 'Sorting by id',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:id:desc',
    type_string: 'Sorting by id - descending',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:score',
    type_string: 'Sorting by score',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:score:desc',
    type_string: 'Sorting by score - descending',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:rating',
    type_string: 'Sorting by rating',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:rating:desc',
    type_string: 'Sorting by rating - descending',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:user',
    type_string: 'Sorting by user',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:user:desc',
    type_string: 'Sorting by user - descending',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:height',
    type_string: 'Sorting by height',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:height:desc',
    type_string: 'Sorting by height - descending',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:width',
    type_string: 'Sorting by width',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:width:desc',
    type_string: 'Sorting by width - descending',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:source',
    type_string: 'Sorting by source',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:source:desc',
    type_string: 'Sorting by source - descending',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:updated ',
    type_string: 'Sorting by updated',
  },
  {
    id: -1,
    count: -1,
    type: -1,
    ambiguous: 0,
    name: 'sort:updated:desc',
    type_string: 'Sorting by updated - descending',
  },
])
const searchItems = ref<Array<GelbooruTag>>([])
const selectableItems = computed(() => searchItems.value.concat(defaultItems.value))


const search = ref('')
const loading = ref(false)
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

  if (!newVal) {
    searchItems.value = []
    loading.value = false
    return
  }

  aborter.value = new AbortController()
  loading.value = true

  const searchAux = search.value.replaceAll(' ', '_')
  $fetch('/api/tag', {
    signal: aborter.value.signal,
    params: {
      name_pattern: `%${searchAux}%`
    }
  })
  .then((res) => {
    console.log('Res tags', res)
    loading.value = false
    searchItems.value = res.tag
  })
})

function onDelete() {
  console.log('Backspace!')
  if (search.value == '') {
    console.log('Removing last!')
    selected.value = selected.value.slice(0, -1)
  }

}

</script>

<style scoped>

</style>