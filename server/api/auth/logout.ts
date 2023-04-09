export default defineEventHandler(async (event) => {
  deleteCookie(event, 'user-id')
  deleteCookie(event, 'user-credentials')

  return true
})