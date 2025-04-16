import type { UseFetchOptions } from 'nuxt/app'

export function useAssetsApi<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options
  })
}