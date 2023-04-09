<template>
  <v-btn
    v-bind="$attrs"
    color="accent"
    :disabled="typeSource.invalid"
    :href="propsSrcLink.source"
    target="_blank"
    variant="tonal"
  >
    <img
      v-if="typeSource.icon"
      :src="typeSource.icon"
      width="16"
      class="icon tw-mr-2"
    >
    <span class="tw-text-white">
      {{ typeSource.text }}
    </span>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'


const propsSrcLink = defineProps({
  source: {
    type: String,
    default: ''
  }
})

const typeSource = computed(() => {
  if (/(twitter)/.test(propsSrcLink.source))
  {
    return {
      icon: '/icons/twitter.svg',
      text: 'Twitter'
    }
  }
  if (/(pixiv)/.test(propsSrcLink.source))
  {
    return {
      icon: '/icons/pixiv.svg',
      text: 'Pixiv'
    }
  }
  if (/(patreon)/.test(propsSrcLink.source))
  {
    return {
      icon: '/icons/patreon.svg',
      text: 'Patreon'
    }
  }
  if (/(instagram)/.test(propsSrcLink.source))
  {
    return {
      icon: '/icons/instagram.svg',
      text: 'Instagram'
    }
  }

  try {
    const url = new URL(propsSrcLink.source)

    return {
      text: url.hostname
    }
  } catch (error) {
    return {
      text: propsSrcLink.source,
      invalid: true,
    }
  }

})

</script>

<style scoped>
.icon {
  filter: brightness(0) invert(1);
}
</style>