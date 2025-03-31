import type { Gelbooru } from '~/types/gelbooru'
import { convertGelbooruPostReqQuery_to_GelbooruPostReq, getPosts } from '~/server/postUtils'
import type { UserCredentials } from '~/types/auth-types'

export default defineEventHandler(async (event): Promise<Gelbooru.PostRes> => {
  console.log(event.path)

  const reqQuery: Gelbooru.PostReqQuery = getQuery(event)
  const query = convertGelbooruPostReqQuery_to_GelbooruPostReq(reqQuery)

  const userCredentialsCookie = getCookie(event, 'user-credentials')
  if (!userCredentialsCookie) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User needs to be logged in',
    })
  }
  const userCredentials: UserCredentials = JSON.parse(userCredentialsCookie)

  const userSettingsCookie = getCookie(event, 'settings')

  query.tags = `fav:${userCredentials.user_id},${query.tags ?? ''}`

  const postsData = await getPosts(
    userCredentials.api_key,
    userCredentials.user_id,
    query,
    userSettingsCookie,
    {
      saveToCache: false,
      cachePrefix: 'favorites:',
    }
  )

  if (!postsData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No posts were found with that criteria',
    })
  }

  return postsData
})
