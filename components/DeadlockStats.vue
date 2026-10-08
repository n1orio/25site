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
    <div v-if="!data" class="ds-card p-6">
      <p class="ds-meta">нет данных</p>
    </div>

    <template v-else>
      <div class="ds-card p-5 sm:p-6">
        <div class="flex items-center gap-5 mb-5">
          <div class="ds-scallop flex-shrink-0">
            <Icon name="lucide:crosshair" size="22" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <div class="flex items-baseline gap-2">
              <span class="ds-stat">{{ rankLabel ?? "—" }}</span>
              <span v-if="data.rank" class="ds-meta tabular-nums">{{ data.rank.points }} / {{ data.rank.max }}</span>
            </div>
            <p class="ds-meta mt-1">Текущий ранг</p>
          </div>
        </div>

        <div v-if="data.rank" class="ds-bar mb-6">
          <span :style="{ width: `${rankProgress}%` }" />
        </div>

        <div v-if="data.stats" class="grid grid-cols-3 gap-3 mb-6">
          <div v-for="s in [
            { label: 'KDA', value: data.stats.kda.toFixed(2) },
            { label: 'Accuracy', value: data.stats.accuracy.toFixed(1) + '%' },
            { label: 'HS', value: data.stats.headshot_rate.toFixed(1) + '%' },
          ]" :key="s.label" class="ds-pill justify-center flex-col !items-center gap-0.5 py-2.5">
            <span class="ds-meta">{{ s.label }}</span>
            <span class="ds-stat text-base">{{ s.value }}</span>
          </div>
        </div>

        <div v-if="data.totals">
          <div class="flex items-baseline justify-between mb-2">
            <span class="ds-meta">{{ data.totals.matches }} матчей</span>
            <span class="ds-stat">{{ winrateLabel }}</span>
          </div>
          <div class="ds-bar mb-2">
            <span :style="{ width: `${data.totals.winrate}%` }" />
          </div>
          <p class="ds-meta">{{ recordLabel }}</p>
        </div>
      </div>

      <div v-if="data.heroes.length" class="ds-card p-5 sm:p-6 mt-4">
        <p class="ds-meta mb-3">Любимые герои</p>
        <div
          v-for="(hero, i) in data.heroes"
          :key="hero.name"
          class="flex items-center gap-3 py-2.5 border-b border-white/20 last:border-0"
        >
          <span class="ds-num w-6">{{ String(i + 1).padStart(2, '0') }}</span>
          <img v-if="hero.icon" :src="heroIconUrl(hero.icon)" :alt="hero.name" width="22" height="22"
            class="w-[22px] h-[22px] object-cover rounded-lg flex-shrink-0" loading="lazy">
          <span class="ds-title text-sm">{{ hero.name }}</span>
          <span class="ds-meta ml-auto">
            {{ hero.matches }} м · {{ heroWinrate(hero.wins, hero.matches) }}%
          </span>
        </div>
      </div>

      <div v-if="data.recent.length" class="ds-card p-5 sm:p-6 mt-4">
        <p class="ds-meta mb-3">Последние матчи</p>
        <div
          v-for="m in data.recent"
          :key="m.match_id"
          class="flex items-center gap-3 py-2.5 border-b border-white/20 last:border-0"
        >
          <img v-if="m.hero_icon" :src="heroIconUrl(m.hero_icon)" :alt="m.hero_name" width="22" height="22"
            class="w-[22px] h-[22px] object-cover rounded-lg flex-shrink-0" loading="lazy">
          <span class="ds-title text-sm">{{ m.hero_name }}</span>
          <span class="ds-pill !py-0.5 !px-2 !border-0" :style="m.result === 'Win'
            ? { background: 'var(--accent-contrast)', color: 'var(--accent)' }
            : { background: 'color-mix(in srgb, var(--accent-contrast) 22%, transparent)', color: 'var(--accent-contrast)' }">
            {{ m.result === 'Win' ? 'Победа' : 'Поражение' }}
          </span>
          <span class="ds-meta ml-auto">{{ m.kda }} · {{ matchDuration(m.duration_s) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
