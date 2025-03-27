export default defineEventHandler(async (event) => {
  const api_key = getCookie(event, 'api_key')
  const user_id = getCookie(event, 'user_id')

  return (!!api_key && !!user_id)
})