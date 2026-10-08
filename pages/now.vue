<script setup lang="ts">
import { topAnime, animeDisclaimer } from "~/config"

const medal = (i: number) => ["#f59e0b", "#a1a1aa", "#d97706"][i]
</script>

<template>
  <section class="v2-section">
    <header class="flex items-baseline gap-3 mb-3">
      <span class="v2-index">07</span>
      <h2 class="v2-label">Топ аниме</h2>
      <span class="ml-auto text-xs text-zinc-400 dark:text-zinc-500">{{ topAnime.length }} тайтлов</span>
    </header>

    <p class="v2-label leading-relaxed mb-4 max-w-prose normal-case tracking-normal">
      {{ animeDisclaimer }}
    </p>

    <div class="v2-panel p-5 sm:p-6">
      <div v-for="(anime, i) in topAnime" :key="anime.title" class="v2-row">
        <span class="v2-num font-bold" :style="i < 3 ? { color: medal(i) } : undefined">
          {{ String(i + 1).padStart(2, '0') }}
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{{ anime.title }}</h3>
          <p v-if="anime.desc" class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ anime.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
