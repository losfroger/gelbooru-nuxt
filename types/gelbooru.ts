export interface GelbooruAttributes {
  limit: number,
  offset: number,
  /**
   * Number of total posts that meet the criteria
  */
  count: number,
}

export interface GelbooruPostRes {
  '@attributes': GelbooruAttributes,
  post: GelbooruPost[],
}

export interface GelbooruPostReq {
  /**
   * Page number, starting on 0
  */
  pid?: number,
  /**
   * Limit how many posts are retrieved
  */
  limit?: number,
  /**
   * Tags separated by commas
   * */
  tags?: string,
  /**
   * Post id, if you want only one
  */
  id?: number,
}

export interface GelbooruPost {
  /**
   * Post id
  */
  id: number,
  /**
   * Date when the post was published as string
  */
  created_at: string,
  /**
   * Date when the post was published as date
  */
  created_at_date?: Date,
  /**
   * Number of up votes
  */
  score: number,
  /**
   * Width of the image
  */
  width: number,
  /**
   * Height of the image
   */
  height: number,
  md5: string,
  directory: string,
  /**
   * Filename of the image
   */
  image: string,
  /**
   * Rating: if it's nsfw or not
  */
  rating: string,
  /**
   * Where it comes from
  */
  source: string,
  /**
   * In case there's multiple sources, they get separated by commas into array
   * (Not from the original response)
  */
  source_array: string[],
  change: number,
  /**
   * Username of poster
  */
  owner: string,
  /**
   * Id of the poster
  */
  creator_id: number,
  parent_id: number,
  /**
   * Url to the sample, usually it isn't the full size of the image
  */
  sample: number,
  /**
   * Height of preview image
  */
  preview_height: number,
  /**
   * Width of preview image
  */
  preview_width: number,
  /**
   * Tags separated by spaces
  */
  tags: string,
  /**
   * Tags inside an array
  */
  tags_array: string[],
  /**
   * Title of the post, usually blank
   * (Not from the original response)
   */
  title: string,
  /**
   * If it has notes
  */
  has_notes: string,
  /**
   * If it has notes as boolean
   * (Not from the original response)
  */
  has_note_bool: boolean,
  /**
   * If it has comments
  */
  has_comments: string,
  /**
   * If it has comments a boolean
   * (Not from the original response)
  */
  has_comments_bool: boolean,
  /**
   * Url to the full image
  */
  file_url: string,
  /**
   * Url to the preview
  */
  preview_url: string,
  /**
   * Url to the sample
  */
  sample_url: string,
  /**
   * Sample height
  */
  sample_height: number,
  /**
   * Sample width
  */
  sample_width: number,
  /**
   * Status of the post
   */
  status: string,
  /**
   * If the post is locked
   */
  post_locked: number,
  /**
   * If it has children
  */
  has_children: string,
  /**
   * If it has children as boolean
  */
  has_children_bool: boolean,
  /**
   * If it's a video
   * (Not in the original response)
  */
  is_video: boolean,
  /**
   * If it's a 3D render
   * (Not in the original response)
  */
  is_3d: boolean,
  /**
   * If it include real life people
   * (Not in the original response)
  */
  is_irl: boolean,
  /**
   * If it has sound
   * (Not in the original response)
  */
  is_sound: boolean,
}

export interface GelbooruTagRes {
  '@attributes': GelbooruAttributes,
  tag: GelbooruTag[],
}

export interface GelbooruTag {
  /**
   * Tag id
   */
  id: number,
  /**
   * Tag name
   */
  name: string,
  /**
   * Number of posts that include this tag
  */
  count: number,
  /**
   * Tag type
  */
  type: number,
  /**
   * If tag is ambiguous
   */
  ambiguous: number,
  /**
   * Tag type converted to text
   * (Not in the original response)
  */
  type_string: string,
}

export interface GelbooruUser {
  owner: string,
  creator_id: number,
}
