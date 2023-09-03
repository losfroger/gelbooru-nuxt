import { GelbooruPost } from '~/types/gelbooru'

import JSZip from 'jszip'
import { Readable } from 'stream'

export default defineEventHandler(async (event) => {
  console.log(event.path)

  const body = await readMultipartFormData(event)


  if (!body || body.length < 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid file found'
    })
  }

  try {
    const zip = new JSZip()
    const postList: GelbooruPost[] = JSON.parse(body[0].data.toString())

    // Download each image from the posts
    for (const post of postList) {
      if (post.is_video) {
        continue
      }

      try {
        const res = await $fetch(`/api/image/full/${post?.id}`, {responseType: 'arrayBuffer'})
        const fileType = post.image.split('.').at(-1) ?? 'png'
        zip.file(`${post?.id}.${fileType}`, res)

      } catch (error) {
        console.log(error)
        continue
      }
    }

    // Generate zip and send it to the client
    const zipStream = zip.generateNodeStream({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {level: 5}
    })
    const readZipStream = new Readable().wrap(zipStream)

    setHeaders(event, {
      'Content-Disposition': 'attachment; filename="BackupGelbooruImages.zip"',
      'Content-type': 'application/octet-stream'
    })

    return sendStream(event, readZipStream)

  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `There was an error while forming the zip: ${error}`
    })
  }
})
