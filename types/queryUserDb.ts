import type { DBSchema } from 'idb'

export namespace QueryUserDB {
  export interface QueryToSave {
    name: string,
    tags: string[],
  }

  export interface SavedQuery {
    id?: string,
    user: string,
    name: string,
    tags: string[],
  }

  export interface DB extends DBSchema {
    'saved-queries': {
      key: number,
      value: SavedQuery
      indexes: {
        'by-name': string,
        'by-user': string,
      }
    }
  }
}
