import type { GelbooruAttributes, GelbooruPost, GelbooruPostReq, GelbooruPostReqQuery, GelbooruPostRes, GelbooruTagReq, GelbooruTagReqQuery } from '~/types/gelbooru'
import { DefaultFilteredTags } from '~/types/gelbooru'

import axios_gelbooru from '~/server/axiosGelbooru'
import he from 'he'
import type { UserSettings } from '~/stores/settingsStore'
import cacheClient from './db/cache'

interface GetPostsOptions {
  ignoreUserSettingTags?: boolean,
  ignoreUserSettingLimits?: boolean,
  ignoreParamTags?: boolean,
  saveToCache?: boolean,
  cachePrefix?: string,
}

const DefaultGetPostOptions: GetPostsOptions = {
  ignoreUserSettingLimits: false,
  ignoreUserSettingTags: false,
  ignoreParamTags: false,
  saveToCache: true,
  cachePrefix: 'posts:',
}

const MAX_NUMBER_OF_ELEMENTS = 100

export async function getQueryMetadata(
  apiKey: string,
  userId: string,
  params: GelbooruPostReq,
  userSettingsString: string | undefined
): Promise<GelbooruAttributes | undefined> {
  const cacheKeyQueryParams = []

  // Generate cacheKey
  let filteredTags = DefaultFilteredTags
  if (userSettingsString) {
    const userSettings = getUserSettings(userSettingsString)
    filteredTags = userSettings.settings.filteredTags
  }

  const queryPostTags = filteredTags
    .map((tag) => `-${tag}`)
    .concat(params.tags?.split(',') ?? [])
    .join(' ')

  cacheKeyQueryParams.push(queryPostTags ? queryPostTags.replaceAll(' ', '|').replaceAll(':', '+') : '-')

  const cacheKey = 'posts:paginated:' + cacheKeyQueryParams.join(':') + ':metadata'

  // Check cache
  const cachedMetadata = await cacheClient.getKeyJson<GelbooruAttributes>(cacheKey)
  if (cachedMetadata) {
    return cachedMetadata.data
  }

  // If not in cache, get from gelbooru API
  const getPostParams: GelbooruPostReq = {
    ...params,
    limit: 1,
  }

  const resPost = await getPosts(
    apiKey,
    userId,
    getPostParams,
    userSettingsString,
    {
      saveToCache: false,
      cachePrefix: 'metadata:',
      ignoreUserSettingLimits: true,
    }
  )

  if (!resPost) {
    throw new Error('No metadata')
  }

  const metadata = resPost?.['@attributes']

  // Save in cache
  await cacheClient.setKeyJson(cacheKey, metadata, 60 * 5)

  return metadata
}

