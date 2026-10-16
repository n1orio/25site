<script setup lang="ts">
import type { ContributionsData } from "~/server/api/contributions"

const props = defineProps<{ data: ContributionsData | null | undefined }>()

const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"]

const tile = (level: number) =>
  `color-mix(in srgb, var(--accent-contrast) ${12 + level * 22}%, transparent)`

type Cell = { date: string; level: number } | null

const weeks = computed<Cell[][]>(() => {
  const days = props.data?.days ?? []
  if (!days.length) return []

  // раскладываем дни в колонки: новая колонка начинается с воскресенья
  const cols: Cell[][] = []
  let col: Cell[] = []
  for (const day of days) {
    const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay()
    if (dow === 0 && col.length) {
      cols.push(col)
      col = []
    }
    col.push(day)
  }
  if (col.length) cols.push(col)

  // первая неделя добирается пустыми клетками, последняя — дополняется до семи
  const firstDow = new Date(`${days[0]!.date}T00:00:00Z`).getUTCDay()
  if (firstDow > 0 && cols[0]) cols[0] = [...Array<Cell>(firstDow).fill(null), ...cols[0]]
  const last = cols[cols.length - 1]
  if (last) while (last.length < 7) last.push(null)

  return cols
})

/** месяц под первым днём каждой колонки */
const monthLabels = computed(() => {
  const out: (string | null)[] = []
  let last = -1
  for (const col of weeks.value) {
    const first = col.find(Boolean)
    if (!first) { out.push(null); continue }
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth()
    out.push(month !== last ? (MONTHS[month] ?? "") : "")
    last = month
  }
  return out
})

const LEVEL_TEXT = ["без вкладов", "немного", "средне", "много", "очень много"]
const MONTHS_FULL = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]

const formatDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getUTCDate()} ${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** выбранный день: поповер держим на ячейке, как на GitHub */
const active = ref<{ date: string; level: number } | null>(null)
const pinned = ref(false)
const wrapRef = ref<HTMLElement | null>(null)
const popStyle = ref<Record<string, string>>({})

const showPop = (day: { date: string; level: number } | null, el?: HTMLElement | null) => {
  if (!day || !wrapRef.value) return
  const cell = (el ?? null)?.getBoundingClientRect()
  // без прямоугольника нечего позиционировать: если выставить
  // active раньше, поповер остался бы висеть на месте прошлой ячейки
  if (!cell) return
  active.value = day
  const box = wrapRef.value.getBoundingClientRect()
  // держим поповер внутри графика, не даём уехать за края.
  // На узком графике box.width < 140, и Math.max дал бы отрицательную
  // левую границу — поэтому ограничиваем и правый край тоже.
  const left = Math.min(
    Math.max(cell.left - box.left + cell.width / 2, 70),
    Math.max(box.width - 70, 70),
  )
  popStyle.value = {
    left: `${left}px`,
    top: `${cell.top - box.top + cell.height / 2}px`,
  }
}

const hidePop = () => {
  if (!pinned.value) active.value = null
}

const togglePin = (day: { date: string; level: number }) => {
  pinned.value = !pinned.value
  if (pinned.value) active.value = day
  else active.value = null
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && pinned.value) {
    pinned.value = false
    active.value = null
  }
}

const scrollRef = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener("keydown", onKey)
  // на телефоне график шире экрана — показываем свежие недели, а не год назад
  if (scrollRef.value) scrollRef.value.scrollLeft = scrollRef.value.scrollWidth
})
onUnmounted(() => document.removeEventListener("keydown", onKey))

const formatRange = (from: string, to: string) => {
  if (!from || !to) return ""
  const f = new Date(`${from}T00:00:00Z`)
  const t = new Date(`${to}T00:00:00Z`)
  if (Number.isNaN(f.getTime()) || Number.isNaN(t.getTime())) return ""
  return `${MONTHS[f.getUTCMonth()]} ${f.getUTCFullYear()} — ${MONTHS[t.getUTCMonth()]} ${t.getUTCFullYear()}`
}
</script>

