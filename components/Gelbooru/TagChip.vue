<template>
  <v-chip
    v-bind="$attrs"
    variant="tonal"
    color="secondary"
    class="tag-chip"
    :to="`/search-results?tags=${encodeURIComponent(propGelbooruTagChip.simpleTag)},sort:score`"
    @contextmenu.prevent="onContextMenu"
  >
    <span class="tw-py-1 tw-capitalize">
      {{ `${simpleTag.replaceAll('_', ' ')}${fullTag ? ` - ${numberFormatter.format(fullTag.count)}` : ''}` }}
    </span>
    <v-menu
      v-if="fullTag && $vuetify.display.mdAndUp"
      v-model="showMenu"
      activator="parent"
    >
      <v-list density="compact">
        <v-list-item
          :href="`https://gelbooru.com/index.php?page=wiki&s=list&search=${fullTag?.name}`"
          target="_blank"
        >
          <v-list-item-title>Wiki</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-chip>
</template>

<script setup lang="ts">
import { GelbooruTag } from '~/types/gelbooru'


const propGelbooruTagChip = defineProps({
  simpleTag: {
    type: String,
    default: '',
  },
  fullTag: {
    type: Object as PropType<GelbooruTag>,
    default: undefined,
  }
})

const numberFormatter = Intl.NumberFormat('en', {notation: 'compact'})

const showMenu = ref(false)

function onContextMenu(e: MouseEvent) {
  if (!propGelbooruTagChip.fullTag) {
    return
  }
  showMenu.value = true
  return false
}
</script>

<style scoped>
.dark-tooltip {
  background-color: black;
  opacity: 1 !important;
}
.text {
  @apply tw-max-w-[120px] tw-overflow-hidden;
  overflow: hidden;
  display: -webkit-box;
  word-wrap: break-word;
  text-overflow: ellipsis;

  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;

  height: 1.3em; /* Fallback for non-webkit, line-height * 2 */
  line-height: 1.3em;
}
.tag-chip {
  white-space: pre-line !important;
  height: auto !important;

  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none !important;
}



</style>