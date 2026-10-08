<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { workstationItems, baseItems } from "~/config"

const frames = [" \\(°O°)/ ", " —(°O°)— ", " /(°O°)\\ ", " —(°O°)— "]
const currentFrame = ref(frames[0])
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  let i = 0
  animationInterval = setInterval(() => {
    i = (i + 1) % frames.length
    currentFrame.value = frames[i]
  }, 400)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <section class="v2-section">
      <header class="flex items-baseline gap-3 mb-3">
        <span class="v2-index">04</span>
        <h2 class="v2-label">Основное железо</h2>
      </header>

      <div v-for="(item, index) in workstationItems" :key="index" class="v2-row group">
        <span class="v2-num">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="text-sm text-zinc-500 dark:text-zinc-400 w-28 sm:w-32 flex-shrink-0 truncate">{{ item.name }}</span>

        <component :is="item.link ? 'a' : 'span'"
          :href="item.link"
          :target="item.link ? '_blank' : undefined"
          :rel="item.link ? 'noopener' : undefined"
          class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5 min-w-0"
          :class="item.link ? 'hover:text-[var(--accent)] transition-colors' : ''">
          <span class="truncate">{{ item.value }}</span>
          <Icon v-if="item.link" name="lucide:external-link" class="w-3 h-3 flex-shrink-0" />
        </component>

        <span v-if="item.comment" class="ml-auto text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[45%] hidden sm:block text-right">
          {{ item.comment }}
        </span>
      </div>
    </section>

    <section class="v2-section">
      <header class="flex items-baseline gap-3 mb-3">
        <span class="v2-index">04.1</span>
        <h2 class="v2-label">Дополнительно</h2>
        <span class="ml-auto text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">{{ currentFrame }}</span>
      </header>

      <div v-for="(item, index) in baseItems" :key="index" class="v2-row">
        <span class="v2-num">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="text-sm text-zinc-500 dark:text-zinc-400 w-28 sm:w-32 flex-shrink-0 truncate">{{ item.name }}</span>
        <span class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{{ item.value }}</span>
        <span v-if="item.comment" class="ml-auto text-xs text-zinc-400 dark:text-zinc-500 truncate">{{ item.comment }}</span>
      </div>
    </section>
  </div>
</template>
