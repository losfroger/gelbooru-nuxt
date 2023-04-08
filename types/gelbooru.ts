export interface GelbooruPostRes {
  '@attributes': {
    limit: number,
    offset: number,
    count: number,
  },
  post: GelbooruPost[]
}

export interface GelbooruPost {
  id: number,
  created_at: string,
  created_at_date?: Date,
  score: number,
  width: number,
  height: number,
  md5: string,
  directory: string,
  image: string,
  rating: string,
  source: string,
  source_array: string[],
  change: number,
  owner: string,
  creator_id: number,
  parent_id: number,
  sample: number,
  preview_height: number,
  preview_width: number,
  tags: string,
  tags_array: string[],
  title: string,
  has_notes: string,
  has_note_bool: boolean,
  has_comments: string,
  has_comments_bool: boolean,
  file_url: string,
  preview_url: string,
  sample_url: string,
  sample_height: number,
  sample_width: number,
  status: string,
  post_locked: number,
  has_children: string,
  has_children_bool: boolean,
  is_video: boolean,
  is_3d: boolean,
  is_irl: boolean,
  is_sound: boolean,
}

export interface GelbooruTag {
  id: number,
  name: string,
  count: number,
  type: number,
  ambiguous: number,
  type_string: string,
}

export interface GelbooruUser {
  owner: string,
  creator_id: number,
}
