<template>
  <QMenu context-menu auto-close>
    <QList>
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
          :to="`/search-results?page=1&tags=${encodeURIComponent(artist.name)},sort:score`"
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

const searchUrl = computed(() => `/search-results?page=1&tags=${encodeURIComponent(props.simpleTag)},sort:score`)
const favoritesUrl = computed(() => `/favorites?page=1&tags=${encodeURIComponent(props.simpleTag)},sort:score`)

</script>

<style scoped></style>