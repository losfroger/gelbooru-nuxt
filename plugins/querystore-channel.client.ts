export default defineNuxtPlugin(() => {
  const userStore = useQueryGeneratorStore()
  userStore.initQueryBroadcastChannel()
})