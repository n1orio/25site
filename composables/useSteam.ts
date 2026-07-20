import { computed } from "vue"

export const useSteam = (steam: any) => {
  const steamPillText = computed(() => {
    if (steam.value?.isPlaying) return "Запущено сейчас"
    if (steam.value?.recentGame) return "Недавняя активность"
    return "Активность"
  })

  const steamHeadlineText = computed(() => {
    if (steam.value?.isPlaying) return steam.value.gameName
    if (steam.value?.recentGame) return steam.value.recentGame
    return "Нет недавней активности"
  })

  const steamSublineText = computed(() => {
    if (steam.value?.isPlaying) return "В игре"
    if (steam.value?.recentGame)
      return `${steam.value.recentHours} ч. за 2 недели • ${steam.value.totalGames} игр`
    return `${steam.value?.totalGames || 0} игр на аккаунте`
  })

  const steamNameText = computed(() => steam.value?.personaname || "Steam")
  const steamStateText = computed(() => steam.value?.state || "Оффлайн")

  const steamAvatarUrl = computed(() =>
    steam.value?.avatar ||
    "https://avatars.steamstatic.com/fef4412077fe1a2f08056c8531da75c2b0c22c0f_full.jpg"
  )

  const isOnline = computed(() => {
    const steamOnline = steam.value?.isPlaying || steam.value?.state === "В сети"
    return steamOnline
  })

  return {
    steamPillText, steamHeadlineText, steamSublineText,
    steamNameText, steamStateText, steamAvatarUrl, isOnline,
  }
}
