import { UserCredentials } from '~/types/auth-types'


export default defineEventHandler(async (event) => {
  const aux = useCookie<UserCredentials>('user-credentials')

  console.log(aux)

  return aux.value
})