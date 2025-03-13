import { useQuasar } from 'quasar'
import { NegativeQueryRegex } from '~/types/gelbooru'

export const useQueryGeneratorStore = defineStore('queryGeneratorStore', () => {

  const quasar = useQuasar()

  const _queryStash = ref<Set<string>>(new Set())
  const queryStash = computed(() => [..._queryStash.value])

  function pushTag(tag: string) {

    // Check if there's no positive or negative version of the tag
    const isNegativeTag = NegativeQueryRegex.test(tag)
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
        color: 'positive',
        icon: 'mdi-check',
        position: 'bottom-right',
      })
    }
  }

  function removeTag(tag: string) {
    const aux = _queryStash.value.delete(tag)
    if (aux) {
      quasar.notify({
        message: `${tag} removed from the query`,
        group: false,
        color: 'negative',
        icon: 'mdi-close',
        position: 'bottom-right',
      })
    }
  }

  function clearQuery() {
    _queryStash.value.clear()
  }

  return {
    queryStash,
    pushTag,
    removeTag,
    clearQuery,
  }
})