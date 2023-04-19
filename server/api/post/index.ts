import { getPosts } from '~/server/postUtils'
import { UserCredentials } from '~/types/auth-types'
import { GelbooruPostReq } from '~/types/gelbooru'


export default defineEventHandler(async (event) => {
  console.log(event.path)

  const query: GelbooruPostReq = getQuery(event)

  const userCredentialsCookie = getCookie(event, 'user-credentials')
  if (!userCredentialsCookie) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User needs to be logged in'
    })
  }
  const userCredentials: UserCredentials = JSON.parse(userCredentialsCookie)

  const userSettingsCookie = getCookie(event, 'settings')

  const postsData = await getPosts(
    userCredentials.api_key,
    userCredentials.user_id,
    query,
    userSettingsCookie,
  )

  if (!postsData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No posts were found with that criteria'
    })
  }

  return postsData
})
