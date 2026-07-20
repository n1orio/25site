<template>
  <div class="flex flex-col gap-3">
    <a
      v-for="social in socials"
      :key="social.name"
      :href="social.url"
      target="_blank"
      class="group p-4 rounded-[24px] flex items-center gap-4 cursor-pointer transition-all duration-300 theme-card"
      :style="{ '--brand': social.color }"
    >
      <Icon
        :name="social.icon"
        size="28"
        class="social-icon flex-shrink-0 transition-colors duration-300"
      />
      <div class="min-w-0 flex-1">
        <h3
          class="font-heading font-bold text-base text-zinc-900 dark:text-white transition-colors duration-300 social-text truncate"
        >
          {{ social.name }}
        </h3>
        <p
          class="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300 social-subtext truncate"
        >
          {{ social.desc }}
        </p>
      </div>
    </a>
  </div>
</template>

<script setup>
import { socials } from "~/config"
</script>

<style scoped>
/* Иконка в фирменный цвет */
.social-icon {
  color: var(--brand);
}

/* Ховер для светлой */
a:hover {
  background: rgba(0, 0, 0, 0.02);
}

/* Ховер для тёмной */
.dark a:hover {
  background: rgba(255, 255, 255, 0.04);
}
</style>
