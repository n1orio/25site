import type { DeadlockData, Mode } from "~/types/deadlock"

export const MODE_LABEL: Record<Mode, string> = {
  ranked: "Ранкед",
  standard: "Стандарт",
  "street-brawl": "Улица",
}

export const useDeadlock = (data: Ref<DeadlockData | null | undefined>) => {
  const info = computed(() => data.value ?? null)

  const rankLabel = computed(() => {
    const r = info.value?.rank
    if (!r) return null
    // rank_name уже содержит подранг («Sentinel V»), а division — это
    // индекс самого ранга: дописывать его выходило «Sentinel V 4»
    return r.name
  })

  const rankProgress = computed(() => {
    const r = info.value?.rank
    if (!r?.max) return 0
    return Math.min(100, Math.round((r.points / r.max) * 100))
  })

  const winrateLabel = computed(() => {
    const t = info.value?.totals
    return t ? `${t.winrate.toFixed(1)}%` : null
  })

  const recordLabel = computed(() => {
    const t = info.value?.totals
    return t ? `${t.wins}W — ${t.losses}L` : null
  })

  const heroIconUrl = (icon: string) => (icon ? `https://ddlk.bio${icon}` : "")

  const itemImageUrl = (image: string) =>
    image ? `https://ddlk.bio${image}` : ""

  const matchDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }

  const netWorth = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)

  const deltaLabel = (delta: number) => (delta > 0 ? `+${delta}` : String(delta))

  const daysAgo = (unix: number) => {
    const days = Math.floor((Date.now() - unix * 1000) / 86_400_000)
    if (days <= 0) return "сегодня"
    if (days === 1) return "вчера"
    if (days < 30) return `${days} дн. назад`
    if (days < 365) return `${Math.floor(days / 30)} мес. назад`
    return `${Math.floor(days / 365)} г. назад`
  }

  /**
   * Часы за всё время — из профиля Steam через /summary. Раньше здесь
   * стояла сумма по окну активности, из-за чего «53 ч» выглядели как
   * всё время в игре (реально 652).
   */
  const hoursLabel = computed(() => {
    const h = info.value?.profile?.hoursPlayed ?? 0
    const whole = Math.floor(h)
    const minutes = Math.round((h - whole) * 60)
    return minutes ? `${whole} ч ${minutes} м` : `${whole} ч`
  })

  /** часы, накопленные только внутри окна активности */
  const hoursWindowLabel = computed(() => {
    const h = info.value?.activity?.hours ?? 0
    const whole = Math.floor(h)
    const minutes = Math.round((h - whole) * 60)
    return minutes ? `${whole} ч ${minutes} м` : `${whole} ч`
  })

  /**
   * Календарь активности: тот же вид, что у контрибуций —
   * столбцы по неделям, ряды по дням недели. Пустые дни окна
   * заполняем нулями, чтобы сетка не съезжала.
   */
  const activityWeeks = computed(() => {
    const days = info.value?.activity?.days
    if (!days?.length) return []
    const byDate = new Map(days.map((d) => [d.date, d]))
    const last = new Date(`${days[days.length - 1]!.date}T00:00:00Z`)
    // недели считаем с понедельника, как в календаре
    const start = new Date(last)
    start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7) - 7 * 11)
    const weeks: ({ date: string; matches: number; wins: number } | null)[][] = []
    for (let w = 0; w < 12; w++) {
      const week: ({ date: string; matches: number; wins: number } | null)[] = []
      for (let d = 0; d < 7; d++) {
        const day = new Date(start)
        day.setUTCDate(start.getUTCDate() + w * 7 + d)
        const iso = day.toISOString().slice(0, 10)
        if (day > last) { week.push(null); continue }
        const found = byDate.get(iso)
        week.push(found ? { date: iso, matches: found.matches, wins: found.wins } : { date: iso, matches: 0, wins: 0 })
      }
      weeks.push(week)
    }
    return weeks
  })

  /** уровень закраски клетки: 0..4 */
  const activityLevel = (matches: number) => {
    const max = info.value?.activity?.maxPerDay ?? 1
    if (!matches) return 0
    const ratio = matches / max
    if (ratio > 0.75) return 4
    if (ratio > 0.5) return 3
    if (ratio > 0.25) return 2
    return 1
  }

  const itemTypeLabel = (type: string) =>
    ({ vitality: "живучесть", spirit: "дух", weapon: "оружие", armor: "броня", unknown: "—" })[type] ?? type

  const placeLabel = computed(() => {
    const p = info.value?.place
    return p ? `${p.avg} из 12` : null
  })

  return {
    info,
    hoursLabel,
    hoursWindowLabel,
    activityWeeks,
    activityLevel,
    itemTypeLabel,
    placeLabel,
    rankLabel,
    rankProgress,
    winrateLabel,
    recordLabel,
    heroIconUrl,
    itemImageUrl,
    matchDuration,
    netWorth,
    deltaLabel,
    daysAgo,
  }
}
