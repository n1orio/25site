import { socials } from "~/config"

export interface DiscordServerData {
  name: string | null
  icon: string | null
  members: number
  online: number
}

/** код инвайта берём из ссылки на сервер в config.ts, чтобы он не дублировался */
const inviteCode = () => {
  const discord = socials.find((s) => /discord\.gg\/|discord\.com\/invite\//i.test(s.url))
  const m = discord?.url.match(/(?:discord\.gg\/|discord\.com\/invite\/)([\w-]+)/i)
  return m?.[1] ?? null
}

interface InviteResponse {
  approximate_member_count?: number
  approximate_presence_count?: number
  guild?: { name?: string; icon?: string }
}

/**
 * Публичный эндпоинт Discord для инвайт-ссылок: отдаёт примерное число
 * участников и онлайна без токена. Кэш 10 минут — цифры меняются медленно,
 * а лимиты Discord жёсткие.
 */
export default defineEventHandler(async (): Promise<DiscordServerData | null> => {
  return cachedFetch<DiscordServerData | null>("discord-server", 10 * 60 * 1000, async () => {
    const code = inviteCode()
    if (!code) return null

    try {
      const res = await $fetch<InviteResponse>(
        `https://discord.com/api/v10/invites/${code}`,
        { query: { with_counts: true } },
      )

      return {
        name: res.guild?.name ?? null,
        icon: res.guild?.icon
          ? `https://cdn.discordapp.com/icons/${res.guild.icon}.png`
          : null,
        members: res.approximate_member_count ?? 0,
        online: res.approximate_presence_count ?? 0,
      }
    } catch {
      return null
    }
  })
})
