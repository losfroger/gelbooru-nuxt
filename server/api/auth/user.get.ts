import type { UserCredentials } from '~/types/auth-types'


export default defineEventHandler(async (event) => {
  try {
    const auxUserCredentials = getCookie(event, 'user-credentials')
    if (!auxUserCredentials) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      })
    }

    const userCredentials = JSON.parse(auxUserCredentials) as UserCredentials

    return userCredentials
  } catch (error) {
    console.error(error)
    throw error
  }
})