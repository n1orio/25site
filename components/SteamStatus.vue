<script setup lang="ts">
defineProps<{
  steam: any
  steamPillText: string
  steamHeadlineText: string
  steamSublineText: string
}>()
</script>

<template>
  <a :href="steam?.profileurl || '#'" target="_blank"
    class="theme-card p-5 rounded-[24px] flex-1 flex flex-col gap-5 relative overflow-hidden group cursor-pointer h-fit">
    <div v-if="(steam?.isPlaying && steam?.gameArt) || (!steam?.isPlaying && steam?.recentGameArt)"
      class="absolute inset-0 z-0">
      <img :src="steam?.isPlaying ? steam.gameArt : steam.recentGameArt"
        class="w-full h-full object-cover opacity-30 dark:opacity-40 group-hover:scale-105 transition-transform duration-700" />
      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/80 dark:from-zinc-900 dark:via-zinc-900/80 to-transparent"></div>
    </div>
    <div class="flex justify-between items-center z-10">
      <div class="flex items-center gap-2">
        <Icon name="mdi:steam" class="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
        <p class="text-[10px] uppercase font-black tracking-widest text-zinc-500">Steam</p>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full transition-colors"
          :class="steam?.isPlaying ? 'bg-green-500' : steam?.state !== 'Не в сети' ? 'bg-blue-500' : 'bg-zinc-500'"></span>
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{{ steam?.isPlaying ? "В игре" : steam?.state !== "Не в сети" ? "В сети" : "Оффлайн" }}</span>
      </div>
    </div>
    <div class="flex items-center gap-4 z-10 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md">
      <template v-if="steam?.isPlaying && steam?.gameArt">
        <img :src="steam.gameArt" class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shadow-sm flex-shrink-0" />
      </template>
      <template v-else-if="steam?.recentGameArt">
        <img :src="steam.recentGameArt" class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shadow-sm opacity-80 grayscale group-hover:grayscale-0 transition duration-700 flex-shrink-0" />
      </template>
      <template v-else>
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400 flex-shrink-0 transition-colors">
          <Icon name="lucide:moon" class="w-6 h-6 transition-colors duration-700" />
        </div>
      </template>
      <div class="min-w-0 flex flex-col justify-center">
        <p class="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-0.5"
          :style="{ color: steam?.isPlaying || steam?.recentGame ? 'var(--accent)' : '' }">{{ steamPillText }}</p>
        <p class="font-bold text-zinc-900 dark:text-white text-sm sm:text-base truncate">{{ steamHeadlineText }}</p>
        <p class="text-xs text-zinc-500 mt-0.5 truncate">{{ steamSublineText }}</p>
      </div>
    </div>
  </a>
</template>
