import { GelbooruPostReq } from '~/types/gelbooru'
import { getPosts } from '~/server/postUtils'
import { UserCredentials } from '~/types/auth-types'


export default defineEventHandler(async (event) => {
  try {
    console.log(event.path)

    const query: GelbooruPostReq = getQuery(event)

    const auxCookies = getCookie(event, 'user-credentials')
    if (!auxCookies) {
      setResponseStatus(event, 400, 'User needs to be logged in')
      return
    }

    const cookies: UserCredentials = JSON.parse(auxCookies)
    query.tags = `fav:${cookies.user_id},${query.tags ?? ''}`

    const postsData = await getPosts(cookies.api_key, cookies.user_id, query)

    if (!postsData) {
      setResponseStatus(event, 404, 'No posts were found with that criteria')
      return
    }

    return postsData
  } catch (error) {
    console.log(error)
    throw error
  }
})
