import type { DBSchema } from 'idb'

export namespace QueryUserDB {
  export interface QueryToSave {
    name: string,
    tags: string[],
  }

  export interface SavedQuery {
    id?: string,
    createdAt: string,
    user: string,
    name: string,
    tags: string[],
  }

  export interface DB extends DBSchema {
    'saved-queries': {
      key: string,
      value: SavedQuery
      indexes: {
        'by-name': string,
        'by-user': string,
      }
    }
  }
}
