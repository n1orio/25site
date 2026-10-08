<script setup lang="ts">
import { topAnime, animeDisclaimer } from "~/config"

const medal = (i: number) => ["#f59e0b", "#a1a1aa", "#d97706"][i]
</script>

<template>
  <section class="ds-section">
    <header class="flex items-center gap-3 mb-4">
      <h2 class="on-bg-meta">Топ аниме</h2>
      <WaveDivider class="flex-1" />
    </header>

    <p class="on-bg-body text-xs mb-4 max-w-prose">{{ animeDisclaimer }}</p>

    <div class="ds-card p-5 sm:p-6">
      <div
        v-for="(anime, i) in topAnime"
        :key="anime.title"
        class="flex items-baseline gap-3 py-3 border-b border-white/20 last:border-0"
      >
        <span class="ds-num w-8 font-bold" :style="i < 3 ? { color: medal(i) } : undefined">
          {{ String(i + 1).padStart(2, '0') }}
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="ds-title text-sm">{{ anime.title }}</h3>
          <p v-if="anime.desc" class="ds-body text-xs">{{ anime.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
