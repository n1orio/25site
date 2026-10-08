const cache = new Map<string, { data: any; expires: number }>()

export const cachedFetch = async <T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> => {
  const hit = cache.get(key)
  if (hit && hit.expires > Date.now()) return hit.data as T
  const data = await fetcher()
  cache.set(key, { data, expires: Date.now() + ttlMs })
  return data
}
