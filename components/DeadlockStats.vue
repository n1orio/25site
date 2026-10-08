<script setup lang="ts">
import type { DeadlockData } from "~/types/deadlock"

const props = defineProps<{ data: DeadlockData | null | undefined }>()
const data = toRef(props, "data")

const {
  rankLabel, rankProgress, winrateLabel, recordLabel,
  heroWinrate, heroIconUrl, matchDuration,
} = useDeadlock(data)
</script>

<template>
  <div>
    <div v-if="!data" class="v2-panel p-5 sm:p-6">
      <p class="v2-label">нет данных</p>
    </div>

    <template v-else>
      <div class="v2-panel p-5 sm:p-6">
      <div class="flex items-baseline gap-2 mb-1">
        <span class="v2-stat-value text-zinc-900 dark:text-zinc-50">{{ rankLabel ?? "—" }}</span>
        <span v-if="data.rank" class="v2-label tabular-nums">{{ data.rank.points }} / {{ data.rank.max }}</span>
      </div>
      <div v-if="data.rank" class="v2-bar mb-4">
        <span :style="{ width: `${rankProgress}%` }" />
      </div>

      <div v-if="data.stats" class="grid grid-cols-3 gap-2 mb-4">
        <div>
          <div class="v2-label mb-0.5">KDA</div>
          <div class="v2-stat-value text-base">{{ data.stats.kda.toFixed(2) }}</div>
        </div>
        <div>
          <div class="v2-label mb-0.5">Accuracy</div>
          <div class="v2-stat-value text-base">{{ data.stats.accuracy.toFixed(1) }}%</div>
        </div>
        <div>
          <div class="v2-label mb-0.5">HS</div>
          <div class="v2-stat-value text-base">{{ data.stats.headshot_rate.toFixed(1) }}%</div>
        </div>
      </div>

      <div v-if="data.totals" class="mb-4">
        <div class="flex items-baseline justify-between mb-1">
          <span class="v2-label">{{ data.totals.matches }} матчей</span>
          <span class="v2-stat-value text-base">{{ winrateLabel }}</span>
        </div>
        <div class="v2-bar">
          <span :style="{ width: `${data.totals.winrate}%` }" />
        </div>
        <div class="v2-label mt-1 tabular-nums">{{ recordLabel }}</div>
      </div>

      <template v-if="data.heroes.length">
        <div class="v2-panel p-5 sm:p-6 mt-4">
          <div class="v2-label mb-1.5">Любимые герои</div>
          <div v-for="(hero, i) in data.heroes" :key="hero.name" class="v2-row">
            <span class="v2-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <img v-if="hero.icon" :src="heroIconUrl(hero.icon)" :alt="hero.name" width="18" height="18"
              class="w-[18px] h-[18px] object-cover self-center" loading="lazy">
            <span class="text-sm text-zinc-800 dark:text-zinc-200">{{ hero.name }}</span>
            <span class="ml-auto text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
              {{ hero.matches }} м · {{ heroWinrate(hero.wins, hero.matches) }}%
            </span>
          </div>
        </div>
      </template>

      <template v-if="data.recent.length">
        <div class="v2-panel p-5 sm:p-6 mt-4">
          <div class="v2-label mb-1.5">Последние матчи</div>
          <div v-for="m in data.recent" :key="m.match_id" class="v2-row">
            <img v-if="m.hero_icon" :src="heroIconUrl(m.hero_icon)" :alt="m.hero_name" width="18" height="18"
              class="w-[18px] h-[18px] object-cover self-center" loading="lazy">
            <span class="text-sm text-zinc-800 dark:text-zinc-200">{{ m.hero_name }}</span>
            <span class="text-xs tabular-nums"
              :class="m.result === 'Win' ? 'text-emerald-500' : 'text-rose-500'">{{ m.result === 'Win' ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ' }}</span>
            <span class="ml-auto text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">{{ m.kda }} · {{ matchDuration(m.duration_s) }}</span>
          </div>
        </div>
      </template>
      </div>
    </template>
  </div>
</template>
