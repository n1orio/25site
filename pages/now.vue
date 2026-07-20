<template>
  <div class="flex flex-col gap-4">
    <div
      class="p-4 rounded-2xl theme-pill text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-center cursor-default"
    >
      <span class="font-medium">{{ animeDisclaimer }}</span>
    </div>

    <div
      v-for="(anime, i) in topAnime"
      :key="anime.title"
      class="relative p-4 rounded-2xl theme-card flex items-center gap-4 cursor-default"
    >
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black text-base flex-shrink-0"
        :class="i < 3 ? '' : 'theme-pill'"
        :style="getRankStyle(i)"
      >
        <span>{{ i + 1 }}</span>
      </div>

      <div class="min-w-0 flex-1 flex flex-col justify-center">
        <h3
          class="font-heading font-bold text-zinc-900 dark:text-white text-sm truncate"
        >
          <span>{{ anime.title }}</span>
        </h3>

        <p
          v-if="anime.desc"
          class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5"
        >
          <span>{{ anime.desc }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { topAnime, animeDisclaimer } from "~/config"
const { primaryColor, isDark } = useSecretTheme();

// Номер: топ-3 с особым стилем
const getRankStyle = (i) => {
  if (i === 0) {
    return {
      color: "#f59e0b",
      backgroundColor: "color-mix(in srgb, #f59e0b 15%, transparent)",
      boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
    };
  }
  if (i === 1) {
    return {
      color: "#a1a1aa",
      backgroundColor: "color-mix(in srgb, #a1a1aa 15%, transparent)",
    };
  }
  if (i === 2) {
    return {
      color: "#d97706",
      backgroundColor: "color-mix(in srgb, #d97706 15%, transparent)",
    };
  }
  return {
    color: primaryColor.value,
    backgroundColor: isDark.value
      ? `color-mix(in srgb, ${primaryColor.value} 15%, transparent)`
      : `color-mix(in srgb, ${primaryColor.value} 8%, transparent)`,
  };
};
</script>
