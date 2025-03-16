<template>
  <div v-auto-animate class="tw-flex tw-flex-row tw-items-center">
    <QBtn
      flat
      round
      icon="mdi-tag-search-outline"
    >
      <QBadge v-if="queryGeneratorStore.queryStash.length > 0" floating>
        {{ queryGeneratorStore.queryStash.length }}
      </QBadge>
      <QMenu
        transition-show="jump-down"
        transition-hide="jump-up"
        anchor="bottom right"
        self="top right"
        max-height="80vh"
      >
        <QCard v-auto-animate class="tw-isolate tw-min-w-64">
          <div class="tw-sticky tw-top-0 tw-z-50 tw-bg-background-light-dark tw-shadow-md">
            <QCardSection class="tw-flex tw-flex-row">
              <h1 class="text-h5 tw-flex-1">
                Query
              </h1>
              <QBtn
                label="Clear"
                flat
                icon="mdi-backspace-outline"
                color="negative"
                :disable="queryGeneratorStore.queryStash.length < 1"
                @click="queryGeneratorStore.clearQuery()"
              />
            </QCardSection>
            <QSeparator />
          </div>
          <QList
            v-if="queryGeneratorStore.queryStash.length > 0"
            padding
          >
            <QItem
              v-for="tag in queryGeneratorStore.queryStash"
              :key="tag"
              clickable
              @click="queryGeneratorStore.removeTag(tag)"
            >
              <QItemSection>
                {{ tag }}
              </QItemSection>
              <QItemSection side>
                <QBtn
                  round
                  icon="mdi-close"
                  flat
                  size="sm"
                />
              </QItemSection>
            </QItem>
          </QList>
          <QCardSection v-else>
            <p>
              There are no tags in your query, try right clicking on a tag and adding it.
            </p>
          </QCardSection>
          <div class="tw-sticky tw-bottom-0 tw-bg-background-light-dark tw-shadow-lg">
            <QSeparator />
            <QCardSection class="tw-flex tw-flex-col tw-items-center tw-gap-2">
              <div class="tw-flex tw-flex-row tw-gap-2">
                <QBtn
                  flat
                  icon="mdi-magnify"
                  color="primary"
                  label="Search"
                  :to="searchUrl"
                  :disable="queryGeneratorStore.queryStash.length < 1"
                />
                <QBtn
                  flat
                  icon="mdi-star-outline"
                  color="secondary"
                  label="Search in favorites"
                  :to="favoritesUrl"
                  :disable="queryGeneratorStore.queryStash.length < 1"
                />
              </div>
              <QBtn
                flat
                label="Save query"
                icon="mdi-content-save-outline"
                color="accent"
                :disable="queryGeneratorStore.queryStash.length < 1"
                @click="saveToDb"
              />
            </QCardSection>
          </div>
        </QCard>
      </QMenu>
    </QBtn>
  </div>
</template>

<script setup lang="ts">
import type { QueryUserDB } from '~/types/queryUserDb'

const quasar = useQuasar()

const queryDbStore = useQueryDBStore()
const queryGeneratorStore = useQueryGeneratorStore()

const searchUrl = computed(() => `/search-results?page=1&tags=${encodeURIComponent(queryGeneratorStore.queryStash.join(','))},sort:score`)
const favoritesUrl = computed(() => `/favorites?page=1&tags=${encodeURIComponent(queryGeneratorStore.queryStash.join(','))},sort:score`)

async function saveToDb() {
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
      tags: [...queryGeneratorStore.queryStash],
    }

    const _res = await queryDbStore.pushQuery(queryToSave)
    quasar.notify({
      message: 'Saved correctly',
      type: 'positive',
    })
  })
}


</script>

<style scoped>

</style>