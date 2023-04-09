<template>
  <v-chip
    v-bind="$attrs"
    variant="tonal"
    color="secondary"
  >
    <span class="tw-capitalize">
      {{ propGelbooruTagChip.tag }}
    </span>
    <v-tooltip
      v-model="open_tooltip"
      activator="parent"
      location="top"
      open-delay="1000"
      offset="2"
    >
      <div class="tw-min-w-24 tw-flex tw-flex-row tw-justify-center">
        <v-expand-transition>
          <div
            v-if="!loading && data"
            key="2"
            class="tw-flex tw-flex-col tw-text-center"
          >
            <div class="tw-text-xs tw-font-light tw-capitalize">
              {{ data.type_string }}
            </div>
            <div>
              <span class="tw-capitalize">
                {{ data.name.replaceAll('_', ' ') }},
              </span>
              {{ formatter.format(data.count) }} posts
            </div>
            <div />
          </div>
        </v-expand-transition>
      </div>
    </v-tooltip>
  </v-chip>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

import { GelbooruTag } from '~/types/gelbooru'
import { useTagStore } from '~/stores/tagsStore'

const tagStore = useTagStore()

const propGelbooruTagChip = defineProps({
  tag: {
    type: String,
    default: ''
  }
})

const open_tooltip = ref(false)
const loading = ref(false)
const data = ref<GelbooruTag>({
  id: 0,
  count: 0,
  name: '',
  type: 0,
  type_string: '',
  ambiguous: 0
})

const formatter = Intl.NumberFormat('en', {notation: 'compact'})

watch(open_tooltip, async (newValue) => {
  if (newValue && !data.value.id) {
    loading.value = true

    const aux = await tagStore.getTag(propGelbooruTagChip.tag)

    if (aux) {
      data.value = aux
    }

    loading.value = false
  }

})

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

</style>