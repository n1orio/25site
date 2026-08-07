<template>
  <div class="flex flex-col gap-6">
    <div class="theme-card rounded-2xl overflow-hidden flex flex-col p-2">
      <div class="px-5 pt-4 pb-2">
        <h3
          class="font-heading text-[10px] font-black tracking-widest uppercase text-zinc-500 transition-colors"

        >
          Основное железо
        </h3>
      </div>

      <ul class="flex flex-col">
        <li
          v-for="(item, index) in workstationItems"
          :key="index"
          class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-3 px-5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="text-sm font-bold text-zinc-900 dark:text-white truncate transition-colors"

            >
              {{ item.name }}
            </span>
            <div
              v-if="item.comment"
              class="group/tooltip relative flex items-center justify-center cursor-help"
            >
              <Icon
                name="lucide:info"
                class="w-3.5 h-3.5 text-zinc-400 hover:text-[var(--accent)] transition-colors"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold text-center rounded-xl opacity-0 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all pointer-events-none z-50 shadow-xl"
              >
                <span>{{ item.comment }}</span>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900 dark:border-t-white"
                ></div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 min-w-0">
            <a
              v-if="item.link"
              :href="item.link"
              target="_blank"
              class="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 hover:text-[var(--accent)] transition-colors truncate"
            >
              <span class="truncate">{{ item.value }}</span>
              <Icon name="lucide:external-link" class="w-3 h-3 flex-shrink-0" />
            </a>
            <span
              v-else
              class="text-xs sm:text-sm text-zinc-500 truncate transition-colors"
            >
              {{ item.value }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="theme-card rounded-2xl overflow-hidden flex flex-col p-2">
      <div class="px-5 pt-4 pb-2 flex justify-between items-center">
        <h3
          class="font-heading text-[10px] font-black tracking-widest uppercase text-zinc-500 transition-colors"
        >
          Дополнительно
        </h3>
        <span
          class="font-mono text-xs font-bold text-[var(--accent)] tracking-widest transition-colors"

        >
          {{ currentFrame }}
        </span>
      </div>

      <ul class="flex flex-col">
        <li
          v-for="(item, index) in baseItems"
          :key="index"
          class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 py-3 px-5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="text-sm font-bold text-zinc-900 dark:text-white truncate transition-colors"

            >
              {{ item.name }}
            </span>
            <div
              v-if="item.comment"
              class="group/tooltip relative flex items-center justify-center cursor-help"
            >
              <Icon
                name="lucide:info"
                class="w-3.5 h-3.5 text-zinc-400 hover:text-[var(--accent)] transition-colors"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold text-center rounded-xl opacity-0 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all pointer-events-none z-50 shadow-xl"
              >
                <span>{{ item.comment }}</span>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900 dark:border-t-white"
                ></div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="text-xs sm:text-sm text-zinc-500 truncate transition-colors"
            >
              {{ item.value }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { workstationItems, baseItems } from "~/config";
const { accentColor } = useSecretTheme();

// ASCII-анимация
const frames = [" \\(°O°)/ ", " —(°O°)— ", " /(°O°)\\ ", " —(°O°)— "];
const currentFrame = ref(frames[0]);
let animationInterval = null;

onMounted(() => {
  let i = 0;
  animationInterval = setInterval(() => {
    i = (i + 1) % frames.length;
    currentFrame.value = frames[i];
  }, 400);
});

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval);
});
</script>
