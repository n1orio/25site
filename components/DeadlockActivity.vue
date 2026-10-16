<script setup lang="ts">
import type { DeadlockActivity } from "~/types/deadlock"
import type { ActivityCell } from "~/composables/useDeadlock"

/**
 * Хитмап активности в духе ddlk.bio: наведение или фокус показывает
 * карточку дня (матчи, победы/поражения, время в игре), клик её
 * закрепляет, по дням можно ходить стрелками.
 */
const props = defineProps<{
  activity: DeadlockActivity
  weeks: (ActivityCell | null)[][]
  hoursLabel: string
}>()

const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
const MONTHS_FULL = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
const WEEKDAYS_FULL = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}
const matchesText = (n: number) => `${n} ${plural(n, "матч", "матча", "матчей")}`

const parse = (iso: string) => new Date(`${iso}T00:00:00Z`)
const shortDate = (iso: string) => {
  const d = parse(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}
const longDate = (iso: string) => {
  const d = parse(iso)
  return `${d.getUTCDate()} ${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
const weekdayName = (iso: string) => WEEKDAYS_FULL[parse(iso).getUTCDay()]

const durationText = (s: number) => {
  if (!s) return "—"
  const h = Math.floor(s / 3600)
  // как на ddlk.bio: неполная минута отбрасывается
  const m = Math.floor((s % 3600) / 60)
  return h ? `${h} ч ${m} мин` : `${m} мин`
}

/** месяц над первой неделей, где он начался */
const monthLabels = computed(() => {
  let last = -1
  return props.weeks.map((week) => {
    const first = week.find(Boolean)
    if (!first) return ""
    const month = parse(first.date).getUTCMonth()
    if (month === last) return ""
    last = month
    return MONTHS[month] ?? ""
  })
})

/** все дни окна по порядку — для навигации стрелками */
const cells = computed(() => props.weeks.flat().filter((c): c is ActivityCell => !!c))

const level = (matches: number) => {
  if (!matches) return 0
  const ratio = matches / Math.max(1, props.activity.maxPerDay)
  return ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1
}
const tile = (lv: number) =>
  lv === 0
    ? "color-mix(in srgb, var(--accent-contrast) 10%, transparent)"
    : `color-mix(in srgb, var(--accent-contrast) ${25 + lv * 18}%, transparent)`

const stats = computed(() => {
  const a = props.activity
  const wins = a.days.reduce((s, d) => s + d.wins, 0)
  const losses = a.days.reduce((s, d) => s + d.losses, 0)
  const decided = wins + losses
  return [
    { label: "В игре", value: props.hoursLabel },
    { label: "Матчей", value: String(a.totalMatches) },
    { label: "Активных дней", value: `${a.days.filter((d) => d.matches).length} / ${cells.value.length}` },
    { label: "Винрейт", value: decided ? `${Math.round((wins / decided) * 100)}%` : "—" },
  ]
})

// --- выбранный день и карточка ---
const wrapRef = ref<HTMLElement | null>(null)
const active = ref<ActivityCell | null>(null)
const pinned = ref(false)
/** день, который получает фокус по Tab (roving tabindex) */
const focusDate = ref<string | null>(null)
const popStyle = ref<Record<string, string>>({})
const popBelow = ref(false)

const cellEl = (date: string) =>
  wrapRef.value?.querySelector<HTMLElement>(`[data-date="${date}"]`) ?? null

const place = (day: ActivityCell) => {
  const el = cellEl(day.date)
  const wrap = wrapRef.value
  if (!el || !wrap) return
  active.value = day
  const box = wrap.getBoundingClientRect()
  const cell = el.getBoundingClientRect()
  const half = 104 // половина ширины карточки, держим её внутри секции
  const left = Math.min(Math.max(cell.left - box.left + cell.width / 2, half), Math.max(box.width - half, half))
  // сверху карточке не хватает места — показываем под клеткой
  popBelow.value = cell.top - box.top < 150
  popStyle.value = {
    left: `${left}px`,
    top: `${(popBelow.value ? cell.bottom : cell.top) - box.top}px`,
  }
}

const show = (day: ActivityCell) => {
  if (pinned.value && active.value?.date !== day.date) return
  place(day)
}
const hide = () => {
  if (!pinned.value) active.value = null
}
const toggle = (day: ActivityCell) => {
  focusDate.value = day.date
  if (pinned.value && active.value?.date === day.date) {
    pinned.value = false
    return
  }
  pinned.value = true
  place(day)
}
const unpin = () => {
  pinned.value = false
  active.value = null
}

const onKey = (e: KeyboardEvent, day: ActivityCell) => {
  const list = cells.value
  const i = list.findIndex((c) => c.date === day.date)
  const step: Record<string, number> = {
    ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1,
    Home: -i, End: list.length - 1 - i,
  }
  if (e.key === "Escape") {
    unpin()
    return
  }
  if (!(e.key in step)) return
  // стрелки не должны листать вкладки сайта (useNavigation)
  e.preventDefault()
  e.stopPropagation()
  const next = list[Math.min(Math.max(i + step[e.key]!, 0), list.length - 1)]
  if (!next) return
  focusDate.value = next.date
  nextTick(() => {
    cellEl(next.date)?.focus()
    if (pinned.value) place(next)
  })
}

/** лучший день: клик по подписи сразу открывает его карточку */
const showBusiest = () => {
  const b = props.activity.busiest
  const day = b && cells.value.find((c) => c.date === b.date)
  if (day) toggle(day)
}

const onDocKey = (e: KeyboardEvent) => { if (e.key === "Escape" && pinned.value) unpin() }
const onDocClick = (e: MouseEvent) => {
  if (pinned.value && !wrapRef.value?.contains(e.target as Node)) unpin()
}
onMounted(() => {
  focusDate.value = props.activity.busiest?.date ?? cells.value.at(-1)?.date ?? null
  document.addEventListener("keydown", onDocKey)
  document.addEventListener("click", onDocClick)
})
onUnmounted(() => {
  document.removeEventListener("keydown", onDocKey)
  document.removeEventListener("click", onDocClick)
})
</script>

<template>
  <section ref="wrapRef" class="ds-card p-5 sm:p-6 relative" @mouseleave="hide">
    <div class="flex items-baseline justify-between flex-wrap gap-2 mb-4">
      <p class="ds-meta">Активность</p>
      <span class="ds-meta tabular-nums">
        {{ matchesText(activity.totalMatches) }} · {{ shortDate(activity.windowStart) }} — {{ shortDate(activity.windowEnd) }}
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] gap-5 items-start">
      <div class="min-w-0">
        <div
          class="dl-heat"
          role="grid"
          aria-label="Матчи по дням; стрелки — переход между днями, Enter — закрепить"
          :style="{ gridTemplateColumns: `auto repeat(${weeks.length}, minmax(0, 1fr))` }"
        >
          <span />
          <span
            v-for="(label, i) in monthLabels"
            :key="`m-${i}`"
            class="dl-heat-month"
          >{{ label }}</span>

          <template v-for="(d, row) in WEEKDAYS" :key="d">
            <span class="dl-heat-dow">{{ row % 2 === 0 ? d : "" }}</span>
            <template v-for="(week, wi) in weeks" :key="`${wi}-${row}`">
              <button
                v-if="week[row]"
                type="button"
                class="dl-heat-cell"
                :class="{ 'is-active': active?.date === week[row]!.date }"
                :data-date="week[row]!.date"
                :tabindex="focusDate === week[row]!.date ? 0 : -1"
                :style="{ background: tile(level(week[row]!.matches)) }"
                :aria-label="`${longDate(week[row]!.date)}: ${week[row]!.matches ? matchesText(week[row]!.matches) : 'без матчей'}`"
                :aria-pressed="pinned && active?.date === week[row]!.date"
                @mouseenter="show(week[row]!)"
                @focus="show(week[row]!)"
                @blur="hide"
                @click.stop="toggle(week[row]!)"
                @keydown="onKey($event, week[row]!)"
              />
              <span v-else class="dl-heat-cell is-empty" aria-hidden="true" />
            </template>
          </template>
        </div>

        <div class="flex items-center justify-between gap-3 mt-3 flex-wrap">
          <button
            v-if="activity.busiest"
            type="button"
            class="ds-meta underline decoration-dotted underline-offset-4 hover:opacity-80"
            @click.stop="showBusiest"
          >
            лучший день: {{ matchesText(activity.busiest.matches) }}, {{ shortDate(activity.busiest.date) }}
          </button>
          <div class="flex items-center gap-1.5">
            <span class="ds-meta opacity-70">меньше</span>
            <span
              v-for="lv in [0, 1, 2, 3, 4]"
              :key="lv"
              class="w-[10px] h-[10px] rounded-[3px]"
              :style="{ background: tile(lv) }"
            />
            <span class="ds-meta opacity-70">больше</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div v-for="s in stats" :key="s.label" class="ds-pill ds-tile flex-col !items-start gap-1 py-3">
          <span class="ds-meta">{{ s.label }}</span>
          <span class="ds-stat text-base whitespace-nowrap">{{ s.value }}</span>
        </div>
      </div>
    </div>

    <!-- карточка дня, как на ddlk.bio -->
    <Transition name="dl-pop">
      <div
        v-if="active"
        class="dl-day-pop"
        :class="{ 'is-below': popBelow }"
        :style="popStyle"
        role="status"
      >
        <div class="flex items-baseline justify-between gap-3">
          <span class="dl-pop-meta">{{ longDate(active.date) }}</span>
          <span class="dl-pop-meta opacity-60">{{ weekdayName(active.date) }}</span>
        </div>
        <p class="dl-pop-title">{{ active.matches ? matchesText(active.matches) : "Без матчей" }}</p>

        <template v-if="active.matches">
          <div class="dl-pop-bar">
            <span :style="{ width: `${(active.wins / Math.max(1, active.wins + active.losses)) * 100}%` }" />
          </div>
          <div class="dl-pop-row"><span>Победы</span><b>{{ active.wins }}</b></div>
          <div class="dl-pop-row"><span>Поражения</span><b>{{ active.losses }}</b></div>
          <div class="dl-pop-row dl-pop-sep"><span>Время в игре</span><b>{{ durationText(active.duration_s) }}</b></div>
        </template>
        <p v-if="pinned" class="dl-pop-meta opacity-60 mt-2">Esc — закрыть</p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.dl-heat {
  display: grid;
  gap: 4px;
  /* на широкой карточке клетки не раздуваются в огромные квадраты */
  max-width: 34rem;
}
.dl-heat-month {
  font-size: 0.5625rem;
  line-height: 1;
  white-space: nowrap;
  overflow: visible;
  padding-bottom: 2px;
  color: color-mix(in srgb, var(--accent-contrast) 70%, transparent);
}
.dl-heat-dow {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 4px;
  font-size: 0.5625rem;
  line-height: 1;
  color: color-mix(in srgb, var(--accent-contrast) 70%, transparent);
}
.dl-heat-cell {
  display: block;
  aspect-ratio: 1;
  width: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  border-radius: 22%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.dl-heat-cell.is-empty { background: transparent; cursor: default; }
.dl-heat-cell:not(.is-empty):hover,
.dl-heat-cell.is-active {
  transform: scale(1.12);
  box-shadow: 0 0 0 2px var(--accent-contrast);
}
.dl-heat-cell:focus-visible {
  outline: 2px solid var(--accent-contrast);
  outline-offset: 2px;
}

.dl-day-pop {
  position: absolute;
  z-index: 30;
  width: 208px;
  padding: 0.75rem 0.875rem;
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 10px));
  border-radius: calc(var(--radius-card) - 0.25rem);
  background: var(--accent-contrast);
  color: var(--accent-surface);
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.28);
}
.dl-day-pop.is-below { transform: translate(-50%, 10px); }
.dl-pop-meta {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dl-pop-title {
  margin: 0.25rem 0 0.5rem;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
}
.dl-pop-bar {
  height: 4px;
  margin-bottom: 0.5rem;
  border-radius: 9999px;
  overflow: hidden;
  background: color-mix(in srgb, var(--accent-surface) 25%, transparent);
}
.dl-pop-bar > span {
  display: block;
  height: 100%;
  background: var(--accent-surface);
}
.dl-pop-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  line-height: 1.6;
}
.dl-pop-row b { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.dl-pop-sep {
  margin-top: 0.25rem;
  padding-top: 0.25rem;
  border-top: 1px solid color-mix(in srgb, var(--accent-surface) 20%, transparent);
}

.dl-pop-enter-active, .dl-pop-leave-active { transition: opacity 0.12s ease; }
.dl-pop-enter-from, .dl-pop-leave-to { opacity: 0; }
</style>
