interface bodyLogin {
  api_key?: string,
  user_id?: string,
}

export default defineEventHandler(async (event) => {
  const body: bodyLogin = await readBody(event)

  if (body.api_key && body.user_id) {

    const auxExpireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    setCookie(event, 'user-credentials', JSON.stringify({
      api_key: body.api_key,
      user_id: body.user_id,
    }), { httpOnly: true, expires: auxExpireDate })

    setCookie(event, 'user-id', body.user_id)

    return true
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'User ID or api key missing'
  })
})