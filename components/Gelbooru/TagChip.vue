<template>
  <v-chip
    v-bind="$attrs"
    variant="tonal"
    color="secondary"
    class="tag-chip"
    :to="`/search-results?tags=${encodeURIComponent(propGelbooruTagChip.simpleTag)},sort:score`"
    @contextmenu="onContextMenu"
  >
    <span class="tw-py-1 tw-capitalize">
      {{ `${simpleTag.replaceAll('_', ' ')}${fullTag ? ` - ${numberFormatter.format(fullTag.count)}` : ''}` }}
    </span>
    <v-menu
      v-if="fullTag"
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
const menuX = ref(0)
const menuY = ref(0)

function onContextMenu(e: MouseEvent) {
  if (!propGelbooruTagChip.fullTag) {
    return
  }
  e.preventDefault()

  menuX.value = e.x
  menuY.value = e.y

  showMenu.value = true
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
}



</style>