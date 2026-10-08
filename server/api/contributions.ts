/**
 * Календарь вкладов с GitHub.
 *
 * Важно: официального API для календаря нет — ни REST, ни GraphQL его не
 * отдают. GitHub не публикует и точные количества, а только 5 уровней
 * интенсивности (data-level="0".."4") в HTML страницы профиля.
 * Поэтому здесь парсится именно разметка календаря, а счётчик активных
 * дней считается из уровней. Эндпоинт неофициальный: если GitHub поменяет
 * разметку, блок просто не отрисуется (вернётся null), страница не сломается.
 */

export interface ContributionsDay {
  date: string
  /** 0..4 */
  level: number
}

export interface ContributionsData {
  from: string
  to: string
  days: ContributionsDay[]
  /** дней с хотя бы одним вкладом */
  activeDays: number
  /** самый длинный ряд дней подряд */
  longestStreak: number
  /** сколько дней всего в периоде */
  total: number
}

const LOGIN = "n1orio"
const TTL = 60 * 60 * 1000

export default defineEventHandler(async (): Promise<ContributionsData | null> => {
  return cachedFetch<ContributionsData | null>("github-contributions", TTL, async () => {
    try {
      const html = await $fetch<string>(
        `https://github.com/users/${LOGIN}/contributions`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            Accept: "text/html",
          },
        },
      )

      // data-date и data-level лежат в одном теге <td>, поэтомусобираем по общему шаблону по общему шаблону
      const cells = html.match(/<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"[^>]*>/g)
      if (!cells?.length) return null

      const days: ContributionsDay[] = []
      for (const cell of cells) {
        const date = cell.match(/data-date="([\d-]+)"/)?.[1]
        const level = cell.match(/data-level="(\d)"/)?.[1]
        if (!date || level === undefined) continue
        days.push({ date, level: Number(level) })
      }
      if (!days.length) return null

      days.sort((a, b) => a.date.localeCompare(b.date))

      let activeDays = 0
      let longestStreak = 0
      let streak = 0
      let previous: string | null = null

      for (const day of days) {
        if (day.level > 0) {
          activeDays += 1
          // ряд считаем только по соседним календарным дням
          if (previous) {
            const prev = new Date(`${previous}T00:00:00Z`).getTime()
            const cur = new Date(`${day.date}T00:00:00Z`).getTime()
            streak = (cur - prev === 86_400_000) ? streak + 1 : 1
          } else {
            streak = 1
          }
          if (streak > longestStreak) longestStreak = streak
        } else {
          streak = 0
        }
        previous = day.date
      }

      return {
        from: days[0]?.date ?? "",
        to: days[days.length - 1]?.date ?? "",
        days,
        activeDays,
        longestStreak,
        total: days.length,
      }
    } catch {
      return null
    }
  })
})
