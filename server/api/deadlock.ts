import type { DeadlockData } from "~/types/deadlock"

const BASE = "https://ddlk.bio/api/profile/niorio"

export default defineEventHandler(async (): Promise<DeadlockData | null> => {
  return cachedFetch<DeadlockData | null>("deadlock", 180_000, async () => {
    try {
      const [mmr, matchesRes, statsRes]: [any, any, any] = await Promise.all([
        $fetch(`${BASE}/mmr`),
        $fetch(`${BASE}/matches?limit=50`),
        $fetch(`${BASE}/stats`),
      ])

      const recent = (matchesRes?.recent_matches ?? []) as DeadlockData["recent"]

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
