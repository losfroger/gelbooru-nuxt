import type { GelbooruPostRes } from '~/types/gelbooru'

import axios_gelbooru from '~/server/axiosGelbooru'
import type { UserCredentials } from '~/types/auth-types'

export default defineEventHandler(async (event) => {

  const userCredentialsCookie = getCookie(event, 'user-credentials')
  if (!userCredentialsCookie) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User needs to be logged in',
    })
  }
  const userCredentials: UserCredentials = JSON.parse(userCredentialsCookie)

  const resGel = await axios_gelbooru.get<GelbooruPostRes>('', {
    params: {
      page: 'dapi',
      q: 'index',
      s: 'post',
      json: 1,
      limit: 1,
      api_key: userCredentials.api_key,
      user_id: userCredentials.user_id,
    },
    headers: {
      user_credentials: JSON.stringify({ userCredentials }),
    },
  })

  return resGel.data['@attributes'].count
})
