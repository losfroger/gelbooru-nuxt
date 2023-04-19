<template>
  <div>
    <span v-if="typeSource.invalid">
      {{ typeSource.text }}
    </span>
    <v-btn
      v-else
      v-bind="$attrs"
      color="accent"
      :disabled="typeSource.invalid"
      :href="propsSrcLink.source"
      target="_blank"
      variant="tonal"
    >
      <div class="tw-flex tw-max-w-full tw-items-center tw-overflow-clip tw-align-middle">
        <img
          v-if="typeSource.icon"
          :src="typeSource.icon"
          width="16"
          class="icon tw-mr-2"
        >
        <span class="tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-text-white">
          {{ typeSource.text }}
        </span>
      </div>
    </v-btn>
  </div>
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
:deep(.v-btn__content){
  display: grid;/* or inline-block */
  max-width: 100%;
}


.icon {
  filter: brightness(0) invert(1);
}
</style>