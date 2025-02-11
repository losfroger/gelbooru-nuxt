<template>
  <QMenu context-menu>
    <QList>
      <QItem
        :href="`https://gelbooru.com/index.php?page=wiki&s=list&search=${props.simpleTag}`"
        target="_blank"
      >
        <QItemSection avatar>
          <QIcon name="mdi-book-outline" />
        </QItemSection>
        <QItemSection>
          Wiki
        </QItemSection>
      </QItem>
      <QItem :to="`/favorites?page=1&tags=${props.simpleTag},sort:score`">
        <QItemSection avatar>
          <QIcon name="mdi-star-outline" />
        </QItemSection>
        <QItemSection>
          Search in favorites
        </QItemSection>
      </QItem>
      <QItem :to="`/favorites?page=1&tags=${props.simpleTag},sort:score`" target="_blank">
        <QItemSection avatar>
          <QIcon name="mdi-open-in-new" />
        </QItemSection>
        <QItemSection>
          Open in new tab
        </QItemSection>
      </QItem>
    </QList>
  </QMenu>
</template>

<script setup lang="ts">

interface GelbooruSimpleContextMenuProps {
  simpleTag: string,
}

const props = defineProps<GelbooruSimpleContextMenuProps>()

</script>

<style scoped>

</style>