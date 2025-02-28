<template>
  <QMenu context-menu auto-close>
    <QList>
      <QItem
        :href="`https://gelbooru.com/index.php?page=wiki&s=list&search=${props.simpleTag}`"
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
        v-if="props.favoritesMode"
        :to="`/search-results?page=1&tags=${props.simpleTag},sort:score`"
        class="tw-text-white"
      >
        <QItemSection avatar>
          <QIcon name="mdi-magnify" />
        </QItemSection>
        <QItemSection>
          Search in gelbooru
        </QItemSection>
      </QItem>
      <QItem
        v-else
        :to="`/favorites?page=1&tags=${props.simpleTag},sort:score`"
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
        :to="props.favoritesMode
          ? `/favorites?page=1&tags=${props.simpleTag},sort:score`
          : `/search-results?page=1&tags=${props.simpleTag},sort:score`"
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
      <QSeparator />
      <QItem
        class="tw-text-white"
        clickable
        @click="emitAddTag"
      >
        <QItemSection avatar>
          <QIcon name="mdi-tag-plus-outline" />
        </QItemSection>
        <QItemSection>
          Add tag to current search
        </QItemSection>
      </QItem>
      <QItem
        class="tw-text-white"
        clickable
        @click="emitAddNegativeTag"
      >
        <QItemSection avatar>
          <QIcon name="mdi-tag-minus-outline" />
        </QItemSection>
        <QItemSection>
          Add as negative tag to current search
        </QItemSection>
      </QItem>
    </QList>
  </QMenu>
</template>

<script setup lang="ts">

interface GelbooruSimpleContextMenuProps {
  simpleTag: string,
  favoritesMode?: boolean,
}

const props = defineProps<GelbooruSimpleContextMenuProps>()

const {$event} = useNuxtApp()

function emitAddTag() {
  $event.emit('pushed-tag-to-search', {tag: props.simpleTag})
}

function emitAddNegativeTag() {
  $event.emit('pushed-tag-to-search', {tag: `-${props.simpleTag}`})
}

</script>

<style scoped></style>