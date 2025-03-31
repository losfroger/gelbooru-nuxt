import type { Gelbooru } from '~/types/gelbooru'
import he from 'he'

const videoTags = ['animated', 'video']
export default function convertPost(post: Gelbooru.Post) {
  post.created_at_utc = new Date(post.created_at).toUTCString()

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