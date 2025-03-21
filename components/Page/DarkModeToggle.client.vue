<template>
  <QToggle
    v-model="darkMode"
    v-bind="props"
    toggle-indeterminate
  >
    <QTooltip
      :offset="[4, 4]"
      anchor="center left"
      self="center right"
    >
      {{ textTooltip }}
    </QTooltip>
  </QToggle>
</template>

<script setup lang="ts">
import type { QToggleProps } from 'quasar'


interface PropsDarkModeToggle extends Omit<QToggleProps, 'modelValue' | 'onUpdate:modelValue'> {

}

const quasar = useQuasar()

const props = withDefaults(defineProps<PropsDarkModeToggle>(), {
  checkedIcon: 'mdi-weather-night',
  uncheckedIcon: 'mdi-weather-sunny',
  indeterminateIcon: 'mdi-theme-light-dark',
})

const darkModeLocal = localStorage.getItem('dark-mode')
if (darkModeLocal) {
  quasar.dark.set(
    darkModeLocal == 'auto' ? 'auto'
    : darkModeLocal == 'true' ? true : false
  )
}

const darkMode = ref(quasar.dark.mode)

watch(darkMode, (newVal) => {
  console.log('Dark mode', newVal)
  if (newVal !== null) {
    quasar.dark.set(newVal)
  } else {
    quasar.dark.set('auto')
  }

  localStorage.setItem('dark-mode', `${quasar.dark.mode}`)
})

const textTooltip = computed(() =>
  quasar.dark.mode == 'auto' ? 'Auto'
    : quasar.dark.mode == true ? 'Dark' : 'Light'
)

</script>

<style scoped>

</style>