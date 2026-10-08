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
    return r.division ? `${r.name} ${r.division}` : r.name
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

  return {
    info,
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
