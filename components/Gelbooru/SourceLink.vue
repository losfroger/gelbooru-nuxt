<template>
  <QBtn
    v-bind="props"
    :href="props.source"
    target="_blank"
  >
    <QTooltip v-if="typeSource.tooltip">
      {{ typeSource.tooltip }}
    </QTooltip>
    <div class="tw-flex tw-flex-row tw-gap-2">
      <QIcon v-if="typeSource.icon">
        <svg>
          <use :xlink:href="`/icons/source-icons.svg#${typeSource.icon}`" />
        </svg>
      </QIcon>
      <QIcon v-else name="mdi-link" />
      {{ typeSource.text }}
    </div>
  </QBtn>
</template>

<script setup lang="ts">
import type { QBtnProps } from 'quasar'


interface GelbooruSourceLinkProps extends Omit<QBtnProps, 'href' | 'target'> {
  source: string,
}

const props = withDefaults(defineProps<GelbooruSourceLinkProps>(), {
  color: 'accent',
})


const typeSource = computed(() => {
  if (/(twitter)/.test(props.source))
  {
    return {
      icon: 'twitter',
      text: 'Twitter',
    }
  }
  if (/(pixiv)/.test(props.source))
  {
    return {
      icon: 'pixiv',
      text: 'Pixiv',
    }
  }
  if (/(patreon)/.test(props.source))
  {
    return {
      icon: 'patreon',
      text: 'Patreon',
    }
  }
  if (/(instagram)/.test(props.source))
  {
    return {
      icon: 'instagram',
      text: 'Instagram',
    }
  }

  try {
    const url = new URL(props.source)
    return {
      text: 'Original',
      tooltip: url.hostname,
    }
  } catch (error) {
    return {
      text: 'Original',
    }
  }

})

</script>

<style scoped>

.icon {
  filter: brightness(0) invert(1);
}

</style>