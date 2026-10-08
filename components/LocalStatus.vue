<script setup lang="ts">
import type { WeatherData } from "~/server/api/weather"
import { location } from "~/config"

const { data: weather } = await useFetch<WeatherData | null>("/api/weather")

// время тикает только на клиенте: на сервере рендерим заглушку,
// иначе гидрация получит другое значение и выдаст расхождение
const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

const timeFmt = new Intl.DateTimeFormat("ru-RU", {
  timeZone: location.timezone,
  hour: "2-digit",
  minute: "2-digit",
})
const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  timeZone: location.timezone,
  weekday: "long",
  day: "numeric",
  month: "long",
})

const time = computed(() => (now.value ? timeFmt.format(now.value) : "--:--"))
const date = computed(() => (now.value ? dateFmt.format(now.value) : ""))

const hour = computed(() => {
  if (!now.value) return 12
  // читаем час именно в городской таймзоне
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: location.timezone,
    hour: "numeric",
    hour12: false,
  }).format(now.value)
  return Number(parts)
})

const isNight = computed(() => hour.value < 6 || hour.value >= 20)

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => { now.value = new Date() }, 15_000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <section class="ds-card p-5 flex items-center gap-4">
    <Icon
      :name="isNight ? 'lucide:moon' : 'lucide:sun'"
      size="18"
      class="w-[18px] h-[18px] flex-shrink-0"
      :style="{ color: 'var(--accent-contrast)' }"
    />

    <div class="min-w-0 flex-1">
      <div class="flex items-baseline gap-2">
        <span class="ds-stat text-lg tabular-nums">{{ time }}</span>
        <span class="ds-meta truncate">{{ location.city }}</span>
      </div>
      <p v-if="date" class="ds-meta mt-0.5 normal-case tracking-normal leading-tight">
        {{ date }}
      </p>
      <p v-if="weather" class="ds-meta mt-0.5 normal-case tracking-normal leading-tight">
        {{ weather.temp }}°C, {{ weather.label }}
      </p>
    </div>

    <div v-if="weather" class="flex flex-col items-end gap-1 flex-shrink-0">
      <Icon
        :name="weather.icon"
        size="20"
        class="w-5 h-5"
        :style="{ color: 'var(--accent-contrast)' }"
      />
      <span class="ds-meta tabular-nums">{{ weather.wind }} м/с</span>
    </div>
  </section>
</template>
