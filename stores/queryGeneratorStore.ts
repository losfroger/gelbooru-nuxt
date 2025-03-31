import { useQuasar } from 'quasar'
import { Gelbooru } from '~/types/gelbooru'

interface QueryChannelMessage {
  type: 'sync'
  queryStash: string[]
}

export const localStorageQuerySyncKey = 'query-state'
let queryChannel: null | BroadcastChannel = null

export const useQueryGeneratorStore = defineStore('queryGeneratorStore', () => {
  const quasar = useQuasar()
  const settings = useSettingsStore()

  const _queryStash = ref<Set<string>>(new Set())
  const queryStash = computed(() => [..._queryStash.value])

  function pushTag(tag: string) {
    // Check if there's no positive or negative version of the tag
    const isNegativeTag = Gelbooru.NegativeQueryRegex.test(tag)
    if (_queryStash.value.has(isNegativeTag ? `${tag}`.replaceAll('-', '') : `-${tag}`)) {
      quasar.notify({
        message: isNegativeTag ? `${tag} was already added as a positive tag in the query` : `${tag} was already added as a negative tag in the query`,
        group: false,
        multiLine: true,
        color: 'blue-grey-9',
        position: 'bottom-right',
      })

      return
    }

    // Check if the stash size changed to know if it was added or not
    const auxSize = _queryStash.value.size
    _queryStash.value.add(tag)

    if (_queryStash.value.size == auxSize) {
      quasar.notify({
        message: `${tag} was already in the query`,
        group: false,
        color: 'blue-grey-9',
        position: 'bottom-right',
      })
    } else {
      quasar.notify({
        message: `${tag} added to query`,
        group: false,
        type: 'positive',
        position: 'bottom-right',
      })
      syncQueryBroadcastChannel()
    }
  }

  function removeTag(tag: string) {
    const aux = _queryStash.value.delete(tag)
    if (aux) {
      syncQueryBroadcastChannel()
    }
  }

  function clearQuery() {
    _queryStash.value.clear()
  }

  function initQueryBroadcastChannel() {
    try {
      if (import.meta.client && settings.settings.syncQueryBetweenTabs && window.BroadcastChannel) {
        queryChannel = new BroadcastChannel('query-generator-channel')

        const auxQueryLocalStorage = localStorage.getItem(localStorageQuerySyncKey)
        if (auxQueryLocalStorage) {
          const parsedQueryLocalStorage = JSON.parse(auxQueryLocalStorage) as string[]
          _queryStash.value = new Set(parsedQueryLocalStorage)
        }

        queryChannel.onmessage = (event) => {
          const aux = event.data
          if (isQueryChannelMessage(aux)) {
            _queryStash.value = new Set(aux.queryStash)
          }
        }
      }
    } catch (error) {
      console.error('Error while trying to initialize the query broadcast channel', error)
    }
  }

  function closeQueryBroadcastChannel() {
    try {
      if (import.meta.client && queryChannel) {
        queryChannel.close()
        queryChannel = null
      }
    } catch (error) {
      console.error('Error while closing the query broadcast channel', error)
    }
  }

  function syncQueryBroadcastChannel() {
    if (import.meta.client && settings.settings.syncQueryBetweenTabs) {
      localStorage.setItem(localStorageQuerySyncKey, JSON.stringify([..._queryStash.value]))
      queryChannel?.postMessage({ type: 'sync', queryStash: [..._queryStash.value] } as QueryChannelMessage)
    }
  }

  return {
    queryStash,
    pushTag,
    removeTag,
    clearQuery,
    initQueryBroadcastChannel,
    closeQueryBroadcastChannel,
  }
})

function isQueryChannelMessage(obj: unknown): obj is QueryChannelMessage {
  return 'type' in (<QueryChannelMessage>obj)
    && (<QueryChannelMessage>obj).type == 'sync'
    && 'queryStash' in (<QueryChannelMessage>obj)
}