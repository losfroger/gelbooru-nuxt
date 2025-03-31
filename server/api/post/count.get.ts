import type { Gelbooru } from '~/types/gelbooru'

import axios_gelbooru from '~/server/axiosGelbooru'
import cacheClient from '~/server/db/cache'

interface GelbooruTotal {
  total: number
}

export default defineEventHandler(async () => {
  try {

    const cachedTotal = await cacheClient.getKeyJson<GelbooruTotal>('posts:total')
    if (cachedTotal) {
      return cachedTotal.data.total
    }

    const resGel = await axios_gelbooru.get<Gelbooru.PostRes>('', {
      params: {
        page: 'dapi',
        q: 'index',
        s: 'post',
        json: 1,
        limit: 1,
      },
    })

    cacheClient.setKeyJson('posts:total', { total: resGel.data['@attributes'].count }, 120)

    return resGel.data['@attributes'].count
  } catch (error) {
    console.error(error)
    throw error
  }
})
