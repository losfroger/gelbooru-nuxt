import { GelbooruPostReq, GelbooruPostWithTags } from '~/types/gelbooru'
import { getPosts } from '~/server/postUtils'
import { UserCredentials } from '~/types/auth-types'


export default defineEventHandler(async (event): Promise<GelbooruPostWithTags> => {
  try {
    console.log(event.path)


    const query: GelbooruPostReq = getQuery(event)
    query.limit = 1

    // Get id
    const auxId = parseInt(event.context.params?.id ?? '-1')
    if (!auxId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No id provided'
      })
    }
    query.id = auxId
    query.pid = 0

    const auxCookies = getCookie(event, 'user-credentials')
    if (!auxCookies) {
      throw createError({
        statusCode: 403,
        statusMessage: 'User needs to be logged in'
      })
    }

    const cookies: UserCredentials = JSON.parse(auxCookies)

    const postsData = await getPosts(
      cookies.api_key,
      cookies.user_id,
      query,
      undefined,
      true
    )

    if (!postsData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No posts were found with that criteria'
      })
    }

    const postDetails = postsData.post[0]

    try {
      const tags = await $fetch('/api/tag', {
        params: {
          limit: 100,
          names: postDetails.tags,
          orderby: 'name',
          order: 'ASC',
        }
      })
      console.log('Res post details', postsData)

      return { ...postDetails, fetched_tags: tags?.tag }
    } catch (error) {

      return postDetails
    }

  } catch (error) {
    console.log(error)
    throw error
  }
})
