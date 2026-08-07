const cache = new Map<string, { data: any; expires: number }>()

export const cachedFetch = async (key: string, ttlMs: number, fetcher: () => Promise<any>) => {
  const hit = cache.get(key)
  if (hit && hit.expires > Date.now()) return hit.data
  const data = await fetcher()
  cache.set(key, { data, expires: Date.now() + ttlMs })
  return data
}