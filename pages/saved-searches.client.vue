<template>
  <div>
    <ClientOnly>
      <QCard flat>
        <QCardSection>
          <h1 class="text-h5">
            Saved queries
          </h1>
          <p>
            Queries are saved in your browser, if you delete the saved data you'll lose them.
          </p>
        </QCardSection>
        <QSeparator />
        <QCardSection>
          <QList v-if="savedSearches.length > 0" separator>
            <GelbooruQuerySavedSearchEntry
              v-for="savedSearch in savedSearches"
              :key="savedSearch.id"
              :saved-search="savedSearch"
            />
          </QList>
          <p v-else>
            You have no saved searches
          </p>
        </QCardSection>
      </QCard>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { QueryUserDB } from '~/types/queryUserDb'


const queryDbStore = useQueryDBStore()

const savedSearches = ref<QueryUserDB.SavedQuery[]>([])

onMounted(async () => {
  const aux = await queryDbStore.getAllSavedQueries()
  console.log(aux)
  if (aux) {
    savedSearches.value = aux
  }
})


</script>

<style scoped>

</style>