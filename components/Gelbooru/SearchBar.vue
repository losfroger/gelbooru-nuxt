<template>
  <div>
    <form
      @submit.prevent="onSearchSubmit"
    >
      <div class="search-bar tw-flex tw-flex-col tw-justify-center tw-gap-2 md:tw-flex-row md:tw-items-center">
        <v-menu
          v-model="showFilterMenu"
          location="bottom left"
          offset="12"
          transition="slide-y-transition"
          :close-on-content-click="false"
        >
          <template #activator="{ props }">
            <v-btn
              v-if="$vuetify.display.mobile"
              variant="text"
              v-bind="props"
              prepend-icon="mdi-filter"
              class="tw-mr-auto"
              :size="$vuetify.display.mobile ? 'small' : 'default'"
            >
              <span>Filters</span>
            </v-btn>
            <v-btn
              v-else
              variant="text"
              v-bind="props"
              icon="mdi-filter"
              :size="$vuetify.display.mobile ? 'small' : 'default'"
            />
          </template>
          <v-card
            width="80vw"
            max-width="500px"
            elevation="24"
            class="tw-flex tw-flex-col "
          >
            <v-card-title class="tw-flex tw-flex-row tw-items-center">
              Filters
              <v-spacer />
              <v-btn
                variant="text"
                size="small"
                color="accent"
                href="https://gelbooru.com/index.php?page=wiki&s=view&id=26263"
                target="_blank"
                icon="mdi-help-circle-outline"
              />
            </v-card-title>
            <v-divider />
            <v-card-text class="tw-flex tw-flex-col tw-gap-4">
              <GelbooruSortBySelect
                v-model="sortBy"
                class="tw-gap-2"
                density="comfortable"
              />
              <GelbooruScoreFilterSelector v-model="scoreFilter" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                type="submit"
                color="primary"
                @click="onSearchSubmit(); showFilterMenu = false;"
              >
                Apply
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <div class="tw-flex tw-w-full tw-flex-row tw-items-center tw-gap-2">
          <GelbooruTagSelector
            v-model="tags"
            hide-details
            @keyup.enter.prevent="onSearchSubmit"
          />
        </div>
        <v-btn
          type="submit"
          color="primary"
          class="tw-ml-auto tw-hidden md:tw-block"
          :size="$vuetify.display.mobile ? 'default' : 'large'"
        >
          Search
        </v-btn>
      </div>
    </form>
    <div class="text-caption v-messages md:tw-ml-14">
      {{ searchResultsText }}
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits<{
  (e: 'update:modelValue', newTags: string): void
}>()

const propsSearchBar = defineProps({
  /**
   * Comma separated tags
   */
  modelValue: {
    type: String,
    default: ''
  },
  searchResults: {
    type: Number,
    default: 0,
  }
})

const tags = ref<string[]>([])

const showFilterMenu = ref(false)
const sortBy = ref('sort:score')
const scoreFilter = ref('')

// Parse tags at start, converting the tag string into the different types
parseTags()

// When the props change, parse tags again
watch(() => propsSearchBar.modelValue, (newValue, oldValue) => {
  console.log('Changed prop tags', newValue, oldValue)
  if (newValue !== oldValue) {
    parseTags()
  }
})

// Update modelvalue when search submit
function onSearchSubmit() {
  const auxSearch = [...tags.value]
  auxSearch.push(sortBy.value)

  if (scoreFilter.value) {
    auxSearch.push(scoreFilter.value)
  }

  console.log('New search!', auxSearch)

  emit('update:modelValue', auxSearch.join(','))
}

// Tag parser
function parseTags() {
  if (!propsSearchBar.modelValue) {
    return
  }

  const auxTagsArray = propsSearchBar.modelValue.split(',')

  const auxTags: string[] = []
  auxTagsArray.forEach((tag) => {
    if (tag.includes('sort:')) {
      sortBy.value = tag
    } else if (tag.includes('score:')) {
      scoreFilter.value = tag
    } else {
      auxTags.push(tag)
    }
  })
  tags.value = auxTags
}

const searchResultsText = computed(() => `${propsSearchBar.searchResults.toLocaleString()} posts` )

</script>

<style scoped>

</style>