interface bodyLogin {
  api_key?: string,
  user_id?: string,
}

export default defineEventHandler(async (event) => {
  const body: bodyLogin = await readBody(event)

  if (body.api_key && body.user_id) {

    const auxMaxAge = 7 * 24 * 60 * 60

    setCookie(event, 'user-credentials', JSON.stringify({
      api_key: body.api_key,
      user_id: body.user_id,
    }), { httpOnly: true, maxAge: auxMaxAge })

    setCookie(event, 'user-id', body.user_id, { httpOnly: true, maxAge: auxMaxAge })

    return true
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'User ID or api key missing',
  })
})