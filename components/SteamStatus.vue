<script setup lang="ts">
defineProps<{
  steam: any
  steamPillText: string
  steamHeadlineText: string
  steamSublineText: string
}>()
</script>

<template>
  <a :href="steam?.profileurl || '#'" target="_blank" rel="noopener" class="flex flex-col gap-3 group">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon name="mdi:steam" size="16" class="w-4 h-4" style="color: var(--accent-contrast)" />
        <p class="ds-meta">Steam</p>
      </div>
      <span class="ds-pill !py-0.5 !px-2">
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="steam?.isPlaying ? 'bg-green-500' : steam?.state !== 'Не в сети' ? 'bg-blue-500' : 'bg-zinc-500'" />
        {{ steam?.isPlaying ? "в игре" : steam?.state !== "Не в сети" ? "в сети" : "оффлайн" }}
      </span>
    </div>

    <div class="flex items-center gap-3 p-3 transition-colors"
      style="background: color-mix(in srgb, var(--accent-contrast) 14%, transparent); border-radius: var(--radius-pill)">
      <template v-if="steam?.isPlaying && steam?.gameArt">
        <img :src="steam.gameArt" class="w-10 h-10 object-cover flex-shrink-0" style="border-radius: var(--radius-card)" loading="lazy" />
      </template>
      <template v-else-if="steam?.recentGameArt">
        <img :src="steam.recentGameArt" class="w-10 h-10 object-cover opacity-70 grayscale group-hover:grayscale-0 transition duration-700 flex-shrink-0"
          style="border-radius: var(--radius-card)" loading="lazy" />
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
