export interface DeadlockMatch {
  match_id: number
  start_time: number
  hero_id: number
  hero_name: string
  hero_icon: string
  result: string
  kda: string
  net_worth: number
  duration_s: number
}

export interface DeadlockHero {
  name: string
  icon: string
  matches: number
  wins: number
  kda: string[]
}

export interface DeadlockData {
  rank: { name: string; division: number; tier: number; points: number; max: number } | null
  totals: { matches: number; wins: number; losses: number; winrate: number } | null
  stats: { kda: number; accuracy: number; headshot_rate: number } | null
  heroes: DeadlockHero[]
  recent: DeadlockMatch[]
}
