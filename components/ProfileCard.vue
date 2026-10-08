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
  <header class="w-full">
    <div class="flex items-center gap-4 mb-4">
      <div class="relative flex-shrink-0">
        <img :src="discordAvatarUrl" alt="avatar"
          class="w-16 h-16 sm:w-20 sm:h-20 object-cover transition-colors duration-700"
          :style="{ borderRadius: 'var(--cursor-radius)' }" />
        <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#101014] transition-colors duration-500"
          :style="{ backgroundColor: discordStatusColor }"></span>
      </div>
      <div class="min-w-0">
        <h1 class="font-heading font-black text-2xl sm:text-3xl tracking-tighter leading-none text-zinc-900 dark:text-white transition-colors duration-700">
          {{ username }}
        </h1>
        <p class="v2-label mt-1.5">{{ bioTitle }}</p>
      </div>
    </div>

    <div class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-2.5 transition-colors duration-700 max-w-prose">
      <p>{{ bioParagraph0 }}</p>
      <p>{{ bioParagraph1 }}</p>
      <p>{{ bioParagraph2 }}</p>
    </div>
  </header>
</template>
