<script setup lang="ts">
import type { VisitorsData } from "~/server/api/visitors"

const { data: visitors } = await useFetch<VisitorsData>("/api/visitors", {
  // счётчик не должен кэшироваться на клиенте надолго
  server: false,
  default: () => ({ today: 0, month: 0, total: 0 }),
})
</script>

<template>
  <footer class="w-full pt-6 mt-16" style="border-top: 1px solid var(--border-subtle)">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <p class="on-bg-meta">
        <span style="color: var(--text-primary)">Niorio</span> · MIT · {{ new Date().getFullYear() }}
      </p>

      <p class="on-bg-meta flex items-center gap-1.5">
        <Icon name="lucide:eye" size="12" class="w-3 h-3" />
        <span class="tabular-nums">{{ visitors.month }}</span> за 30 дней
      </p>

      <p class="on-bg-meta">
        Сделано на
        <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="footer-link">Nuxt</a>
        <span class="mx-1 opacity-60">+</span>
        <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" class="footer-link">Tailwind</a>
        <span class="mx-1 opacity-60">+</span>
        <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="footer-link">Vue</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  color: var(--accent-on-bg);
  font-weight: 700;
  transition: opacity 0.3s ease;
}
.footer-link:hover { opacity: 0.7; }
</style>
