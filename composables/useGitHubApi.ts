import type { UseFetchOptions } from 'nuxt/app'

export function useGitHubApi<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$githubApi as typeof $fetch
  })
}