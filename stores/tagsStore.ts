import { GelbooruTag } from '@/types/gelbooru'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const useTagStore = defineStore('tags', () => {

  const tagList = ref<GelbooruTag[]>([])

  async function getTag(name: string): Promise<GelbooruTag | undefined> {
    try {
      // Search in saved tags
      const aux = tagList.value.find((tag) => tag.name == name)
      if (aux) {
        return aux
      }

      // Else call API
      const res = await axios.get('/api/tag', {
        params: { name: name }
      })
      tagList.value.push(res.data.tag[0])

      return res.data.tag[0]
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  return {
    getTag
  }
})
