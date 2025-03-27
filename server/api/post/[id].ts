import type { GelbooruPostReq, GelbooruPostWithTags, GelbooruTag } from '~/types/gelbooru'
import { getPosts } from '~/server/postUtils'
import type { UserCredentials } from '~/types/auth-types'
import cacheClient from '../../db/cache'


export default defineEventHandler(async (event): Promise<GelbooruPostWithTags> => {
  try {

    // Get id
    const auxId = parseInt(event.context.params?.id ?? '-1')
    if (!auxId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No id provided',
      })
    }

    const query: GelbooruPostReq = {
      limit: 1,
      id: auxId,
      pid: 0,
    }

    const auxCookies = getCookie(event, 'user-credentials')
    if (!auxCookies) {
      throw createError({
        statusCode: 403,
        statusMessage: 'User needs to be logged in',
      })
    }

    const cookies: UserCredentials = JSON.parse(auxCookies)

    const auxCachePostDetails = await cacheClient.getKeyJson<GelbooruPostWithTags>(`posts:details:${auxId}`)
    if (auxCachePostDetails) {
      return auxCachePostDetails.data
    }

    const postsData = await getPosts(
      cookies.api_key,
      cookies.user_id,
      query,
      undefined,
      true,
      false
    )

    if (!postsData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No posts were found with that criteria',
      })
    }

    const postDetails = postsData.post[0]

    try {
      // Divide tags array in 100 sized chunks
      const chunk_size = 100
      const divided_tag_array = postDetails.tags_array
        .map((e, i) => i % chunk_size === 0 ? postDetails.tags_array.slice(i, i + chunk_size) : null)
        .filter((e) => e)

      let tags: GelbooruTag[] = []
      for (const tags_array of divided_tag_array) {
        const aux_tags = await $fetch('/api/tag', {
          params: {
            limit: 100,
            names: tags_array?.join(' '),
            orderby: 'name',
            order: 'ASC',
          },
        })

        tags = tags.concat(aux_tags?.tag)
      }

      const auxFinalPostBodyRes = { ...postDetails, fetched_tags: tags }
      await cacheClient.setKeyJson(`posts:details:${auxId}`, auxFinalPostBodyRes, 1200) // Cache for 20 minutes
      return auxFinalPostBodyRes
    } catch (error) {
      console.error(error)
      return postDetails
    }

  } catch (error) {
    console.log(error)
    throw error
  }
})