<template>
  <div v-if="data" ref="wrapRef" data-contrib class="ds-card p-5 sm:p-6 relative" @mouseleave="hidePop">
    <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <p class="ds-meta">Вклады</p>
      <p class="ds-meta tabular-nums">{{ formatRange(data.from, data.to) }}</p>
    </div>

    <div class="flex flex-wrap items-baseline gap-x-5 gap-y-1 my-3">
      <span class="flex items-baseline gap-1.5">
        <span class="ds-stat text-xl">{{ data.activeDays }}</span>
        <span class="ds-meta">активных дней</span>
      </span>
      <span class="flex items-baseline gap-1.5">
        <span class="ds-stat text-xl">{{ data.longestStreak }}</span>
        <span class="ds-meta">дней подряд</span>
      </span>
      <span class="flex items-baseline gap-1.5">
        <span class="ds-stat text-xl">{{ data.total }}</span>
        <span class="ds-meta">дней в периоде</span>
      </span>
    </div>

    <!--
      Одна сетка на весь график: колонка подписей + по колонке на неделю.
      Клетки тянутся на всю ширину карточки (раньше были фиксированные
      10px и справа оставалась пустота), а на узком экране упираются в
      минимум и график прокручивается — сразу к свежим неделям.
    -->
    <div ref="scrollRef" class="overflow-x-auto hide-scrollbar">
      <div
        class="contrib-grid"
        :style="{ gridTemplateColumns: `auto repeat(${weeks.length}, minmax(10px, 1fr))` }"
      >
        <!-- месяцы -->
        <span class="contrib-dow" />
        <span
          v-for="(label, i) in monthLabels"
          :key="`m-${i}`"
          class="text-[0.5rem] leading-3 whitespace-nowrap overflow-visible"
          style="color: var(--text-secondary)"
        >{{ label }}</span>

        <!-- дни недели: подпись + клетки ряда -->
        <template v-for="(d, row) in WEEKDAYS" :key="d">
          <span
            class="contrib-dow text-[0.5rem] leading-none pr-1"
            style="color: var(--text-secondary)"
          >{{ row % 2 === 1 ? d : '' }}</span>
          <template v-for="(col, ci) in weeks" :key="`${ci}-${row}`">
            <button
              v-if="col[row]"
              type="button"
              class="contrib-cell cursor-pointer"
              :style="{
                background: tile(col[row]!.level),
                outline: active?.date === col[row]!.date ? '1px solid var(--accent-contrast)' : 'none',
                outlineOffset: '1px',
              }"
              :aria-label="`${formatDate(col[row]!.date)}: ${LEVEL_TEXT[col[row]!.level]}`"
              @mouseenter="showPop(col[row]!, $event.currentTarget as HTMLElement)"
              @focus="showPop(col[row]!, $event.currentTarget as HTMLElement)"
              @mouseleave="hidePop"
              @blur="hidePop"
              @click="showPop(col[row]!, $event.currentTarget as HTMLElement), togglePin(col[row]!)"
            />
            <span v-else class="contrib-cell" aria-hidden="true" />
          </template>
        </template>
      </div>
    </div>

    <!-- поповер дня, как на GitHub -->
    <div
      v-if="active"
      class="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap px-2.5 py-1.5"
      :style="{
        ...popStyle,
        background: 'var(--accent-contrast)',
        color: 'var(--accent-surface)',
        borderRadius: 'var(--radius-pill)',
      }"
    >
      <span class="text-[0.6875rem] font-bold">
        {{ LEVEL_TEXT[active.level] }} · {{ formatDate(active.date) }}
      </span>
    </div>

    <div class="flex items-center gap-1.5 mt-3">
      <span class="ds-meta">меньше</span>
      <span
        v-for="lv in [0, 1, 2, 3, 4]"
        :key="lv"
        class="w-[10px] h-[10px] rounded-[2px]"
        :style="{ background: tile(lv) }"
      />
      <span class="ds-meta">больше</span>
    </div>
  </div>
</template>

<style scoped>
.contrib-grid {
  display: grid;
  gap: 3px;
  min-width: min-content;
}
/* подписи дней недели не уезжают при прокрутке графика на телефоне */
.contrib-dow {
  position: sticky;
  left: 0;
  z-index: 1;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: var(--accent-surface);
}
.contrib-cell {
  display: block;
  aspect-ratio: 1;
  min-width: 10px;
  max-height: 16px;
  max-width: 16px;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 2px;
}
</style>
