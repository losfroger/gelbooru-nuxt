import type { GelbooruPost, GelbooruPostReq, GelbooruPostRes } from '~/types/gelbooru'
import { DefaultFilteredTags } from '~/types/gelbooru'

import axios_gelbooru from '~/server/axiosGelbooru'
import he from 'he'
import type { UserSettings } from '~/stores/settingsStore'

export async function getPosts(apiKey: string, userId: string, params: GelbooruPostReq, userSettingsString: string | undefined, noTags = false): Promise<GelbooruPostRes | undefined> {
  try {
    console.log(params)

    let auxPostLimits = params?.limit ?? 25
    let auxTags = ''

    let filteredTags = DefaultFilteredTags

    if (userSettingsString) {
      const userSettings: { settings: UserSettings } = JSON.parse(userSettingsString)

      filteredTags = userSettings.settings.filteredTags
      auxPostLimits = userSettings.settings.numberPostsPerPage ? userSettings.settings.numberPostsPerPage : 25
    }

    if (!noTags) {
      auxTags = filteredTags
        .map((tag) => `-${tag}`)
        .concat(params.tags?.split(',') ?? [])
        .join(' ')
    }

    console.log('Get posts', auxTags)
    const resGel = await axios_gelbooru.get<GelbooruPostRes>('', {
      params: {
        page: 'dapi',
        q: 'index',
        s: 'post',
        json: 1,
        limit: auxPostLimits,
        api_key: apiKey,
        user_id: userId,
        pid: params.pid,
        id: params.id,
        tags: auxTags,
      },
    })

    if (resGel.data['@attributes'].count < 1) {
      return {
        '@attributes': resGel.data['@attributes'],
        post: [],
      }
    }

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
const videoUrlRegex = /.(mp4|mov|avi|mkv|flv)$/
export function convertPost(post: GelbooruPost) {
  post.created_at_utc = new Date(post.created_at).toUTCString()

  post.tags = he.decode(post.tags)
  post.tags_array = post.tags.split(' ')
  post.source_array = post.source.split('|').map((src) => src.trim())

  post.has_note_bool = post.has_notes === 'true'
  post.has_comments_bool = post.has_comments === 'true'
  post.has_children_bool = post.has_children === 'true'

  post.is_video = videoUrlRegex.test(post.file_url)
  post.is_animated = post.tags_array.some((tag) => videoTags.includes(tag))
  post.is_3d = post.tags_array.includes('3d')
  post.is_irl = post.tags_array.includes('photo_(medium)')
  post.is_sound = post.tags_array.includes('sound')

  return post
}