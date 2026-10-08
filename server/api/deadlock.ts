import type { DeadlockData, DeadlockMatch } from "~/types/deadlock"

const BASE = "https://ddlk.bio/api/profile/niorio"

interface MmrResponse {
  rank_name?: string
  division?: number
  division_tier?: number
  rank_points?: number
  rank_points_max?: number
}

interface MatchesResponse {
  totals?: DeadlockData["totals"]
  recent_matches?: DeadlockMatch[]
}

interface StatsResponse {
  kda?: number
  accuracy?: number
  headshot_rate?: number
}

export default defineEventHandler(async (): Promise<DeadlockData | null> => {
  return cachedFetch<DeadlockData | null>("deadlock", 180_000, async () => {
    try {
      const [mmr, matchesRes, statsRes] = await Promise.all([
        $fetch<MmrResponse>(`${BASE}/mmr`),
        $fetch<MatchesResponse>(`${BASE}/matches?limit=50`),
        $fetch<StatsResponse>(`${BASE}/stats`),
      ])

      const recent: DeadlockMatch[] = matchesRes?.recent_matches ?? []

      const byHero = new Map<number, DeadlockData["heroes"][number]>()
      for (const m of recent) {
        const entry = byHero.get(m.hero_id) ?? {
          name: m.hero_name,
          icon: m.hero_icon,
          matches: 0,
          wins: 0,
          kda: [],
        }
        entry.matches += 1
        if (m.result === "Win") entry.wins += 1
        entry.kda.push(m.kda)
        byHero.set(m.hero_id, entry)
      }

      const heroes = [...byHero.values()]
        .sort((a, b) => b.matches - a.matches || b.wins - a.wins)
        .slice(0, 6)

      return {
        rank: mmr?.rank_name
          ? {
              name: mmr.rank_name,
              division: mmr.division ?? 0,
              tier: mmr.division_tier ?? 0,
              points: mmr.rank_points ?? 0,
              max: mmr.rank_points_max ?? 1000,
            }
          : null,
        totals: matchesRes?.totals ?? null,
        stats: statsRes
          ? {
              kda: statsRes.kda ?? 0,
              accuracy: statsRes.accuracy ?? 0,
              headshot_rate: statsRes.headshot_rate ?? 0,
            }
          : null,
        heroes,
        recent: recent.slice(0, 8),
      }
    } catch {
      return null
    }
  })
})
