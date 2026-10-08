export interface DeadlockMatch {
  match_id: number
  start_time: number
  hero_id: number
  hero_name: string
  hero_icon: string
  hero_tag: string
  result: string
  kda: string
  net_worth: number
  duration_s: number
  mode: Mode
  ranked_delta: number | null
  rank_label: string | null
}

export type Mode = "ranked" | "standard" | "street-brawl"

export interface DeadlockSide {
  matches: number
  wins: number
  losses: number
  winrate: number
}

export interface DeadlockHero {
  name: string
  tag: string
  icon: string
  matches: number
  wins: number
  winrate: number
  avgKda: number
  avgKills: number
  avgDuration: number
}

export interface DeadlockData {
  rank: {
    name: string
    division: number
    tier: number
    points: number
    max: number
    updatedAt: number | null
  } | null
  totals: { matches: number; wins: number; losses: number; winrate: number } | null
  stats: {
    kda: number
    accuracy: number
    headshot_rate: number
    riskBand: string | null
  } | null
  ranked: (DeadlockSide & { delta: number; deltaBest: number; deltaWorst: number }) | null
  unranked: DeadlockSide | null
  economy: { avgNetWorth: number; bestNetWorth: number; avgDuration: number }
  streak: { current: number; best: number }
  heroes: DeadlockHero[]
  recent: DeadlockMatch[]
  favorites: { name: string; image: string }[]
  /** матчей в выборке (лимит API — 50) */
  sample: number
}
