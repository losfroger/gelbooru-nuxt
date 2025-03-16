<template>
  <QItem
    clickable
  >
    <QItemSection>
      <div class="tw-grid tw-gap-y-4 sm:tw-grid-cols-[1fr_auto] md:tw-grid-cols-[1fr_2fr_auto]">
        <div class="tw-flex tw-flex-row tw-items-center tw-gap-4">
          <QBtn
            icon="mdi-delete-outline"
            color="negative"
            round
            flat
            @click="onDeleteSavedSearch"
          />
          <QItemLabel>
            <h2 class="text-h6">
              {{ props.savedSearch.name }}
            </h2>
            <h3 class="text-subtitle2 tw-font-light" :title="createdAtDate.toLocaleString()">
              {{ formattedCreatedAtDate }}
            </h3>
          </QItemLabel>
        </div>
        <div class="tw-col-span-full tw-row-start-2 tw-flex tw-flex-row tw-flex-wrap tw-items-center md:tw-col-span-1 md:tw-row-start-auto">
          <GelbooruTagSimpleChip
            v-for="tag in props.savedSearch.tags"
            :key="tag"
            color="secondary"
            :simple-tag="tag"
            outline
            size="sm"
            disable-add-to-current-search
          />
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-items-center tw-gap-2">
          <QBtn
            flat
            icon="mdi-magnify"
            color="primary"
            label="Search"
            :to="searchUrl"
          />
          <QBtn
            flat
            icon="mdi-star-outline"
            color="secondary"
            label="Search in favorites"
            :to="favoritesUrl"
          />
        </div>
      </div>
    </QItemSection>
  </QItem>
</template>

<script setup lang="ts">
import type { QueryUserDB } from '~/types/queryUserDb'

interface GelbooruQuerySavedSearchEntryProps {
  savedSearch: QueryUserDB.SavedQuery,
}

const props = defineProps<GelbooruQuerySavedSearchEntryProps>()

const quasar = useQuasar()
const queryDbStore = useQueryDBStore()

const searchUrl = computed(() => `/search-results?tags=${encodeURIComponent(props.savedSearch.tags.join(','))},sort:score`)
const favoritesUrl = computed(() => `/favorites?tags=${encodeURIComponent(props.savedSearch.tags.join(','))},sort:score`)

const createdAtDate = computed(() => new Date(props.savedSearch.createdAt))
const formattedCreatedAtDate = computed(() => createdAtDate.value.toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'}))


function onDeleteSavedSearch() {
  quasar.dialog({
    title: 'Are you sure?',
    message: 'Deleting a saved search cannot be undone',
    color: 'primary',
    cancel: {
      flat: true,
      color: 'grey',
    },
  }).onOk(() => {
    if (!props.savedSearch.id) {
      console.error('No id in entry')
      return
    }

    queryDbStore.deleteSavedQuery(props.savedSearch.id)
  })
}

</script>

<style scoped>

</style>