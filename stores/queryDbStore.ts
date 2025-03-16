import { openDB, type IDBPDatabase } from 'idb'
import type { QueryUserDB } from '~/types/queryUserDb'

export const useQueryDBStore = defineStore('queryDBStore', () => {

  const authStore = useAuthStore()

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

    return db?.put('saved-queries', queryToSaveWithUserId)
  }

  function deleteSavedQuery(id: number) {
    return db?.delete('saved-queries', id)
  }

  async function getSavedQueryById(id: number) {
    const aux = await db?.get('saved-queries', id)
    if (aux?.user == authStore.user_id) {
      return aux
    } else {
      return undefined
    }
  }

  async function getAllSavedQueries() {
    const userId = authStore.user_id ?? ''

    console.log('Getting saved queries of user', userId)

    const store = db?.transaction('saved-queries').objectStore('saved-queries')
    const index = store?.index('by-user')

    return await index?.getAll(userId.toString())
  }

  return {
    initDb,
    pushQuery,
    deleteSavedQuery,
    getSavedQueryById,
    getAllSavedQueries,
  }
})