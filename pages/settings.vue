<template>
  <div class="tw-flex tw-min-w-[40vw] tw-max-w-xl tw-flex-col tw-gap-8">
    <SettingsMySettingsCard class="settings-card" />
    <SettingsBackupCard class="settings-card" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Settings'
})
</script>

<style lang="scss">
.settings-card {
  @apply tw-shadow-md;

  .v-card-title {
    @apply tw-flex tw-flex-row tw-items-start tw-gap-4 tw-pt-4;

    .v-icon {
      @apply tw-hidden tw-w-8 lg:tw-flex;
    }
  }

  .v-divider {
    @apply tw-my-4;
  }
}
</style>