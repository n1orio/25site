import type { DeadlockData } from "~/types/deadlock"

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

  const heroWinrate = (wins: number, matches: number) =>
    matches ? Math.round((wins / matches) * 100) : 0

  const heroIconUrl = (icon: string) =>
    icon ? `https://ddlk.bio${icon}` : ""

  const matchDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }

  return {
    info,
    rankLabel,
    rankProgress,
    winrateLabel,
    recordLabel,
    heroWinrate,
    heroIconUrl,
    matchDuration,
  }
}
