<template>
  <span
    :title="date.toLocaleString()"
    class="tw-cursor-help"
  >
    <slot /> {{ formattedRelativeDate }}
  </span>
</template>

<script setup lang="ts">

interface TimeAgoProps {
  date: Date,
  locale?: Intl.LocalesArgument | undefined,
  timeFormatOptions?: Intl.RelativeTimeFormatOptions,
}

const props = withDefaults(defineProps<TimeAgoProps>(), {
  locale: undefined,
  timeFormatOptions: (): Intl.RelativeTimeFormatOptions => ({
    style: 'long',
    numeric: 'auto',
  }),
})

const rtf1 = new Intl.RelativeTimeFormat(props.locale, props.timeFormatOptions)

const minute = 60
const hour = 60 * 60
const day = 60 * 60 * 24
const month = 60 * 60 * 24 * 30
const year = 60 * 60 * 24 * 30 * 12

const formattedRelativeDate = computed(() => {
  const auxDifSeconds = Math.abs((props.date.getTime() - new Date().getTime()) / 1000)

  let dif = 0
  let format: Intl.RelativeTimeFormatUnit = 'seconds'
  if (auxDifSeconds < minute) {
    // Seconds
    format = 'seconds'
  } else if (auxDifSeconds < hour) {
    // Minutes
    dif = auxDifSeconds / minute
    format = 'minutes'
  } else if (auxDifSeconds < day) {
    // Hours
    dif = auxDifSeconds / hour
    format = 'hours'
  } else if (auxDifSeconds < month) {
     // Days
    dif = auxDifSeconds / day
    format = 'days'
  } else if (auxDifSeconds < year) {
    // Months
    dif = auxDifSeconds / month
    format = 'months'
  } else {
    // Years
    dif = auxDifSeconds / year
    format = 'years'
  }

  if (props.date.getTime() < new Date().getTime()) {
    dif *= -1
  }

  return rtf1.format(Math.round(dif), format)
})

</script>

<style scoped>

</style>