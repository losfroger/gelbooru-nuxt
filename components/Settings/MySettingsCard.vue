<template>
  <v-card v-bind="$attrs">
    <v-card-title>
      <v-icon
        icon="mdi-cog"
      />
      My settings
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-form
        v-model="validSettingsForm"
        class="tw-flex tw-flex-col tw-gap-8 tw-pb-8"
      >
        <v-switch
          v-model="auxSettings.hideNsfwImages"
          inset
          label="Blur NSFW images"
          color="primary"
          hint="Will blur NSFW images until hovered over."
          persistent-hint
        />
        <GelbooruTagSelector
          v-model="auxSettings.filteredTags"
          label="Tag Blacklist"
          prepend-inner-icon="mdi-cancel"
          :clearable="false"
          hide-default-items
          hint="Any post containing a blacklisted tag will be ignored."
          persistent-hint
        />
        <v-text-field
          v-model="auxNumberOfPostsPerPage"
          label="Number of posts per page"
          color="primary"
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          required
          min="1"
          step="1"
          :rules="[v => parseInt(v) > 0 || 'Please enter a valid number']"
          @input="(e: Event) => {
            // Only allow positive integer numbers
            let aux = auxNumberOfPostsPerPage.toString().replace(/[^0-9.]/g, '')
            aux = aux.replace(/(\..*)\./g, '$1')
            auxNumberOfPostsPerPage = isFinite(parseInt(aux)) ? Math.max(1, parseInt(aux)).toString() : ''
          }"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="tw-flex tw-flex-col tw-items-start tw-gap-2 md:tw-flex-row md:tw-items-center">
      <v-fade-transition>
        <div
          v-if="changes"
          class="text-caption tw-flex tw-flex-row tw-gap-2 tw-text-error"
        >
          <v-icon icon="mdi-alert-circle-outline" />
          Changes have been made, please save to avoid losing them.
        </div>
      </v-fade-transition>
      <div class="tw-flex tw-flex-row tw-gap-2 md:tw-ml-auto">
        <v-btn
          color="grey"
          @click="resetSettings"
        >
          Reset
        </v-btn>
        <v-btn
          color="primary"
          @click="saveSettings"
        >
          Save
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defaultUserSettings, useSettingsStore, type UserSettings } from '~/stores/settingsStore'

const settingsStore = useSettingsStore()
const auxSettings = ref<UserSettings>({...settingsStore.settings})
const auxNumberOfPostsPerPage = ref(settingsStore.settings.numberPostsPerPage.toString())

const changes = ref(false)

watch(auxSettings, () => changes.value = true, {deep: true})
watch(auxNumberOfPostsPerPage, () => changes.value = true)

const validSettingsForm = ref(false)

function saveSettings() {
  if (!validSettingsForm.value) {
    return
  }

  console.log('Saved settings!')

  settingsStore.settings.filteredTags = auxSettings.value.filteredTags
  settingsStore.settings.hideNsfwImages = auxSettings.value.hideNsfwImages
  settingsStore.settings.numberPostsPerPage = parseInt(auxNumberOfPostsPerPage.value)

  changes.value = false
}

function resetSettings() {
  auxSettings.value = {...defaultUserSettings}
  changes.value = false
}
</script>

<style scoped>

</style>