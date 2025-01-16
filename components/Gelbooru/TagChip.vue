<template>
  <QChip v-bind="props">
    <span class="tw-capitalize">
      {{ label }}
    </span>
  </QChip>
</template>

<script setup lang="ts">
import type { QChipProps } from 'quasar'
import type { GelbooruTag } from '~/types/gelbooru'
import { Utils } from '~/types/utils'


interface GelbooruTagChipProps extends Omit<QChipProps, 'modelValue' | 'label'> {
  simpleTag: string,
  fullTag?: GelbooruTag,
  artistTags?: GelbooruTag[]
}

const props = defineProps<GelbooruTagChipProps>()

const label = computed(() => `${props.simpleTag.replaceAll('_', ' ')}${props.fullTag ? ` - ${Utils.numberFormatter.format(props.fullTag.count)}` : ''}`)

</script>

<style scoped>

</style>