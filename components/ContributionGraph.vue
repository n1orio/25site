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
  active.value = day
  const box = wrapRef.value.getBoundingClientRect()
  const cell = (el ?? null)?.getBoundingClientRect()
  if (!cell) return
  // держим поповер внутри графика, не даём уехать за края
  const left = Math.min(Math.max(cell.left - box.left + cell.width / 2, 70), box.width - 70)
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

onMounted(() => document.addEventListener("keydown", onKey))
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

    <div class="flex gap-1.5">
      <!-- дни недели -->
      <div class="flex flex-col gap-[3px] shrink-0">
        <span
          v-for="(d, i) in WEEKDAYS"
          :key="d"
          class="h-[10px] text-[0.5rem] leading-[10px] text-right pr-0.5"
          style="color: var(--text-secondary)"
        >{{ i % 2 === 1 ? d : '' }}</span>
      </div>

      <div class="overflow-x-auto hide-scrollbar min-w-0 flex-1">
        <!-- месяцы -->
        <div class="flex gap-[3px] mb-1 h-3">
          <span
            v-for="(label, i) in monthLabels"
            :key="i"
            class="text-[0.5rem] leading-3 whitespace-nowrap shrink-0 w-[10px]"
            style="color: var(--text-secondary)"
          >{{ label }}</span>
        </div>

        <!-- дни -->
        <div class="flex gap-[3px]">
          <div v-for="(col, ci) in weeks" :key="ci" class="flex flex-col gap-[3px] shrink-0">
            <button
              v-for="(day, di) in col"
              :key="day?.date ?? `empty-${ci}-${di}`"
              type="button"
              class="w-[10px] h-[10px] rounded-[2px] p-0 border-0"
              :class="day ? 'cursor-pointer' : 'pointer-events-none'"
              :style="day
                ? {
                    background: tile(day.level),
                    outline: active?.date === day.date ? '1px solid var(--accent-contrast)' : 'none',
                    outlineOffset: '1px',
                  }
                : { background: 'transparent' }"
              :disabled="!day"
              :aria-label="day ? `${formatDate(day.date)}: ${LEVEL_TEXT[day.level]}` : undefined"
              @mouseenter="showPop(day, $event.currentTarget as HTMLElement)"
              @focus="showPop(day, $event.currentTarget as HTMLElement)"
              @mouseleave="hidePop"
              @blur="hidePop"
              @click="day && (showPop(day, $event.currentTarget as HTMLElement), togglePin(day))"
            />
          </div>
        </div>
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
