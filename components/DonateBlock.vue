<script setup lang="ts">
import { donations } from "~/config"
</script>

<template>
  <section v-if="donations.length" class="ds-section mt-10">
    <header class="flex items-center gap-3 mb-4">
      <h2 class="on-bg-meta">Поддержать</h2>
      <WaveDivider class="flex-1" />
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a
        v-for="d in donations"
        :key="d.url"
        :href="d.url"
        target="_blank"
        rel="noopener"
        class="ds-card p-5 flex items-center gap-4 group relative"
        :class="d.featured ? 'ds-card-hover' : ''"
      >
        <span
          class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          :style="d.featured
            ? { background: 'var(--accent-contrast)', color: 'var(--accent-surface)' }
            : { background: 'color-mix(in srgb, var(--accent-contrast) 18%, transparent)', color: 'var(--accent-contrast)' }"
        >
          <Icon name="lucide:coffee" size="20" class="w-5 h-5" />
        </span>

        <div class="min-w-0 flex-1">
          <h3 class="ds-title text-base mb-0.5">{{ d.title }}</h3>
          <p class="ds-body text-xs leading-snug truncate">{{ d.note }}</p>
        </div>

        <span class="ds-action flex-shrink-0">
          <Icon name="lucide:arrow-up-right" size="14" class="w-3.5 h-3.5" />
        </span>
      </a>
    </div>

    <p class="on-bg-meta mt-3">любая сумма помогает развивать проекты</p>
  </section>
</template>
