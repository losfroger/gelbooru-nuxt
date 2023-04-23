import axios_gelbooru from '~/server/axiosGelbooru'
import { GelbooruTag, GelbooruTagRes, GelbooruTagReq, NegativeQueryRegex, FuzzyQueryRegex } from '~/types/gelbooru'

import he from 'he'

export default defineEventHandler(async (event) => {
  const tagQuery: GelbooruTagReq = getQuery(event)

  let negativeQuery = false
  let fuzzyQuery = false
  if (tagQuery.name_pattern) {
    // Negative query
    if (NegativeQueryRegex.test(tagQuery.name_pattern)) {
      negativeQuery = true
      console.log('Negative query', tagQuery.name_pattern)

      tagQuery.name_pattern = tagQuery.name_pattern.replaceAll('-', '')
    }

    // Fuzy query
    else if (FuzzyQueryRegex.test(tagQuery.name_pattern)) {
      fuzzyQuery = true
      console.log('Fuzzy query', tagQuery.name_pattern)

      tagQuery.name_pattern = tagQuery.name_pattern.replaceAll('~', '')
    }

    // If has wildcard
    if (tagQuery.name_pattern.includes('*')) {
      tagQuery.name_pattern = tagQuery.name_pattern.replaceAll('*', '%')
    }

    // Else, use %name_pattern%
    else {
      tagQuery.name_pattern = `%${tagQuery.name_pattern}%`
    }
  }

  const resGel = await axios_gelbooru.get<GelbooruTagRes>('', {
    params: {
      page: 'dapi',
      q: 'index',
      s: 'tag',
      limit: tagQuery.limit ?? 15,
      json: 1,
      api_key: event.node.req.headers.api_key,
      user_id: event.node.req.headers.user_id,
      name_pattern: tagQuery.name_pattern,
      name: tagQuery.name,
      names: tagQuery.names,
      orderby: tagQuery.orderby ?? 'count',
      order: tagQuery.order ?? 'DESC'
    }
  })

  console.debug(tagQuery.name_pattern, resGel.data['@attributes'])

  if (!resGel.data.tag) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No tags were found with that criteria'
    })
  }

  resGel.data.tag.forEach((tag: GelbooruTag) => {
    tag.name = he.decode(tag.name)
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

    if (fuzzyQuery) {
      tag.name = `${tag.name}~`
    } else if (negativeQuery) {
      tag.name = `-${tag.name}`
    }

  })

  return resGel.data
})
