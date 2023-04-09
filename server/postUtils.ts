import { GelbooruPost, GelbooruPostReq, GelbooruPostRes } from '~/types/gelbooru'

import axios_gelbooru from '~/server/axiosGelbooru'
import he from 'he'

export async function getPosts(apiKey: string, userId: string, params: GelbooruPostReq) {
  try {
    console.log(params)

    const resGel = await axios_gelbooru.get<GelbooruPostRes>('', {
      params: {
        page: 'dapi',
        q: 'index',
        s: 'post',
        json: 1,
        limit: params.limit ?? 25,
        api_key: apiKey,
        user_id: userId,
        pid: params.pid,
        tags: params.tags?.split(',')?.join(' '),
      }
    })

    console.log('Response', resGel.data)

    resGel.data.post.forEach((post) => {
      post = convertPost(post)
    })

    return resGel.data

  } catch (error) {
    console.log('Error!', error)
    return undefined
  }
}


const videoTags = ['animated', 'video']
export function convertPost(post: GelbooruPost) {
  post.created_at_date = new Date(post.created_at)

  post.tags_array = he.decode(post.tags).split(' ')
  post.source_array = post.source.split('|').map((src) => src.trim())

  post.has_note_bool = post.has_notes === 'true'
  post.has_comments_bool = post.has_comments === 'true'
  post.has_children_bool = post.has_children === 'true'

  post.is_video = post.tags_array.some((tag) => videoTags.includes(tag))
  post.is_3d = post.tags_array.includes('3d')
  post.is_irl = post.tags_array.includes('photo_(medium)')
  post.is_sound = post.tags_array.includes('sound')

  return post
}