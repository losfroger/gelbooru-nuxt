<template>
  <div>
    <QCard flat>
      <QCardSection class="tw-flex tw-flex-col tw-items-end tw-gap-4 sm:tw-flex-row">
        <div class="tw-flex tw-flex-1 tw-flex-col">
          <h1 class="text-h5">
            Saved searches
          </h1>
          <p>
            Queries are saved in your browser, if you delete the saved data you'll lose them.
          </p>
        </div>
        <QInput
          v-model="table.search"
          filled
          class="tw-flex-1 sm:tw-max-w-md"
          label="Filter"
          :debounce="200"
          clearable
          clear-icon="mdi-close-circle-outline"
        />
      </QCardSection>
      <QSeparator />
      <ClientOnly>
        <QCardSection>
          <template v-if="queryDbStore.userSavedQueries && queryDbStore.userSavedQueries.length > 0">
            <QTable
              v-model:pagination="table.pagination"
              flat
              grid
              row-key="id"
              hide-header
              :columns="table.cols"
              :rows="queryDbStore.userSavedQueries"
              :filter="table.search"
              card-container-class="saved-query-list-container"
            >
              <template #item="props: {row: QueryUserDB.SavedQuery}">
                <GelbooruQuerySavedSearchEntry
                  :key="props.row.id"
                  class="tw-border-b last:tw-border-b-0"
                  :saved-search="props.row"
                />
              </template>
            </QTable>
          </template>
          <p v-else>
            You have no saved searches
          </p>
        </QCardSection>
      </ClientOnly>
    </QCard>
  </div>
</template>

<script setup lang="ts">
import type { QTableProps } from 'quasar'
import type { QueryUserDB } from '~/types/queryUserDb'

useHead({
  title: 'Saved searches',
})

const queryDbStore = useQueryDBStore()

onMounted(() => {
 queryDbStore.refreshSavedQueries()
})

const table = ref<{cols: QTableProps['columns'], search: string, pagination: QTableProps['pagination']}>({
  search: '',
  pagination: {
    sortBy: 'createdAt',
    descending: true,
    rowsPerPage: 20,
  },
  cols: [
    {
      name: 'id',
      field: 'id',
      label: 'Id',
    },
    {
      name: 'name',
      field: 'name',
      label: 'name',
    },
    {
      name: 'createdAt',
      field: 'createdAt',
      label: 'createdAt',
      format:(e: string) => new Date(e),
    },
    {
      name: 'tags',
      field: 'tags',
      label: 'tags',
    },
  ],
})


</script>

<style scoped>

</style>

<style>
.saved-query-list-container {
  @apply tw-grid tw-grid-cols-1
}

</style>