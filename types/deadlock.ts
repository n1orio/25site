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
  /** место в матче из блока performance: доступно не для всех режимов */
  place: number | null
  participants: number | null
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

export interface DeadlockActivityDay {
  /** YYYY-MM-DD */
  date: string
  matches: number
  wins: number
  losses: number
  /** секунд, проведённых в матчах за день */
  duration_s: number
}

export interface DeadlockActivity {
  days: DeadlockActivityDay[]
  windowStart: string
  windowEnd: string
  /** матчей и часов за всё окно активности */
  totalMatches: number
  hours: number
  /** максимум матчей в дне — верхняя граница для хитмапа */
  maxPerDay: number
  busiest: { date: string; matches: number } | null
}

/** Среднее место в матче: ddlk считает его не во всех режимах */
export interface DeadlockPlace {
  avg: number
  best: number
  rated: number
}

export interface DeadlockData {
  rank: {
    name: string
    division: number
    tier: number
    points: number
    max: number
    updatedAt: number | null
    /** эмблема ранга с ddlk.bio: /assets/ranks/{division}_large_subrank{tier}_webp.webp */
    emblem: string | null
  } | null
  totals: { matches: number; wins: number; losses: number; winrate: number } | null
  stats: {
    kda: number
    accuracy: number
    headshot_rate: number
    riskBand: string | null
    /** вероятность читерства в процентах и уверенность оценки */
    cheaterPercent: number
    confidence: string | null
  } | null
  ranked: (DeadlockSide & { delta: number; deltaBest: number; deltaWorst: number }) | null
  unranked: DeadlockSide | null
  economy: { avgNetWorth: number; bestNetWorth: number; avgDuration: number }
  streak: { current: number; best: number }
  /** активность по дням (окно ddlk.bio — около трёх месяцев) */
  activity: DeadlockActivity | null
  /** среднее место в матче */
  place: DeadlockPlace | null
  heroes: DeadlockHero[]
  recent: DeadlockMatch[]
  favorites: { name: string; image: string; type: string; tier: number }[]
  /** матчей в выборке (лимит API — 50) */
  sample: number
}
