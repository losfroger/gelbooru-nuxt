<template>
  <span
    :title="date.toLocaleString()"
    class="tw-cursor-help"
  >
    {{ formattedRelativeDate }}
  </span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

const propsTimeAgo = defineProps({
  date: {
    type: Date,
    default: new Date(),
  },
  locale: {
    type: String,
    default: 'en',
  },
  timeFormatOptions: {
    type: Object as PropType<Intl.RelativeTimeFormatOptions>,
    default: (): Intl.RelativeTimeFormatOptions => ({
      style: 'long',
      numeric: 'auto',
    }),
  },
})

const rtf1 = new Intl.RelativeTimeFormat(propsTimeAgo.locale, propsTimeAgo.timeFormatOptions)

const formattedRelativeDate = computed(() => {
  const auxDifSeconds = Math.abs((propsTimeAgo.date.getTime() - new Date().getTime()) / 1000)

  let dif = 0
  let format: Intl.RelativeTimeFormatUnit = 'seconds'
  // Seconds
  if (auxDifSeconds < 60) {
    dif = auxDifSeconds
    format = 'seconds'
  }
  // Minutes
  else if (auxDifSeconds < 60 * 60) {
    dif = auxDifSeconds / 60
    format = 'minutes'
  }
  // Hours
  else if (auxDifSeconds < 60 * 60 * 24) {
    dif = auxDifSeconds / (60 * 60)
    format = 'hours'
  }
  // Days
  else if (auxDifSeconds < 60 * 60 * 24 * 365) {
    dif = auxDifSeconds / (60 * 60 * 24)
    format = 'days'
  }
  else {
    dif = auxDifSeconds / (60 * 60 * 24 * 365)
    format = 'years'
  }

  if (propsTimeAgo.date.getTime() < new Date().getTime()) {
    dif *= -1
  }

  return rtf1.format(Math.round(dif), format)
})

</script>

<style scoped>

</style>