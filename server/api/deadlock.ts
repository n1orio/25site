import type {
  DeadlockData, DeadlockHero, DeadlockMatch, DeadlockSide, Mode,
} from "~/types/deadlock"

const BASE = "https://ddlk.bio/api/profile/niorio"
const SAMPLE_LIMIT = 50

interface MmrResponse {
  rank_name?: string
  division?: number
  division_tier?: number
  rank_points?: number
  rank_points_max?: number
  rank_updated_at?: number
}

interface RawMatch {
  match_id: number
  start_time: number
  game_mode: number
  match_mode: number
  hero_id: number
  hero_name: string
  hero_icon: string
  hero_tag: string
  result: string
  kda: string
  net_worth: number
  duration_s: number
  match_rank_division: number | null
  match_rank_division_tier: number | null
  ranked_delta: number | null
}

interface MatchesResponse {
  totals?: DeadlockData["totals"]
  recent_matches?: RawMatch[]
}

interface StatsResponse {
  kda?: number
  accuracy?: number
  headshot_rate?: number
  risk_band?: string
}

interface FavoritesResponse {
  favorite_items?: { name: string; image: string }[]
}

/** Логика режимов та же, что на ddlk.bio */
const modeOf = (m: Pick<RawMatch, "game_mode" | "match_mode">): Mode => {
  if (m.game_mode === 4) return "street-brawl"
  if (m.match_mode !== 4) return "standard"
  return "ranked"
}

const ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
}

const emptySide = (): DeadlockSide => ({ matches: 0, wins: 0, losses: 0, winrate: 0 })

const sideOf = (matches: RawMatch[]): DeadlockSide => {
  const side = emptySide()
  for (const m of matches) {
    if (m.result === "NotScored") continue
    side.matches += 1
    if (m.result === "Win") side.wins += 1
    else side.losses += 1
  }
  side.winrate = side.matches ? Number(((side.wins / side.matches) * 100).toFixed(1)) : 0
  return side
}

const parseKda = (kda: string) => {
  const [k = 0, d = 0, a = 0] = kda.split("/").map((v) => Number(v) || 0)
  return { kills: k, deaths: d, assists: a, ratio: d === 0 ? k + a : (k + a) / d }
}

const avg = (nums: number[]) =>
  nums.length ? nums.reduce((s, v) => s + v, 0) / nums.length : 0

const round = (n: number, digits = 2) => Number(n.toFixed(digits))

export default defineEventHandler(async (): Promise<DeadlockData | null> => {
  return cachedFetch<DeadlockData | null>("deadlock", 180_000, async () => {
    try {
      const [mmr, matchesRes, statsRes, favRes] = await Promise.all([
        $fetch<MmrResponse>(`${BASE}/mmr`),
        $fetch<MatchesResponse>(`${BASE}/matches?limit=${SAMPLE_LIMIT}`),
        $fetch<StatsResponse>(`${BASE}/stats`),
        $fetch<FavoritesResponse>(`${BASE}/favorites?limit=8`).catch(() => ({} as FavoritesResponse)),
      ])

      const raw = matchesRes?.recent_matches ?? []
      const scored = raw.filter((m) => m.result !== "NotScored")

      // --- ранкед / анранкед ---
      const rankedMatches = raw.filter((m) => modeOf(m) === "ranked")
      const unrankedMatches = raw.filter((m) => modeOf(m) !== "ranked")

      const rankedSide = sideOf(rankedMatches)
      const deltas = rankedMatches
        .map((m) => m.ranked_delta)
        .filter((v): v is number => typeof v === "number")

      const ranked = rankedSide.matches
        ? {
            ...rankedSide,
            delta: deltas.reduce((s, v) => s + v, 0),
            deltaBest: deltas.length ? Math.max(...deltas) : 0,
            deltaWorst: deltas.length ? Math.min(...deltas) : 0,
          }
        : null

      // --- серии (по убыванию времени) ---
      let current = 0
      let best = 0
      let run = 0
      for (const m of scored) {
        if (m.result === "Win") {
          run += 1
          current = run
          if (run > best) best = run
        } else {
          run = 0
          current = 0
        }
      }

      // --- герои ---
      const byHero = new Map<number, { raw: RawMatch[]; info: { name: string; tag: string; icon: string } }>()
      for (const m of scored) {
        const bucket = byHero.get(m.hero_id) ?? {
          raw: [],
          info: { name: m.hero_name, tag: m.hero_tag, icon: m.hero_icon },
        }
        bucket.raw.push(m)
        byHero.set(m.hero_id, bucket)
      }

      const heroes: DeadlockHero[] = [...byHero.entries()]
        .map(([, { raw: list, info }]) => {
          const side = sideOf(list)
          const kdas = list.map((m) => parseKda(m.kda))
          return {
            ...info,
            matches: side.matches,
            wins: side.wins,
            winrate: side.winrate,
            avgKda: round(avg(kdas.map((k) => k.ratio))),
            avgKills: round(avg(kdas.map((k) => k.kills)), 1),
            avgDuration: Math.round(avg(list.map((m) => m.duration_s))),
          }
        })
        .sort((a, b) => b.matches - a.matches || b.winrate - a.winrate)
        .slice(0, 8)

      const recent: DeadlockMatch[] = raw.slice(0, 10).map((m) => ({
        match_id: m.match_id,
        start_time: m.start_time,
        hero_id: m.hero_id,
        hero_name: m.hero_name,
        hero_icon: m.hero_icon,
        hero_tag: m.hero_tag,
        result: m.result,
        kda: m.kda,
        net_worth: m.net_worth,
        duration_s: m.duration_s,
        mode: modeOf(m),
        ranked_delta: m.ranked_delta,
        rank_label: m.match_rank_division
          ? `Sentinel ${ROMAN[m.match_rank_division_tier ?? 0] ?? m.match_rank_division_tier}.${m.match_rank_division}`
          : null,
      }))

      const netWorths = scored.map((m) => m.net_worth)

      return {
        rank: mmr?.rank_name
          ? {
              name: mmr.rank_name,
              division: mmr.division ?? 0,
              tier: mmr.division_tier ?? 0,
              points: mmr.rank_points ?? 0,
              max: mmr.rank_points_max ?? 1000,
              updatedAt: mmr.rank_updated_at ?? null,
            }
          : null,
        totals: matchesRes?.totals ?? null,
        stats: statsRes
          ? {
              kda: statsRes.kda ?? 0,
              accuracy: statsRes.accuracy ?? 0,
              headshot_rate: statsRes.headshot_rate ?? 0,
              riskBand: statsRes.risk_band ?? null,
            }
          : null,
        ranked,
        unranked: sideOf(unrankedMatches).matches ? sideOf(unrankedMatches) : null,
        economy: {
          avgNetWorth: Math.round(avg(netWorths)),
          bestNetWorth: netWorths.length ? Math.max(...netWorths) : 0,
          avgDuration: Math.round(avg(scored.map((m) => m.duration_s))),
        },
        streak: { current, best },
        heroes,
        recent,
        favorites: favRes?.favorite_items ?? [],
        sample: raw.length,
      }
    } catch {
      return null
    }
  })
})
