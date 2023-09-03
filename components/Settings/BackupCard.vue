<template>
  <v-card v-bind="$attrs">
    <v-card-title>
      <v-icon icon="mdi-content-save-all" />
      Backup
    </v-card-title>

    <v-divider />
    <v-card-text class="tw-flex tw-flex-col tw-gap-8">
      <v-form @submit.prevent="downloadFavoritesBackup">
        <v-row>
          <v-col cols="12">
            <h3>Backup favorites into file</h3>
            <p class="description">
              Generate a file with all of the posts you've marked as favorites
            </p>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-radio-group
              v-model="selectDownloadType"
              label="File format"
              inline
              hide-details
              color="primary"
            >
              <div class="tw-flex tw-flex-row tw-gap-2">
                <v-radio
                  label="JSON"
                  value="json"
                />
                <v-radio
                  label="CSV"
                  value="csv"
                />
              </div>
            </v-radio-group>
          </v-col>
          <v-col
            cols="12"
          >
            <v-btn
              type="submit"
              color="accent"
              variant="tonal"
              :loading="loadingFavoritesBackup"
            >
              Download
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-form
        v-model="imageZipFormValid"
        @submit.prevent="downloadImageZip"
      >
        <v-row>
          <v-col cols="12">
            <h3>
              Download images zip from json backup
            </h3>
            <p class="description tw-mb-3">
              Generate a zip file with all the images from the posts included inside the .json file. This may take several minutes and generate a multiple gigabyte file depending on the data. (No videos are included)
            </p>
            <p class="description tw-font-bold">
              It may be necessary to allow popups for the download to work correctly
            </p>
          </v-col>
          <v-col cols="12">
            <v-file-input
              v-model="backupFileZip"
              label="Backup file (.json)"
              variant="underlined"
              accept=".json"
              color="primary"
              :rules="[(v: File[]) => v.length == 1 || 'Please select a backup json file']"
            />
          </v-col>
          <v-col cols="12">
            <v-btn
              type="submit"
              color="accent"
              variant="tonal"
              :loading="loadingBackupImagesZip"
            >
              Download
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/appStore'
import { useAuthStore } from '~/stores/authStore'

import { saveAs } from 'file-saver'
import { GelbooruPost } from '~/types/gelbooru'

const appStore = useAppStore()
const authStore = useAuthStore()

/**
 * BACKUP FAVORITE FILE
 */
const selectDownloadType = ref<'json' | 'csv'>('json')

const loadingFavoritesBackup = ref(false)
async function downloadFavoritesBackup() {

  appStore.addNotification({
    title: 'Starting favorites backup',
    text: 'This may take some time, depending on the amount of favorites'
  })
  loadingFavoritesBackup.value = true

  $fetch<GelbooruPost[]>('/api/backup/favorites')
  .then((result) => {
    const file = new Blob([convertDataToFormat(result)], {type: 'text/plain'})
    saveAs(file, `favorites_backup_${new Date().toISOString().replaceAll(':', '_')}_user_${authStore.user_id}.${selectDownloadType.value}`)
  })
  .catch((err) => {
    appStore.addNotification({
      title: 'Error fetching favorites',
      text: `There was the following error while fetching your favorites backup: ${err}`,
      color: 'error',
      icon: 'mdi-alert-circle-outline'
    })
  })
  .finally(() => loadingFavoritesBackup.value = false)
}

function convertDataToFormat(data: GelbooruPost[]) {
  switch (selectDownloadType.value) {
    case 'csv': {
      let csv = [
        [
          'id',
          'score',
          'rating',
          'source',
          'preview url',
          'sample url',
          'file url',
          'tags',
          'has notes',
          'has comments',
          'has children',
          'is video'
        ],
      ]

      const auxCsv = data.map((post) => [
        String(post.id),
        String(post.score),
        post.rating,
        post.source,
        post.preview_url,
        post.sample_url,
        post.file_url,
        post.tags.replaceAll(',', ' '),
        String(post.has_note_bool),
        String(post.has_comments),
        String(post.has_children),
        String(post.is_video),
      ])

      csv = csv.concat(auxCsv)

      const resCsv = csv.map((row) => row.join(','))
      return resCsv.join('\r\n')
    }
    default:
      return JSON.stringify(data)
  }
}

/**
 * BACKUP IMAGE FILES
 */
const imageZipFormValid = ref(false)

const loadingBackupImagesZip = ref(false)
const backupFileZip = ref<File[] | undefined>(undefined)


async function downloadImageZip() {
  if (!imageZipFormValid.value || !backupFileZip.value) {
    return
  }

  loadingBackupImagesZip.value = true

  const formData = new FormData()
  formData.append('file', backupFileZip.value[0])

  $fetch('/api/backup/postsZip', {
    method: 'POST',
    body: formData,
    responseType: 'blob',
  })
  .then((response: any) => {
    const href = window.URL.createObjectURL(response)

    const anchorElement = document.createElement('a')

    anchorElement.href = href

    const fileName = `images_backup_${new Date().toISOString().replaceAll(':', '_')}_user_${authStore.user_id}.zip`
    anchorElement.download = fileName

    document.body.appendChild(anchorElement)
    anchorElement.click()

    document.body.removeChild(anchorElement)
    window.URL.revokeObjectURL(href)

    appStore.addNotification({
      title: 'File downloaded',
      text: 'The file has been downloaded succesfully',
      timeout: -1,
    })
  })
  .catch((err) => {
    console.log(err)
    appStore.addNotification({
      title: 'Error fetching favorites',
      text: `There was the following error while fetching your favorites backup: ${err}`,
      color: 'error',
      icon: 'mdi-alert-circle-outline'
    })
  })
  .finally(() => loadingBackupImagesZip.value = false)

}

</script>

<style scoped>

h3 {
  @apply tw-border-0 tw-border-b-2 tw-border-solid tw-border-neutral-700 tw-border-opacity-30 tw-pb-1 tw-mb-1
}

.description {
  @apply tw-text-xs tw-opacity-70
}

</style>