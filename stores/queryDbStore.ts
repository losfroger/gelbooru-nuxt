import { openDB, type IDBPDatabase } from 'idb'
import type { QueryUserDB } from '~/types/queryUserDb'
import { computedAsync } from '@vueuse/core'

export const useQueryDBStore = defineStore('queryDBStore', () => {

  const authStore = useAuthStore()
  /**
   * Hack to get the `computedAsync` to refresh
   */
  const refresh = ref(0)

  let db: undefined | IDBPDatabase<QueryUserDB.DB>
  async function initDb() {
    db = await openDB<QueryUserDB.DB>('query-user-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('saved-queries')) {
          const store = db.createObjectStore('saved-queries', {
            autoIncrement: true,
            keyPath: 'id',
          })

          store.createIndex('by-name', 'name')
          store.createIndex('by-user', 'user')
        }
      },
    })
  }

  function pushQuery(queryToSave: QueryUserDB.QueryToSave) {
    const queryToSaveWithUserId: QueryUserDB.SavedQuery = {
      user: authStore.user_id?.toString() ?? '',
      createdAt: new Date().toISOString(),
      ...queryToSave,
    }

    refreshSavedQueries()
    return db?.put('saved-queries', queryToSaveWithUserId)
  }

  function deleteSavedQuery(id: string) {
    refreshSavedQueries()
    return db?.delete('saved-queries', id)
  }

  async function getSavedQueryById(id: string) {
    const aux = await db?.get('saved-queries', id)
    if (aux?.user == authStore.user_id) {
      return aux
    } else {
      return undefined
    }
  }

  function getAllSavedQueries() {
    const userId = authStore.user_id ?? ''

    console.log('Getting saved queries of user', userId)

    const store = db?.transaction('saved-queries').objectStore('saved-queries')
    const index = store?.index('by-user')

    return index?.getAll(userId.toString())
  }

  const userSavedQueries = computedAsync(
    async () => {
      const _aux = refresh.value > 0
      return await getAllSavedQueries()
    },
    []
  )

  function refreshSavedQueries() {
    refresh.value++
  }

  return {
    initDb,
    pushQuery,
    deleteSavedQuery,
    getSavedQueryById,
    getAllSavedQueries,
    userSavedQueries,
    refreshSavedQueries,
  }
})