export async function getPosts(
  apiKey: string,
  userId: string,
  params: GelbooruPostReq,
  userSettingsString: string | undefined,
  options: GetPostsOptions = DefaultGetPostOptions
): Promise<GelbooruPostRes | undefined> {
  try {
    console.log(params)

    // Fill up post options
    const getPostOptions = {
      ...DefaultGetPostOptions,
      ...options,
    }

    let queryPostNumberLimit = params?.limit ?? 25
    let filteredTags = DefaultFilteredTags

    // Apply user settings
    if (userSettingsString) {
      const userSettings = getUserSettings(userSettingsString)

      // Use user's filtered tags unless the option is activated
      filteredTags = getPostOptions.ignoreUserSettingTags
        ? DefaultFilteredTags
        : userSettings.settings.filteredTags

      // Use user's amount of posts per page unless option is activated
      queryPostNumberLimit = getPostOptions.ignoreUserSettingLimits
        ? params.limit ?? 25
        : (userSettings.settings?.numberPostsPerPage ?? 25)
    }

    // Form tag query
    let queryPostTags = filteredTags
      .map((tag) => `-${tag}`)
      .concat(params.tags?.split(',') ?? [])
      .join(' ')
    // If option to ignore the tags is activated, don't filter any tag
    if (options.ignoreParamTags) {
      queryPostTags = ''
    }

    // Generate the cache key
    const cacheKey = options.cachePrefix + gelbooruPostReqToCacheKey({
      limit: queryPostNumberLimit,
      pid: params.pid,
      id: params.id,
      tags: queryPostTags,
    })

    console.debug('Cache key', cacheKey)
    const cachedPostData = await cacheClient.getKeyJson<GelbooruPostRes>(cacheKey)
    if (cachedPostData) {
      return cachedPostData.data
    }

    console.log('Get posts', queryPostTags)
    const resGel = await axios_gelbooru.get<GelbooruPostRes>('', {
      params: {
        page: 'dapi',
        q: 'index',
        s: 'post',
        json: 1,
        limit: queryPostNumberLimit,
        api_key: apiKey,
        user_id: userId,
        pid: params.pid,
        id: params.id,
        tags: queryPostTags,
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

    // Do not save when the sort might be constantly updated
    const isSortRandom = queryPostTags.includes('sort:random')
    const isSortUpdated = queryPostTags.includes('sort:updated')
    const isSortId = queryPostTags.includes('sort:id')
    if (options.saveToCache && !isSortRandom && !isSortUpdated && !isSortId) {
      await cacheClient.setKeyJson(cacheKey, resGel.data)
    }

    return resGel.data

  } catch (error) {
    console.log('Error!', error)
    return undefined
  }
}

export function getUserSettings(userSettingsString: string) {
  const userSettings: { settings: UserSettings } = JSON.parse(userSettingsString)
  return userSettings
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

const rangeOfNumbers = (a: number, b: number) => [...Array(b - a)].map((_, i) => i + a + 1)

interface CachedChunk {
  [key: number]: GelbooruPostRes,
}

// TODO: Revisar endnumber que no exceda la cantidad de posts que existen
export async function getPostsInCachedChunks(
  apiKey: string,
  userId: string,
  params: GelbooruPostReq,
  userSettingsString: string | undefined,
  noTags = false,
  saveToCache = true,
  cachePrefix = 'posts:paginated:'
): Promise<GelbooruPostRes> {
  console.log('Getting post in chunks, params:', params)

  let numberPostsPerPage = 25
  if (userSettingsString) {
    const userSettings = getUserSettings(userSettingsString)
    numberPostsPerPage = userSettings.settings.numberPostsPerPage
  }

  const metadata = await getQueryMetadata(apiKey, userId, params, userSettingsString)

  const starterNumber = (params.pid ?? 0) * numberPostsPerPage
  const endNumber = Math.min(starterNumber + (numberPostsPerPage - 1), (metadata?.count ?? 1_000_000) - 1)

  console.log('Starter number:', starterNumber)
  console.log('End number:', endNumber)

  // Calculate 100 element PIDs that will be needed
  const startPid = Math.max(Math.ceil((starterNumber + 1) / MAX_NUMBER_OF_ELEMENTS) - 1, 0)
  const endPid = Math.max(Math.ceil((endNumber + 1) / MAX_NUMBER_OF_ELEMENTS) - 1, 0)

  console.log('Start pid:', startPid)
  console.log('End pid:', endPid)

  const listOfPids = rangeOfNumbers(startPid - 1, endPid)

  console.debug(listOfPids)
  console.debug('Getting chunks')

  // Get pids from cache
  const cachedChunks: CachedChunk = {}
  for (const pid of listOfPids) {
    const auxParams: GelbooruPostReq = {
      tags: params.tags,
      limit: 100,
      pid,
    }

    const chunk = await getPosts(apiKey, userId, auxParams, userSettingsString, {
      saveToCache,
      cachePrefix,
      ignoreUserSettingLimits: true,
      ignoreParamTags: noTags,
    })

    if (chunk) {
      cachedChunks[pid] = chunk
    }
  }

  const postNumArray = rangeOfNumbers(starterNumber - 1, endNumber)
  const aux = []

  console.debug(postNumArray)

  console.debug('Retrieving posts from chunks')
  for (const num of postNumArray) {
    const pid = Math.max(Math.ceil((num + 1) / MAX_NUMBER_OF_ELEMENTS) - 1, 0)
    const chunk = cachedChunks[pid]

    if (chunk) {
      const post = chunk.post[num % MAX_NUMBER_OF_ELEMENTS]
      if (!post) {
        console.log(post, num, num % MAX_NUMBER_OF_ELEMENTS)
      }

      aux.push(post)
    }
  }

  const auxAttributes = cachedChunks[startPid]['@attributes']
  auxAttributes.limit = numberPostsPerPage
  auxAttributes.offset = numberPostsPerPage * (params.pid ?? 0)
  return {
    '@attributes': auxAttributes,
    post: aux,
  }
}


export function convertGelbooruPostReqQuery_to_GelbooruPostReq(query: GelbooruPostReqQuery): GelbooruPostReq {
  return {
    id: query.id ? parseInt(query.id) : undefined,
    limit: query.limit ? parseInt(query.limit) : undefined,
    pid: query.pid ? parseInt(query.pid) : undefined,
    tags: query.tags,
  }
}


export function gelbooruPostReqToCacheKey(req: GelbooruPostReq) {
  const aux: string[] = []
  aux.push(req.tags ? req.tags.replaceAll(' ', '|').replaceAll(':', '+') : '-')
  aux.push(req.limit ? req.limit.toString() : '-')
  aux.push(req.pid || req.pid == 0 ? req.pid.toString() : '-')
  aux.push(req.id ? req.id.toString() : '-')

  return aux.join(':')
}

export function convertGelbooruTagReqQuery_to_GelbooruTagReq(query: GelbooruTagReqQuery): GelbooruTagReq {
  return {
    ...query,
    id: query.id ? parseInt(query.id) : undefined,
    limit: query.limit ? parseInt(query.limit) : undefined,
    after_id: query.after_id ? parseInt(query.after_id) : undefined,
  }
}