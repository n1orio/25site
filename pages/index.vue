<script setup lang="ts">
import { socials } from "~/config"
</script>

<template>
  <section class="v2-section">
    <header class="flex items-baseline gap-3 mb-3">
      <span class="v2-index">02</span>
      <h2 class="v2-label">Связь</h2>
    </header>

    <a
      v-for="(social, i) in socials"
      :key="social.name"
      :href="social.url"
      target="_blank"
      rel="noopener"
      class="v2-row group"
    >
      <span class="v2-num">{{ String(i + 1).padStart(2, '0') }}</span>
      <Icon
        :name="social.icon"
        size="18"
        class="w-[18px] h-[18px] flex-shrink-0 self-center transition-colors duration-300"
        :style="{ color: social.color }"
      />
      <span class="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:underline underline-offset-4 decoration-1 transition-colors">
        {{ social.name }}
      </span>
      <span class="hidden sm:inline text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ social.desc }}</span>
      <Icon name="lucide:arrow-up-right" size="14"
        class="ml-auto flex-shrink-0 self-center text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"
        :style="{ color: social.color }" />
    </a>
  </section>
</template>
