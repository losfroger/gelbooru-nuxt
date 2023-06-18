import { GelbooruComment } from '~/types/gelbooru'
import axios_gelbooru from '~/server/axiosGelbooru'
import { parseStringPromise } from 'xml2js'

interface XmlComments {
  comments: {
    $: {
      type: string
    },
    comment: XmlComment[]
  }
}

interface XmlComment {
  $: {
    created_at: string,
    post_id: string,
    body: string,
    creator: string,
    id: string,
    creator_id: string,
  }
}

export default defineEventHandler(async (event): Promise<GelbooruComment[]> => {
  try {
    console.log('Comments from post', event.context.params?.id)
    const resGel = await axios_gelbooru.get<string>('', {
      params: {
        page: 'dapi',
        q: 'index',
        s: 'comment',
        post_id: event.context.params?.id,
      },
      responseType: 'document',
    })
    .then((result) => {
      console.log(result)
      return result.data
    })
    .catch((err) => {
      console.log(err)
      return ''
    })

    const xmlComments: XmlComments = await parseStringPromise(
      resGel
        .replace('<?xml version="1.0" encoding="UTF-8"?>', '')
        .replaceAll('\r\n', '\n')
    )

    if (xmlComments.comments.$.type == 'array') {
      const resComments: GelbooruComment[] = xmlComments.comments.comment
        .map((comment): GelbooruComment => ({
          id: parseInt(comment.$.id),
          post_id: parseInt(comment.$.post_id),
          body: comment.$.body,
          created_at: new Date(comment.$.created_at),
          creator: parseInt(comment.$.creator),
          creator_id: comment.$.creator_id ? parseInt(comment.$.creator_id) : undefined,
        }))
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

      return resComments
    }

    throw createError({
      statusCode: 400,
      statusMessage: 'Couldn\'t parse the comments'
    })

  } catch (error) {
    console.log(error)
    throw error
  }
})
