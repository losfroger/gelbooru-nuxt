import cacheClient from '../db/cache'

export default defineEventHandler(async () => {
  if (import.meta.env.NUXT_CACHE_ENABLED == 'true' && !cacheClient.isLoaded) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error no cache',
    })
  }

  cacheClient.setKeyJson('health', { healthy: true }, 0)

  return 'OK'
})
