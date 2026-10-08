<script setup lang="ts">
import type { DeadlockData } from "~/types/deadlock"

const props = defineProps<{ data: DeadlockData | null | undefined }>()
const data = toRef(props, "data")

// карта подписей нужна и в шаблоне
import { MODE_LABEL } from "~/composables/useDeadlock"

const {
  rankLabel, rankProgress, winrateLabel, recordLabel,
  heroIconUrl, itemImageUrl, matchDuration, netWorth, deltaLabel, daysAgo,
} = useDeadlock(data)

const riskLabel = computed(() => {
  const band = data.value?.stats?.riskBand
  if (!band) return null
  return { very_low: "минимальный", low: "низкий", medium: "средний", high: "высокий", very_high: "очень высокий" }[band] ?? band
})
</script>

<template>
  <div v-if="!data" class="ds-card p-6">
    <p class="ds-meta">нет данных</p>
  </div>

  <div v-else class="flex flex-col gap-4">
    <!-- ранг -->
    <section class="ds-card p-5 sm:p-6">
      <div class="flex items-center gap-5">
        <div class="ds-scallop flex-shrink-0" style="width: 5.5rem; height: 5.5rem">
          <img v-if="data.rank?.emblem" :src="data.rank.emblem" :alt="`${data.rank.name} ${data.rank.tier}`"
            class="w-14 h-14 object-contain" loading="lazy">
          <Icon v-else name="lucide:crosshair" size="22" class="w-5 h-5" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-baseline gap-2 flex-wrap">
            <span class="ds-stat text-xl">{{ rankLabel ?? "—" }}</span>
            <span v-if="data.rank" class="ds-meta tabular-nums">{{ data.rank.points }} / {{ data.rank.max }} очков</span>
          </div>
          <p class="ds-meta mt-1">
            Текущий ранг<template v-if="data.rank?.updatedAt"> · обновлён {{ daysAgo(data.rank.updatedAt) }}</template>
          </p>
        </div>
      </div>

      <div v-if="data.rank" class="ds-bar mt-5">
        <span :style="{ width: `${rankProgress}%` }" />
      </div>
      <div v-if="data.rank" class="flex justify-between mt-1.5">
        <span class="ds-meta">{{ rankProgress }}% до следующего</span>
        <span class="ds-meta">{{ data.rank.max - data.rank.points }} осталось</span>
      </div>
    </section>

    <!-- ключевые цифры -->
    <section class="ds-card p-5 sm:p-6">
      <p class="ds-meta mb-3">Ключевые показатели</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div v-for="s in [
          { label: 'KDA', value: data.stats?.kda.toFixed(2) ?? '—' },
          { label: 'Accuracy', value: data.stats ? data.stats.accuracy.toFixed(1) + '%' : '—' },
          { label: 'Хедшоты', value: data.stats ? data.stats.headshot_rate.toFixed(1) + '%' : '—' },
          { label: 'Матчей', value: data.totals?.matches ?? '—' },
          { label: 'Винрейт', value: winrateLabel ?? '—' },
          { label: 'Счёт', value: recordLabel ?? '—' },
        ]" :key="s.label" class="ds-pill flex-col items-start gap-1 !items-start py-3">
          <span class="ds-meta">{{ s.label }}</span>
          <span class="ds-stat">{{ s.value }}</span>
        </div>
      </div>

      <p v-if="riskLabel" class="ds-meta mt-3">
        Риск: {{ riskLabel }}
      </p>
    </section>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
    <!-- ранкед vs анранкед -->
    <section v-if="data.ranked || data.unranked" class="ds-card p-5 sm:p-6 flex flex-col">
      <p class="ds-meta mb-4">Ранкед против анранкеда</p>

      <div class="flex flex-col gap-4">
        <div v-for="row in [
          { key: 'ranked', label: 'Ранкед', side: data.ranked },
          { key: 'unranked', label: 'Анранкед', side: data.unranked },
        ].filter(r => r.side)" :key="row.key">
          <div class="flex items-baseline justify-between mb-1.5">
            <span class="ds-title text-sm">{{ row.label }}</span>
            <span class="ds-meta tabular-nums">{{ row.side!.matches }} м · {{ row.side!.wins }}W — {{ row.side!.losses }}L</span>
          </div>
          <div class="ds-bar">
            <span :style="{ width: `${row.side!.winrate}%` }" />
          </div>
          <div class="flex items-baseline justify-between mt-1.5">
            <span class="ds-meta">винрейт {{ row.side!.winrate }}%</span>
            <span v-if="'delta' in row.side!" class="ds-meta tabular-nums">
              <template v-if="(row.side as { delta: number }).delta !== 0">
                сумма очков {{ deltaLabel((row.side as { delta: number }).delta) }}
              </template>
            </span>
          </div>
        </div>
      </div>

      <div v-if="data.ranked && (data.ranked.deltaBest !== 0 || data.ranked.deltaWorst !== 0)" class="grid grid-cols-2 gap-3 mt-5">
        <div class="ds-pill flex-col items-start gap-1 py-3">
          <span class="ds-meta">Лучший плюс</span>
          <span class="ds-stat">{{ data.ranked.deltaBest > 0 ? '+' : '' }}{{ data.ranked.deltaBest }}</span>
        </div>
        <div class="ds-pill flex-col items-start gap-1 py-3">
          <span class="ds-meta">Худший минус</span>
          <span class="ds-stat">{{ data.ranked.deltaWorst }}</span>
        </div>
      </div>
    </section>

    <!-- экономика и серии -->
    <section class="ds-card p-5 sm:p-6 flex flex-col">
      <p class="ds-meta mb-3">Экономика и серии</p>
      <div class="grid grid-cols-2 gap-2.5">
        <div v-for="s in [
          { label: 'Ср. нетворс', value: netWorth(data.economy.avgNetWorth) },
          { label: 'Макс. нетворс', value: netWorth(data.economy.bestNetWorth) },
          { label: 'Ср. матч', value: matchDuration(data.economy.avgDuration) },
          { label: 'Серия', value: data.streak.current + ' / ' + data.streak.best },
        ]" :key="s.label" class="ds-pill flex-col items-start justify-center gap-0.5 py-2.5 h-full">
          <span class="ds-meta whitespace-nowrap">{{ s.label }}</span>
          <span class="ds-stat text-base">{{ s.value }}</span>
        </div>
      </div>
      <p class="ds-meta mt-3">текущая / рекордная серия побед подряд</p>
    </section>

    </div>

    <!-- герои -->
    <section v-if="data.heroes.length" class="ds-card p-5 sm:p-6">
      <p class="ds-meta mb-3">Герои за {{ data.sample }} последних матчей</p>

      <div v-for="hero in data.heroes" :key="hero.name" class="py-3 border-b last:border-0 border-white/20">
        <div class="flex items-center gap-3">
          <img v-if="hero.icon" :src="heroIconUrl(hero.icon)" :alt="hero.name" width="26" height="26"
            class="w-[26px] h-[26px] object-cover rounded-lg flex-shrink-0" loading="lazy">
          <span class="ds-title text-sm">{{ hero.name }}</span>
          <span class="ds-meta ml-auto tabular-nums">{{ hero.matches }} м · {{ hero.winrate }}%</span>
        </div>
        <div class="flex items-center gap-3 mt-1.5 ml-[38px]">
          <div class="ds-bar flex-1">
            <span :style="{ width: `${hero.winrate}%` }" />
          </div>
          <span class="ds-meta tabular-nums flex-shrink-0">
            KDA {{ hero.avgKda }} · {{ hero.avgKills }} уб.
          </span>
        </div>
      </div>
    </section>

    <!-- любимые предметы -->
    <section v-if="data.favorites.length" class="ds-card p-5 sm:p-6">
      <p class="ds-meta mb-3">Любимые улучшения</p>
      <div class="flex flex-wrap gap-2">
        <div v-for="item in data.favorites" :key="item.name"
          class="flex items-center gap-2 pr-3 py-1.5 pl-1.5"
          style="border-radius: var(--radius-pill); background: color-mix(in srgb, var(--accent-contrast) 12%, transparent)">
          <img :src="itemImageUrl(item.image)" :alt="item.name" width="28" height="28"
            class="w-7 h-7 object-contain flex-shrink-0" loading="lazy">
          <span class="ds-meta">{{ item.name }}</span>
        </div>
      </div>
    </section>

    <!-- последние матчи -->
    <section v-if="data.recent.length" class="ds-card p-5 sm:p-6">
      <p class="ds-meta mb-3">Последние матчи</p>
      <div v-for="m in data.recent" :key="m.match_id" class="flex items-center gap-3 py-2.5 border-b last:border-0 border-white/20">
        <img v-if="m.hero_icon" :src="heroIconUrl(m.hero_icon)" :alt="m.hero_name" width="22" height="22"
          class="w-[22px] h-[22px] object-cover rounded-lg flex-shrink-0" loading="lazy">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="ds-title text-sm truncate">{{ m.hero_name }}</span>
            <span class="ds-pill !py-0.5 !px-2"
              :style="m.result === 'Win'
                ? { background: 'var(--accent-contrast)', color: 'var(--accent-surface)' }
                : { background: 'color-mix(in srgb, var(--accent-contrast) 22%, transparent)', color: 'var(--accent-contrast)' }">
              {{ m.result === 'Win' ? 'Победа' : m.result === 'Loss' ? 'Поражение' : 'Без счёта' }}
            </span>
          </div>
          <p class="ds-meta mt-0.5">{{ MODE_LABEL[m.mode] }}<template v-if="m.rank_label"> · {{ m.rank_label }}</template></p>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="ds-title text-sm tabular-nums">{{ m.kda }}</p>
          <p class="ds-meta tabular-nums mt-0.5">
            {{ netWorth(m.net_worth) }} · {{ matchDuration(m.duration_s) }}
            <template v-if="m.ranked_delta !== null"> · {{ deltaLabel(m.ranked_delta) }}</template>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
