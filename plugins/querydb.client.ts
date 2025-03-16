export default defineNuxtPlugin(() => {
  const queryDbStore = useQueryDBStore()
  queryDbStore.initDb()
})