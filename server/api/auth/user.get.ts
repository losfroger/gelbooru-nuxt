import type { UserCredentials } from '~/types/auth-types'


export default defineEventHandler(async (_event) => {
  const aux = useCookie<UserCredentials>('user-credentials')

  console.log(aux)

  return aux.value
})