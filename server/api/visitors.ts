const STORAGE_KEY = "visitors:seen"
const DAY = 86_400_000

export interface VisitorsData {
  /** уникальных за последние 30 дней */
  month: number
  /** уникальных за сегодня */
  today: number
  /** всего за период хранения (180 дней) */
  total: number
}

/** Счётчик считается в middleware и лежит в томе; отдаём агрегаты. */
export default defineEventHandler(async (): Promise<VisitorsData> => {
  const fallback: VisitorsData = { month: 0, today: 0, total: 0 }

  if (import.meta.dev) return fallback

  try {
    const storage = useStorage("data")
    const seen = (await storage.getItem<Record<string, number>>(STORAGE_KEY)) ?? {}

    const now = Date.now()
    const todayStart = new Date(new Date(now).toISOString().slice(0, 10)).getTime()

    let today = 0
    let month = 0
    let total = 0

    for (const ts of Object.values(seen)) {
      if (typeof ts !== "number") continue
      total += 1
      if (ts >= todayStart) today += 1
      if (now - ts <= 30 * DAY) month += 1
    }

    return { today, month, total }
  } catch {
    return fallback
  }
})
