<template>
  <v-card v-bind="$attrs">
    <v-card-title>
      <v-icon icon="mdi-content-save-all" />
      Backup
    </v-card-title>

    <v-divider />
    <v-card-text>
      <h3>Backup favorites into file</h3>
      <v-radio-group
        v-model="selectDownloadType"
        label="File format"
        inline
        hide-details
        color="primary"
      >
        <v-radio
          label="JSON"
          value="json"
        />
        <v-radio
          label="CSV"
          value="csv"
        />
      </v-radio-group>
      <v-btn
        color="accent"
        variant="tonal"
        prepend-icon="mdi-heart"
        :loading="loadingFavoritesBackup"
        @click="downloadFavoritesBackup"
      >
        Download favorites backup
      </v-btn>
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

// Backup favorites file
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
    saveAs(file, `favorites_backup_${new Date().toDateString()}_user_${authStore.user_id}.${selectDownloadType.value}`)
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


</script>

<style scoped>
h3 {
  @apply tw-mb-6;
}

</style>