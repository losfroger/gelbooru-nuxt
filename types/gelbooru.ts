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
   * Date when the post was published as utc string
  */
  created_at_utc: string,
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
  rating: 'General' | 'general' | 'safe' | 'Safe' | 'questionable' | 'sensitive' | 'Questionable' | 'explicit' | 'Explicit',
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
   * If it's animated
   * (Not in the original response)
   */
  is_animated: boolean,
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

export interface GelbooruPostWithTags extends GelbooruPost {
  fetched_tags?: GelbooruTag[]
}

export const DefaultFilteredTags = [
  'loli',
  'age_difference',
  'bestiality',
  'futanari',
  'blood',
  'amputee',
  'bruise',
  'pee',
  'asphyxiation',
]

export interface GelbooruTagRes {
  '@attributes': GelbooruAttributes,
  tag: GelbooruTag[],
}

export interface GelbooruTagReq {
  /**
  * The tag's id in the database. This is useful to grab a specific tag if you already know this value.
  */
  id?: number,
  /**
   * How many tags you want to retrieve. There is a default limit of 100 per request.
  */
  limit?: number,
  /**
   * Grab tags whose ID is greater than this value.
  */
  after_id?: number,
  /**
   * Find tag information based on this value.
   */
  name?: string,
  /**
   * Separated by spaces, get multiple results to tags you specify if it exists. (schoolgirl moon cat)
   */
  names?: string,
  /**
   * A wildcard search for your query using LIKE. Use _ for single character wildcards or % for multi-character wildcards. (%choolgirl% would act as *choolgirl* wildcard search.)
   */
  name_pattern?: string,
  order?: 'ASC' | 'DESC',
  orderby?: 'date' | 'count' | 'name'
}

// REGEX Tags
export const NegativeQueryRegex = new RegExp(/^-(.+)/)
export const FuzzyQueryRegex = new RegExp(/(.+)~+/)

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

export interface GelbooruComment {
  created_at: Date,
  post_id: number,
  body: string,
  creator: number,
  id: number,
  creator_id?: number,
}