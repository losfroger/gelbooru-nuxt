/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv extends NodeJS.ProcessEnv {
    readonly NUXT_CACHE_ENABLED?: 'true',
    readonly NUXT_CACHE_HOST?: string,
    readonly NUXT_CACHE_PORT?: string,
    readonly NUXT_CACHE_USER?: string,
    readonly NUXT_CACHE_PASSWORD?: string,
    readonly NUXT_CACHE_TIMEOUT?: string,
    readonly NUXT_CACHE_DB?: string,
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }
