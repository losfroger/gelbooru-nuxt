export namespace Cache {
  export interface CachedData<T> {
    timestamp: string,
    data: T,
  }
}