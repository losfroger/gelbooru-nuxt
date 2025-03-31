import { convertGelbooruPostReqQuery_to_GelbooruPostReq, getPosts, getPostsInCachedChunks } from '~/server/postUtils'
import type { UserCredentials } from '~/types/auth-types'
import type { Gelbooru } from '~/types/gelbooru'


export default defineEventHandler(async (event) => {
  try {
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

    let postsData: Gelbooru.PostRes | undefined = undefined
    if (import.meta.env.NUXT_CACHE_ENABLED == 'true') {
      console.log('Getting chunked posts')
      postsData = await getPostsInCachedChunks(
        userCredentials.api_key,
        userCredentials.user_id,
        query,
        userSettingsCookie
      )
    } else {
      postsData = await getPosts(
        userCredentials.api_key,
        userCredentials.user_id,
        query,
        userSettingsCookie
      )
    }


    if (!postsData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No posts were found with that criteria',
      })
    }

    return postsData
  } catch (error) {
    console.error(error)
    return error
  }
})
