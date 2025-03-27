import Redis, { type RedisOptions } from 'ioredis'

console.log('Before runtime', import.meta.env)

const defaultOptions: RedisOptions = {
  host: import.meta.env.NUXT_CACHE_HOST ?? '127.0.0.1',
  port: parseInt(import.meta.env.NUXT_CACHE_PORT ?? '6379'),
  username: import.meta.env.NUXT_CACHE_USER,
  db: parseInt(import.meta.env.NUXT_CACHE_DB ?? '0'),
  password: import.meta.env.NUXT_CACHE_PASSWORD,
  keyPrefix: 'gelbooru-nuxt:',
}

const defaultCacheExpiry = parseInt(import.meta.env.NUXT_CACHE_TIMEOUT ?? '600')

export class CacheClient {
  private loaded: boolean = false
  public client: Redis | undefined

  constructor(address: string | RedisOptions = defaultOptions) {
    try {
      if (import.meta.env.NUXT_CACHE_ENABLED != 'true') {
        throw new Error('Cache is disabled')
      }
      if (typeof address == 'string') {
        console.log('Connecting to cache using string:', address)
        this.client = new Redis(address)
      } else {
        console.log('Connecting to cache using:', address)
        this.client = new Redis(address)
      }

      this.client?.on('error', (err) => {
        console.error('Cache client error:', err)
      })
      this.client?.on('ready', () => {
        console.log('Cache ready')
        this.loaded = true
      })

    } catch (error) {
      console.error('Error initializing cache: ', error)
      this.loaded = false
    }
  }

  async getKey(key: string): Promise<string | null> {
    try {
      if (!this.client) {
        return null
      }

      const auxString: string | null = await this.client?.get(key)
      if (!auxString) {
        return null
      }

      return auxString
    } catch (error) {
      console.error('Error getting key:', error)
      return null
    }
  }

  /**
   * @param key Valkey key to set
   * @param body String to save
   * @param expiry Expiry in seconds
   * @returns `true` if saved correctly, `false` if not saved, `null` another type of error
   */
  async setKey(key: string, body: string, expiry: number = defaultCacheExpiry) {
    try {
      if (!this.isLoaded) {
        return null
      }

      let aux: string | undefined
      if (expiry > 0) {
        aux = await this.client?.set(key, body, 'EX', expiry)
      } else {
        aux = await this.client?.set(key, body)
      }

      return aux == 'OK'
    } catch (error) {
      console.error('Error setting key:', error)
      return null
    }
  }

  /**
   *
   * @param key
   * @returns parsed object of type `T` or `null` if not found
   */
  async getKeyJson<T>(key: string) {
    try {
      if (!this.client) {
        return null
      }

      const auxString: string | null = await this.client?.get(key)
      if (!auxString) {
        return null
      }

      const json: T = (JSON.parse(auxString) as T)
      return json
    } catch (error) {
      console.error('Error parsing json key:', error)
      return null
    }
  }

  /**
   * @param key Valkey key to set
   * @param body Object to stringify and save
   * @param expiry Expiry in seconds
   * @returns `true` if saved correctly, `false` if not saved, `null` another type of error
   */
  async setKeyJson(key: string, body: object, expiry: number = defaultCacheExpiry) {
    try {
      if (!this.isLoaded) {
        return null
      }

      const auxJsonStringify: string = JSON.stringify(body)

      let aux: string | undefined
      if (expiry > 0) {
        aux = await this.client?.set(key, auxJsonStringify, 'EX', expiry)
      } else {
        aux = await this.client?.set(key, auxJsonStringify)
      }

      return aux == 'OK'
    } catch (error) {
      console.error('Error parsing json key:', error)
      return null
    }
  }

  get isLoaded() {
    return this.loaded
  }

}

const cacheClient = new CacheClient()
export default cacheClient

