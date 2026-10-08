<script setup lang="ts">
defineProps<{
  steam: any
  steamPillText: string
  steamHeadlineText: string
  steamSublineText: string
}>()
</script>

<template>
  <a :href="steam?.profileurl || '#'" target="_blank" rel="noopener"
    class="flex-1 flex flex-col gap-3 group cursor-pointer">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <Icon name="mdi:steam" class="w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-colors" />
        <p class="v2-label">Steam</p>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full transition-colors"
          :class="steam?.isPlaying ? 'bg-green-500' : steam?.state !== 'Не в сети' ? 'bg-blue-500' : 'bg-zinc-500'"></span>
        <span class="v2-label">{{ steam?.isPlaying ? "в игре" : steam?.state !== "Не в сети" ? "в сети" : "оффлайн" }}</span>
      </div>
    </div>

    <div class="v2-row">
      <template v-if="steam?.isPlaying && steam?.gameArt">
        <img :src="steam.gameArt" class="w-10 h-10 object-cover flex-shrink-0" loading="lazy" />
      </template>
      <template v-else-if="steam?.recentGameArt">
        <img :src="steam.recentGameArt" class="w-10 h-10 object-cover opacity-70 grayscale group-hover:grayscale-0 transition duration-700 flex-shrink-0" loading="lazy" />
      </template>
      <template v-else>
        <div class="w-10 h-10 flex items-center justify-center text-zinc-400 flex-shrink-0">
          <Icon name="lucide:moon" class="w-5 h-5 transition-colors duration-700" />
        </div>
      </template>

      <div class="min-w-0 flex flex-col justify-center">
        <p class="v2-label mb-0.5"
          :style="{ color: steam?.isPlaying || steam?.recentGame ? 'var(--accent)' : '' }">{{ steamPillText }}</p>
        <p class="text-sm font-bold text-zinc-900 dark:text-white truncate">{{ steamHeadlineText }}</p>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ steamSublineText }}</p>
      </div>
    </div>
  </a>
</template>
