<script setup lang="ts">
import { projects } from "~/config"
</script>

<template>
  <section class="v2-section">
    <header class="flex items-baseline gap-3 mb-3">
      <span class="v2-index">03</span>
      <h2 class="v2-label">Мои работы</h2>
    </header>

    <div class="v2-panel p-5 sm:p-6">
      <article v-for="(project, i) in projects" :key="project.title" class="py-5 border-b border-black/7 dark:border-white/8 last:border-0 first:pt-0 last:pb-0">
        <div class="flex items-baseline gap-3 mb-1.5">
          <span class="v2-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <Icon :name="project.icon" size="16" class="w-4 h-4 self-center flex-shrink-0" :style="{ color: 'var(--accent)' }" />
          <h3 class="font-heading text-zinc-900 dark:text-white text-base sm:text-lg font-black transition-colors">
            {{ project.title }}
          </h3>
          <a v-for="link in project.links" :key="link.url" :href="link.url" target="_blank" rel="noopener"
            class="ml-auto flex items-center gap-1 text-[0.6875rem] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex-shrink-0">
            <Icon :name="link.icon" size="13" class="w-3.5 h-3.5" />
            {{ link.label }}
          </a>
        </div>

        <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3 pl-[3.25rem] max-w-prose">
          {{ project.desc }}
        </p>

        <div class="flex flex-wrap gap-2 pl-[3.25rem]">
          <span v-for="tag in project.tags" :key="tag"
            class="text-[0.625rem] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {{ tag }}<span v-if="tag !== project.tags[project.tags.length - 1]" class="ml-2 opacity-40">/</span>
          </span>
        </div>
      </article>
    </div>
  </section>
</template>
