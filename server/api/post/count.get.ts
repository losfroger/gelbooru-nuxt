import { GelbooruPostRes } from '~/types/gelbooru'

import axios_gelbooru from '~/server/axiosGelbooru'

export default defineEventHandler(async (event) => {
  const resGel = await axios_gelbooru.get<GelbooruPostRes>('', {
    params: {
      page: 'dapi',
      q: 'index',
      s: 'post',
      json: 1,
      limit: 1,
    }
  })

  return resGel.data['@attributes'].count
})
