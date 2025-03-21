import type { FetchError } from 'ofetch'

export namespace Utils {
  export const numberFormatter = Intl.NumberFormat('en', { notation: 'compact' })

  export function isFetchError(error: unknown): error is FetchError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'statusMessage' in error
    )
  }
}
