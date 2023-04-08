import axios_gelbooru from '~/server/axiosGelbooru'
import { GelbooruPost } from '~/types/gelbooru'

import convertPost from '~/server/convertPost'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const resGel = await axios_gelbooru.get('', {
      params: {
        page: 'dapi',
        q: 'index',
        s: 'post',
        json: 1,
        limit: query.limit ?? 25,
        api_key: event.node.req.headers.apiKey,
        user_id: event.node.req.headers.userId,
        pid: query.pid,
        tags: query.tags,
      }
    })

    if (!('post' in resGel.data)) {
      setResponseStatus(event, 404, 'No posts were found with that criteria')
      return
    }

    resGel.data.post.forEach((post: GelbooruPost) => {
      post = convertPost(post)
    })

    console.log('Data', resGel.data)

    return resGel.data
  } catch (error) {
    console.log(error)
    throw error
  }
})
