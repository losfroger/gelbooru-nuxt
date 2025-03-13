<template>
  <QMenu context-menu auto-close>
    <QList>
      <QItem
        class="tw-text-white"
        clickable
        @click="addTagToQueryGenerator"
      >
        <QItemSection avatar>
          <QIcon name="mdi-tag-plus-outline" />
        </QItemSection>
        <QItemSection>
          Add tag to query
        </QItemSection>
      </QItem>
      <QItem
        class="tw-text-white"
        clickable
        @click="addNegativeTagToQueryGenerator"
      >
        <QItemSection avatar>
          <QIcon name="mdi-tag-minus-outline" />
        </QItemSection>
        <QItemSection>
          Add as negative tag to query
        </QItemSection>
      </QItem>
      <QSeparator />
      <QItem
        :to="favoritesUrl"
        class="tw-text-white"
      >
        <QItemSection avatar>
          <QIcon name="mdi-star-outline" />
        </QItemSection>
        <QItemSection>
          Search in favorites
        </QItemSection>
      </QItem>
      <QItem
        :to="searchUrl"
        target="_blank"
        class="tw-text-white"
      >
        <QItemSection avatar>
          <QIcon name="mdi-open-in-new" />
        </QItemSection>
        <QItemSection>
          Open in new tab
        </QItemSection>
      </QItem>
      <QItem
        :href="`https://gelbooru.com/index.php?page=wiki&s=list&search=${encodeURIComponent(props.simpleTag)}`"
        target="_blank"
        class="tw-text-white"
      >
        <QItemSection avatar>
          <QIcon name="mdi-book-outline" />
        </QItemSection>
        <QItemSection>
          Wiki
        </QItemSection>
      </QItem>
      <template v-if="props.artistTags && props.artistTags.length > 0">
        <QSeparator />
        <QItem class="tw-text-white">
          <QItemSection avatar>
            <QIcon name="mdi-brush-outline" />
          </QItemSection>
          <QItemSection>
            Explore more from the artist:
          </QItemSection>
        </QItem>

        <!-- List all artists associated -->
        <QItem
          v-for="artist in props.artistTags"
          :key="artist.id"
          :inset-level="1"
          :to="`/search-results?page=1&tags=${encodeURIComponent(artist.name)},${encodeURIComponent(props.simpleTag)},sort:score`"
          class="tw-text-white"
        >
          <QItemSection>
            {{ artist.name }}
          </QItemSection>
        </QItem>
      </template>
    </QList>
  </QMenu>
</template>

<script setup lang="ts">
import type { GelbooruTag } from '~/types/gelbooru'


interface GelbooruSimpleContextMenuProps {
  simpleTag: string,
  artistTags?: GelbooruTag[]
}

const props = defineProps<GelbooruSimpleContextMenuProps>()

const queryGeneratorStore = useQueryGeneratorStore()

const searchUrl = computed(() => `/search-results?page=1&tags=${encodeURIComponent(props.simpleTag)},sort:score`)
const favoritesUrl = computed(() => `/favorites?page=1&tags=${encodeURIComponent(props.simpleTag)},sort:score`)

function addTagToQueryGenerator() {
  queryGeneratorStore.pushTag(props.simpleTag)
}

function addNegativeTagToQueryGenerator() {
  queryGeneratorStore.pushTag(`-${props.simpleTag}`)
}

</script>

<style scoped></style>