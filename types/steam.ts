/**
 * Формы ответов Steam Web API и Lanyard.
 *
 * Раньше эти структуры описывались как `any` и в composable, и в
 * компонентах, поэтому опечатки в именах полей (steam.gameArt против
 * steam.game_art) проходили типизацию молча и всплывали в вёрстке.
 */

export interface SteamGame {
  appid: number
  name?: string
  playtime_2weeks?: number
}

export interface SteamPlayer {
  personaname?: string
  profileurl?: string
  avatarfull?: string
  personastate?: number
  gameextrainfo?: string
  gameid?: string
}

export interface SteamData {
  personaname: string
  profileurl: string
  avatar: string
  /** «Не в сети» / «В сети» / «В игре» / … */
  state: string
  isPlaying: boolean
  gameName: string
  gameArt: string
  level: number
  recentGame: string
  recentGameArt: string
  recentHours: number
  totalRecentHours: number
  totalGames: number
}

/* --- сырые ответы Steam --- */

export interface SteamPlayerSummaryResponse {
  response?: { players?: SteamPlayer[] }
}

export interface SteamLevelResponse {
  response?: { player_level?: number }
}

export interface SteamRecentGamesResponse {
  response?: { games?: SteamGame[] }
}

export interface SteamOwnedGamesResponse {
  response?: { game_count?: number }
}

/* --- Lanyard --- */

export interface LanyardAssets {
  large_image?: string | null
  large_text?: string | null
  small_image?: string | null
  small_text?: string | null
}

export interface LanyardActivity {
  type: number
  name?: string
  url?: string
  details?: string | null
  state?: string | null
  application_id?: string
  assets?: LanyardAssets
}

export interface LanyardData {
  success?: boolean
  error?: string
  discord_user?: {
    id: string
    avatar?: string | null
    username?: string
    discriminator?: string
  }
  discord_status?: string
  status?: string
  activities?: LanyardActivity[]
}

/** Значения, при которых Steam считается офлайн. */
export const STEAM_OFFLINE_STATES = ["Не в сети", "Скрыт", ""]

export const isSteamOffline = (steam?: SteamData | null) =>
  !steam?.isPlaying && STEAM_OFFLINE_STATES.includes(steam?.state ?? "")