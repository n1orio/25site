<script setup lang="ts">
import type { ContributionsData } from "~/server/api/contributions"

defineProps<{ data: ContributionsData }>()

const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
</script>

<template>
  <div class="ds-card p-5 sm:p-6 mt-4">
    <p class="ds-meta mb-4">Профиль разработчика</p>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <div class="ds-pill flex-col items-start gap-1 py-3">
        <span class="ds-stat">{{ data.activityRate }}%</span>
        <span class="ds-meta">дней с активностью</span>
      </div>
      <div class="ds-pill flex-col items-start gap-1 py-3">
        <span class="ds-stat">{{ WEEKDAYS[data.topWeekday] }}</span>
        <span class="ds-meta">самый активный день</span>
      </div>
      <div class="ds-pill flex-col items-start gap-1 py-3">
        <span class="ds-stat">{{ data.topWeekCount }}</span>
        <span class="ds-meta">дней в лучшей неделе</span>
      </div>
      <div class="ds-pill flex-col items-start gap-1 py-3">
        <span class="ds-stat">{{ data.longestStreak }}</span>
        <span class="ds-meta">дней подряд</span>
      </div>
    </div>

    <p class="ds-meta mb-2">Активность по дням недели</p>
    <div class="flex items-end gap-2">
      <div v-for="(count, i) in data.byWeekday" :key="WEEKDAYS[i]" class="flex-1 flex flex-col items-center gap-1.5">
        <span class="ds-meta tabular-nums">{{ count }}</span>
        <div
          class="w-full rounded-t-[3px]"
          :style="{
            height: `${Math.max(4, (count / Math.max(1, ...data.byWeekday)) * 72)}px`,
            background: i === data.topWeekday
              ? 'var(--accent-contrast)'
              : 'color-mix(in srgb, var(--accent-contrast) 28%, transparent)',
          }"
        />
        <span
          class="ds-meta"
          :style="i === data.topWeekday ? { color: 'var(--accent-contrast)' } : undefined"
        >{{ WEEKDAYS[i] }}</span>
      </div>
    </div>
  </div>
</template>
