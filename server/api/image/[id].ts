import axios_gelbooru from '~/server/axiosGelbooru'
import convertPost from '~/server/convertPost'
import type { UserCredentials } from '~/types/auth-types'

export default defineEventHandler(async (event) => {
  try {

    const userCredentialsCookie = getCookie(event, 'user-credentials') || event.node.req.headers?.user_credentials?.toString()
    if (!userCredentialsCookie) {
      throw createError({
        statusCode: 403,
        statusMessage: 'User needs to be logged in',
      })
    }

    const userCredentials: UserCredentials = JSON.parse(userCredentialsCookie)

    const resGel = await axios_gelbooru.get('', {
      params: {
        page: 'dapi',
        q: 'index',
        s: 'post',
        json: 1,
        limit: 1,
        id: event.context.params?.id,
        api_key: userCredentials.api_key,
        user_id: userCredentials.user_id,
      },
    })

    if (!('post' in resGel.data) || resGel.data.post.length < 1) {
      setResponseStatus(event, 404, 'No posts were found with that criteria')
      return
    }

    const auxPost = convertPost(resGel.data.post[0])

    console.log('Image: ', auxPost.sample_url ? auxPost.sample_url : auxPost.file_url)
    const resGelImg = await axios_gelbooru.get(auxPost.sample_url ? auxPost.sample_url : auxPost.file_url, { responseType: 'arraybuffer' })

    setHeaders(event, { 'content-type': resGelImg.headers['content-type']?.toString() ?? 'image/jpeg' })

    return resGelImg.data
  } catch (error) {
    console.log(error)
    throw error
  }
})
