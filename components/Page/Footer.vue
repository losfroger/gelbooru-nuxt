<template>
  <QFooter class="soft-shadow tw-bg-neutral-950 tw-px-4 tw-py-6 tw-text-white">
    <div class="tw-flex tw-flex-col tw-items-center tw-gap-3">
      <!-- <ClientOnly>
        <PageDarkModeToggle label="Dark mode" />
      </ClientOnly> -->
      <QBtn
        icon="mdi-github"
        label="See source code"
        href="https://github.com/losfroger/gelbooru-nuxt"
        target="_blank"
        flat
      />
      <QSeparator class="tw-my-2 tw-w-full tw-bg-neutral-700/40" />
      <p class="tw-text-center">
        This site is an unofficial third party client for Gelbooru.
      </p>
      <code class="tw-opacity-25">
        {{ useRuntimeConfig().public.version }}
      </code>
    </div>
  </QFooter>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>