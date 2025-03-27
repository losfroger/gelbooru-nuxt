export default defineEventHandler((event) => {
  if (event.path.includes('/api/')) {
    console.log('New request: ', event.path)
  }
})