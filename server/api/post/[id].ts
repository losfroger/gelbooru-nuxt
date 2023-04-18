import { GelbooruPostReq } from '~/types/gelbooru'
import { getPosts } from '~/server/postUtils'
import { UserCredentials } from '~/types/auth-types'


export default defineEventHandler(async (event) => {
  try {
    console.log(event.path)


    const query: GelbooruPostReq = getQuery(event)
    query.limit = 1

    // Get id
    const auxId = parseInt(event.context.params?.id ?? '-1')
    if (!auxId) {
      setResponseStatus(event, 400, 'No id provided')
      return
    }
    query.id = auxId

    const auxCookies = getCookie(event, 'user-credentials')
    if (!auxCookies) {
      setResponseStatus(event, 400, 'User needs to be logged in')
      return
    }

    const cookies: UserCredentials = JSON.parse(auxCookies)

    const postsData = await getPosts(cookies.api_key, cookies.user_id, query)

    if (!postsData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No posts were found with that criteria'
      })
    }

    console.log('Res post details', postsData)

    return postsData.post[0]
  } catch (error) {
    console.log(error)
    throw error
  }
})
