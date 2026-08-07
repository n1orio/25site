<script setup lang="ts">
import { username } from "~/config"
defineProps<{
  discordAvatarUrl: string
  discordStatusColor: string
  bioTitle: string
  bioParagraph0: string
  bioParagraph1: string
  bioParagraph2: string
}>()
</script>

<template>
  <header class="w-full flex justify-between items-center mb-2 px-2">
    <h1 class="font-heading font-black text-zinc-900 dark:text-white text-3xl tracking-tighter flex items-center gap-2 transition-colors duration-700">
      nio<span class="transition-colors duration-700" :style="{ color: 'var(--accent)' }">.</span>
    </h1>
  </header>

  <div class="theme-card p-6 sm:p-8 rounded-2xl flex flex-col gap-6 cursor-default transition-colors duration-700">
    <div class="flex items-center gap-5">
      <div class="relative flex-shrink-0">
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-br transition-all duration-700"
          :style="{ backgroundImage: `linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)` }">
          <img :src="discordAvatarUrl" class="w-full h-full rounded-full border-[3px] border-white dark:border-zinc-900 object-cover" />
        </div>
        <span class="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white dark:border-zinc-900 transition-colors duration-500"
          :style="{ backgroundColor: discordStatusColor }"></span>
      </div>
      <div class="flex flex-col justify-center">
        <h2 class="font-heading text-2xl sm:text-3xl font-black tracking-tight pb-0.5" :style="{ color: 'var(--accent)' }">{{ bioTitle }}</h2>
        <p class="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">{{ username }}</p>
      </div>
    </div>
    <div class="w-full h-[1px] bg-zinc-200 dark:bg-white/10 transition-colors duration-700"></div>
    <div class="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3 transition-colors duration-700">
      <p>{{ bioParagraph0 }}</p>
      <p>{{ bioParagraph1 }}</p>
      <p>{{ bioParagraph2 }}</p>
    </div>
  </div>
</template>
