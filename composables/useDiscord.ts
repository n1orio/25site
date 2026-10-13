import { computed } from "vue"
import type { Ref } from "vue"
import type { LanyardActivity, LanyardData } from "~/types/steam"

/** useFetch отдаёт { data }, но компонент может передать и сам ответ */
export type DiscordSource = Ref<LanyardData | { data?: LanyardData } | null | undefined>

export const useDiscord = (discord: DiscordSource) => {
  const discordData = computed<LanyardData>(() => {
    const raw = discord.value
    if (raw && "data" in raw && raw.data) return raw.data
    return (raw as LanyardData | null) || {}
  })

  const discordUser = computed(() => discordData.value?.discord_user)
  const discordStatus = computed(() =>
    discordData.value?.discord_status || discordData.value?.status || "offline"
  )

  const discordStatusColor = computed(() => {
    switch (discordStatus.value) {
      case "online": return "#22c55e"
      case "idle":   return "#eab308"
      case "dnd":    return "#ef4444"
      default:       return "#71717a"
    }
  })

  const visibleActivities = computed(() => {
    if (!discordData.value?.activities) return []
    return discordData.value.activities.filter((a: LanyardActivity) => a.type !== 4)
  })

  const getActivityTypeLabel = (activity: LanyardActivity) => {
    switch (activity.type) {
      case 0: return "Играет в"
      case 1: return "Стримит"
      case 2: return `Слушает ${activity.name}`
      case 3: return "Смотрит"
      case 5: return "Соревнуется в"
      default: return "Активность"
    }
  }

  const getActivityTitle = (activity: LanyardActivity): string => {
    if (activity.type === 2) return activity.details || activity.name || "Неизвестно"
    return activity.name || "Неизвестно"
  }

  const getActivitySublines = (activity: LanyardActivity): string[] => {
    const parts = activity.type === 2
      ? [activity.state]
      : [activity.details, activity.state]
    return parts.filter((v): v is string => Boolean(v))
  }

  const getActivityIcon = (type: number) => {
    switch (type) {
      case 0: return "lucide:gamepad-2"
      case 1: return "lucide:radio"
      case 2: return "lucide:headphones"
      case 3: return "lucide:tv"
      case 5: return "lucide:trophy"
      default: return "lucide:activity"
    }
  }

  const getDiscordAssetUrl = (appId: string | undefined, assetId: string | null | undefined) => {
    if (!assetId) return undefined
    if (assetId.startsWith("https://") || assetId.startsWith("http://")) return assetId
    if (assetId.startsWith("mp:external/")) return `https://media.discordapp.net/external/${assetId.slice(12)}`
    if (assetId.startsWith("mp:attachments/")) return `https://cdn.discordapp.com/attachments/${assetId.slice(15)}`
    if (assetId.startsWith("spotify:")) return `https://i.scdn.co/image/${assetId.slice(8)}`
    return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`
  }

  const discordAvatarUrl = computed(() => {
    if (!discordUser.value || !discordUser.value.avatar)
      return "https://cdn.discordapp.com/embed/avatars/0.png"
    const { id, avatar } = discordUser.value
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar.startsWith("a_") ? "gif" : "png"}`
  })

  return {
    discordData, discordUser, discordStatus, discordStatusColor,
    visibleActivities, getActivityTypeLabel, getActivityTitle,
    getActivitySublines, getActivityIcon, getDiscordAssetUrl, discordAvatarUrl,
  }
}
