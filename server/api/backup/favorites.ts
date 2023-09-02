import { GelbooruPost, GelbooruPostReq } from '~/types/gelbooru'
import { getPosts } from '~/server/postUtils'
import { UserCredentials } from '~/types/auth-types'

// Retrieve all favorites from user
export default defineEventHandler(async (event) => {
  console.log(event.path)

  const userCredentialsCookie = getCookie(event, 'user-credentials')
  if (!userCredentialsCookie) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User needs to be logged in'
    })
  }

  const userCredentials: UserCredentials = JSON.parse(userCredentialsCookie)

  const query: GelbooruPostReq = {
    tags: `fav:${userCredentials.user_id}`,
    limit: 100
  }

  /*
    Get initial posts,
    later used to calculate the amount of requests to get the whole favorites list
  */
  const firstPostsData = await getPosts(
    userCredentials.api_key,
    userCredentials.user_id,
    query,
    undefined,
  )

  if (!firstPostsData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No posts were found with that criteria'
    })
  }

  let allPosts: GelbooruPost[] = []
  // Save first request to not remake it
  allPosts = allPosts.concat(firstPostsData.post)

  // Calculate number of requests that are needed to get the remaining data
  const numRemainingReqs = Math.ceil(
    (firstPostsData['@attributes'].count - firstPostsData['@attributes'].limit) / firstPostsData['@attributes'].limit
  )

  // Get all remaining posts
  for (let index = 0; index < numRemainingReqs; index++) {
    const auxQuery: GelbooruPostReq = {
      limit: 100,
      pid: index + 1,
      tags: query.tags
    }

    const auxPostsData = await getPosts(
      userCredentials.api_key,
      userCredentials.user_id,
      auxQuery,
      undefined,
    )

    if (auxPostsData?.post) {
      allPosts = allPosts.concat(auxPostsData?.post)
    }

    // To not spam gelboorus servers
    await new Promise(r => setTimeout(r, 50))
  }

  return allPosts
})
