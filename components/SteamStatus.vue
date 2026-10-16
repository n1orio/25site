<script setup lang="ts">
import { computed } from "vue"
import type { SteamData } from "~/types/steam"
import { isSteamOffline } from "~/types/steam"

const props = defineProps<{
  steam: SteamData | null | undefined
  steamPillText: string
  steamHeadlineText: string
  steamSublineText: string
}>()

/**
 * Steam сообщает оффлайн несколькими строками («Не в сети», «Скрыт»),
 * а при ошибке API поле state может быть пустым. Сравнение с одной
 * строкой показывало синюю точку «в сети» офлайн-игрока, поэтому
 * оффлайн определяем явно.
 */
const isOffline = computed(() => isSteamOffline(props.steam))

// «в игре» — только когда реально что-то запущено, иначе просто «в сети»
const statusLabel = computed(() =>
  props.steam?.isPlaying ? "в игре" : isOffline.value ? "оффлайн" : "в сети",
)
const statusDot = computed(() =>
  props.steam?.isPlaying ? "bg-green-500" : isOffline.value ? "bg-zinc-500" : "bg-blue-500",
)
</script>

<template>
  <a :href="steam?.profileurl || '#'" target="_blank" rel="noopener" class="flex flex-col gap-3 group">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon name="mdi:steam" size="16" class="w-4 h-4" style="color: var(--accent-contrast)" />
        <p class="ds-meta">Steam</p>
      </div>
      <span class="ds-pill !py-0.5 !px-2">
        <span class="w-1.5 h-1.5 rounded-full" :class="statusDot" />
        {{ statusLabel }}
      </span>
    </div>

    <div
class="flex items-center gap-3 p-3 transition-colors"
      style="background: color-mix(in srgb, var(--accent-contrast) 14%, transparent); border-radius: var(--radius-pill)">
      <template v-if="steam?.isPlaying && steam?.gameArt">
        <img :src="steam.gameArt" class="w-10 h-10 object-cover flex-shrink-0" style="border-radius: var(--radius-card)" loading="lazy" >
      </template>
      <template v-else-if="steam?.recentGameArt">
        <img
:src="steam.recentGameArt" class="w-10 h-10 object-cover opacity-70 grayscale group-hover:grayscale-0 transition duration-300 flex-shrink-0"
          style="border-radius: var(--radius-card)" loading="lazy" >
      </template>
      <template v-else>
        <div class="w-10 h-10 flex items-center justify-center flex-shrink-0" style="color: var(--text-secondary)">
          <Icon name="lucide:moon" size="20" class="w-5 h-5" />
        </div>
      </template>

      <div class="min-w-0 flex flex-col justify-center">
        <p class="ds-meta mb-0.5">{{ steamPillText }}</p>
        <p class="ds-title text-sm truncate">{{ steamHeadlineText }}</p>
        <p class="ds-body text-xs truncate">{{ steamSublineText }}</p>
      </div>
    </div>
  </a>
</template>
