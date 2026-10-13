const cache = new Map<string, { data: unknown; expires: number }>()
/**
 * Одновременные запросы одного ключа. Без этого на истечении TTL
 * каждый параллельный запрос запускал свой fetcher: на /api/deadlock
 * это пять обращений к ddlk.bio на каждый запрос страницы.
 */
const inflight = new Map<string, Promise<unknown>>()

export const cachedFetch = async <T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> => {
  const hit = cache.get(key)
  if (hit && hit.expires > Date.now()) return hit.data as T

  const pending = inflight.get(key) as Promise<T> | undefined
  if (pending) return pending

  const request = fetcher()
    .then((data) => {
      cache.set(key, { data, expires: Date.now() + ttlMs })
      return data
    })
    .finally(() => {
      inflight.delete(key)
    })

  inflight.set(key, request)
  return request
}