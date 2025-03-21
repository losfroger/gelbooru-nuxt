<template>
  <QCard flat>
    <QCardSection>
      <h1 class="text-h5">
        My settings
      </h1>
    </QCardSection>
    <QSeparator />
    <QForm @submit="onSaveUserSettings">
      <QCardSection class="tw-flex tw-flex-col tw-gap-8">
        <div class="q-field--dark">
          <QToggle v-model="settingsForm.hideNsfwImages" label="Blur NSFW images" />
          <p class="q-field__bottom q-field__messages">
            Will blur NSFW images until hovered over
          </p>
        </div>
        <div class="q-field--dark">
          <QToggle v-model="settingsForm.syncQueryBetweenTabs" label="Sync query between tabs" />
          <p class="q-field__bottom q-field__messages">
            This will sync your query between all tabs (you might need to reload the tab)
          </p>
        </div>
        <GelbooruSearchBarSelect
          v-model="settingsForm.filteredTags"
          filled
          hide-default-items
          label="Tag blacklist"
          icon="mdi-cancel"
          hint="Any post containing a blacklisted tag won't show up in your search results."
        />
        <QInput
          v-model.number="settingsForm.numberPostsPerPage"
          label="Number of posts per page"
          filled
          type="number"
          :rules="[(v) => v > 0 || 'Please put a number greater than 0', (v) => v < 100 || 'Please put a number greater than 100']"
        />
      </QCardSection>
      <QCardSection class="tw-flex tw-flex-row tw-items-center tw-justify-end tw-gap-4">
        <QBtn
          flat
          label="Reset"
          color="grey"
          @click="onResetUserSettings"
        />
        <QBtn
          label="Save"
          color="primary"
          type="submit"
        />
      </QCardSection>
    </QForm>
  </QCard>
</template>

<script setup lang="ts">
import type { UserSettings } from '~/stores/settingsStore'

const quasar = useQuasar()
const settingsStore = useSettingsStore()

const settingsForm = ref<UserSettings>({
  hideNsfwImages: settingsStore.settings.hideNsfwImages,
  filteredTags: settingsStore.settings.filteredTags,
  numberPostsPerPage: settingsStore.settings.numberPostsPerPage,
  syncQueryBetweenTabs: settingsStore.settings.syncQueryBetweenTabs,
})

function onSaveUserSettings() {
  try {
    settingsStore.settings = settingsForm.value
    quasar.notify({
      caption: 'Settings saved!',
      color: 'positive',
    })
  } catch (error) {
    console.error(error)
    quasar.notify({
      caption: 'There was a problem while saving your settings',
      color: 'negative',
    })
  }
}

function onResetUserSettings() {
  quasar.dialog({
    title: 'Are you sure you want to erase your settings?',
    ok: {
      label: 'Accept',
      flat: true,
      color: 'primary',
    },
    cancel: {
      flat: true,
      color: 'grey',
    },
  })
  .onOk(() => {
    settingsStore.resetSettings()
    settingsForm.value = settingsStore.settings
    quasar.notify({
      caption: 'Settings correctly reset!',
      color: 'positive',
    })
  })
}

</script>

<style scoped>

</style>