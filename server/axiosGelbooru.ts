import axios from 'axios'
const base_gelbooru_url = 'https://gelbooru.com/index.php'

const axios_gelbooru = axios.create({
  baseURL: base_gelbooru_url
})

export default axios_gelbooru