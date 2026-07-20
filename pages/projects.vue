<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
    <div
      v-for="project in projects"
      :key="project.title"
      class="theme-card p-6 sm:p-8 rounded-[32px] flex flex-col justify-between h-full"
      :class="{ 'card-no-hover': project.noHover }"
    >
      <div>
        <div class="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-6">
          <Icon :name="project.icon" class="w-6 h-6" />
        </div>
        <h3 class="font-heading text-zinc-900 dark:text-white text-xl sm:text-2xl font-black mb-3 transition-colors">
          {{ project.title }}
        </h3>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed transition-colors">
          {{ project.desc }}
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          {{ tag }}
        </span>
      </div>

      <div v-if="project.links.length" class="flex flex-wrap gap-2 mt-3">
        <a
          v-for="link in project.links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-all duration-300"
        >
          <Icon :name="link.icon" class="w-4 h-4" />
          {{ link.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { projects } from "~/config"
</script>

<style>
.card-no-hover.theme-card:hover {
  background: rgba(255, 255, 255, 0.65) !important;
  border-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow:
    0 4px 24px -8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
  transform: none !important;
}
.dark .card-no-hover.theme-card:hover {
  background: rgba(24, 24, 27, 0.55) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  box-shadow:
    0 4px 24px -8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
  transform: none !important;
}
</style>
