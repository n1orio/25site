<script setup lang="ts">
import { socials } from "~/config"
</script>

<template>
  <section class="ds-section">
    <header class="flex items-center gap-3 mb-4">
      <h2 class="ds-meta">Связь</h2>
      <WaveDivider class="flex-1" />
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <a
        v-for="social in socials"
        :key="social.name"
        :href="social.url"
        target="_blank"
        rel="noopener"
        class="ds-card ds-card-hover p-5 flex items-center gap-4 group relative"
      >
        <span
          class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style="background: rgba(255,255,255,0.18)"
        >
          <Icon :name="social.icon" size="20" class="w-5 h-5" style="color: var(--accent-contrast)" />
        </span>

        <div class="min-w-0 flex-1">
          <h3 class="ds-title text-base mb-0.5">{{ social.name }}</h3>
          <p class="ds-body text-xs leading-snug">{{ social.desc }}</p>
        </div>

        <span class="ds-action flex-shrink-0">
          <Icon name="lucide:arrow-up-right" size="14" class="w-3.5 h-3.5" />
        </span>
      </a>
    </div>
  </section>
</template>
