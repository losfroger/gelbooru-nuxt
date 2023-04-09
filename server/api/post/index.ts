import { getPosts } from '~/server/postUtils'
import { UserCredentials } from '~/types/auth-types'


export default defineEventHandler(async (event) => {
  try {
    console.log(event.path)

    const query = getQuery(event)
    const cookies: UserCredentials = JSON.parse(getCookie(event, 'user-credentials') ?? '')

    console.log('Cookies!')

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
