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
    @keydown.delete="onDelete"
  />
</template>

<script setup lang="ts">

const selected = ref<string[]>([])

const selectableItems = ref<string[]>([])

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

  if (!newVal) {
    return
  }

  if (aborter.value) {
    console.log('Aborting')
    aborter.value.abort()
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
    selectableItems.value = res.tag.map((tag) => tag.name)
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