<template>
  <v-chip
    v-bind="$attrs"
    variant="tonal"
    color="secondary"
    class="tag-chip"
    :to="$vuetify.display.mobile ? '' : `/search-results?tags=${encodeURIComponent(propGelbooruTagChip.simpleTag)},sort:score`"
    @contextmenu.prevent="onContextMenu"
    @click.prevent="changePage"
  >
    <span class="tw-py-1 tw-capitalize">
      {{ `${simpleTag.replaceAll('_', ' ')}${fullTag ? ` - ${numberFormatter.format(fullTag.count)}` : ''}` }}
    </span>
    <v-menu
      v-model="showMenu"
      location="bottom"
      activator="parent"
      :open-on-click="false"
      :close-on-content-click="false"
    >
      <v-list
        v-model:opened="menuOpenedSubgroups"
        density="compact"
        @mouseleave="showMenu = false"
      >
        <v-list-item
          :href="`https://gelbooru.com/index.php?page=wiki&s=list&search=${fullTag?.name}`"
          target="_blank"
        >
          <v-list-item-title class="tw-flex tw-flex-row tw-items-center">
            <v-icon
              start
              icon="mdi-book-outline"
              size="small"
            />
            Wiki
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :to="`/favorites?page=1&tags=${encodeURIComponent(propGelbooruTagChip.simpleTag)},sort:score`"
        >
          <v-list-item-title class="tw-flex tw-flex-row tw-items-center">
            <v-icon
              start
              icon="mdi-star-outline"
              size="small"
            />
            Search in favorites
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          :href="`/search-results?tags=${encodeURIComponent(propGelbooruTagChip.simpleTag)},sort:score`"
          target="_blank"
        >
          <v-list-item-title class="tw-flex tw-flex-row tw-items-center">
            <v-icon
              start
              icon="mdi-open-in-new"
              size="small"
            />
            Open in new tab
          </v-list-item-title>
        </v-list-item>
        <v-list-group
          key="artists"
          value="artists"
        >
          <template #activator="{ props }">
            <v-list-item
              v-if="artistTag && artistTag.length > 0"
              v-bind="props"
            >
              <v-list-item-title class="tw-flex tw-flex-row tw-items-center">
                <v-icon
                  start
                  icon="mdi-brush-outline"
                  size="small"
                />
                Search from the same artist
              </v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="artist in artistTag"
            :key="artist.id"
            :to="`/search-results?tags=${encodeURIComponent(artist.name)},${encodeURIComponent(propGelbooruTagChip.simpleTag)},sort:score`"
            :title="artist.name"
          />
        </v-list-group>
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
  },
  artistTag: {
    type: Object as PropType<GelbooruTag[]>,
    default: undefined,
  }
})

const router = useRouter()

const numberFormatter = Intl.NumberFormat('en', {notation: 'compact'})

const showMenu = ref(false)
const menuOpenedSubgroups = ref<String[]>([])

function changePage() {
  router.push(`/search-results?tags=${encodeURIComponent(propGelbooruTagChip.simpleTag)},sort:score`)
}

function onContextMenu(e: MouseEvent) {
  if (!propGelbooruTagChip.fullTag) {
    return
  }
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

  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none !important;
}



</style>