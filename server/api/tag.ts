import axios_gelbooru from '~/server/axiosGelbooru'
import { GelbooruTag } from '~/types/gelbooru'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const resGel = await axios_gelbooru.get('', {
      params: {
        page: 'dapi',
        q: 'index',
        s: 'tag',
        limit: 10,
        json: 1,
        api_key: event.node.req.headers.api_key,
        user_id: event.node.req.headers.user_id,
        name_pattern: query.name_pattern,
        name: query.name,
        orderby: query.orderby ?? 'count'
      }
    })

    resGel.data.tag.forEach((tag: GelbooruTag) => {
      switch (tag.type) {
        case 0:
          tag.type_string = 'general'
          break
        case 1:
          tag.type_string = 'artist'
          break
        case 3:
          tag.type_string = 'copyright'
          break
        case 4:
          tag.type_string = 'character'
          break
        case 5:
          tag.type_string = 'metadata'
          break
        case 6:
          tag.type_string = 'deprecated'
          break
        default:
          tag.type_string = 'not identified'
          break
      }
    })

    return resGel.data
  } catch (error) {
    console.log(error)
    throw error
  }

})
