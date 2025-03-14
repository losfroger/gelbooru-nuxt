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
      >
        <QCard v-auto-animate class="tw-min-w-64">
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
          <QList
            v-if="queryGeneratorStore.queryStash.length > 0"
            class="tw-max-h-[80vh]"
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
              There are no tags in your query, try right clicking a tag and adding it.
            </p>
          </QCardSection>
          <QSeparator />
          <QCardSection class="tw-flex tw-flex-row tw-gap-2">
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
          </QCardSection>
        </QCard>
      </QMenu>
    </QBtn>
  </div>
</template>

<script setup lang="ts">

const queryGeneratorStore = useQueryGeneratorStore()

const searchUrl = computed(() => `/search-results?page=1&tags=${encodeURIComponent(queryGeneratorStore.queryStash.join(','))},sort:score`)
const favoritesUrl = computed(() => `/favorites?page=1&tags=${encodeURIComponent(queryGeneratorStore.queryStash.join(','))},sort:score`)


</script>

<style scoped>

</style>