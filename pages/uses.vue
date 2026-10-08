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
  <div class="flex flex-col gap-10">
    <section class="ds-section">
      <header class="flex items-center gap-3 mb-4">
        <h2 class="ds-meta">Основное железо</h2>
        <WaveDivider class="flex-1" />
      </header>

      <div class="ds-card p-5 sm:p-6">
        <div
          v-for="item in workstationItems"
          :key="item.name"
          class="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3 border-b border-white/20"
        >
          <span class="ds-meta w-28 sm:w-32 flex-shrink-0">{{ item.name }}</span>

          <component
            :is="item.link ? 'a' : 'span'"
            :href="item.link"
            :target="item.link ? '_blank' : undefined"
            :rel="item.link ? 'noopener' : undefined"
            class="ds-title text-sm flex items-center gap-1.5 min-w-0"
            :class="item.link ? 'hover:opacity-70 transition-opacity' : ''"
          >
            <span class="truncate">{{ item.value }}</span>
            <Icon v-if="item.link" name="lucide:external-link" class="w-3 h-3 flex-shrink-0" />
          </component>

          <span v-if="item.comment" class="ds-body text-xs ml-auto text-right max-w-[50%] hidden sm:block">
            {{ item.comment }}
          </span>
        </div>
      </div>
    </section>

    <section class="ds-section">
      <header class="flex items-center gap-3 mb-4">
        <h2 class="ds-meta">Дополнительно</h2>
        <span class="ds-meta ml-auto">{{ currentFrame }}</span>
        <WaveDivider class="flex-1 !max-w-[120px]" />
      </header>

      <div class="ds-card p-5 sm:p-6">
        <div
          v-for="item in baseItems"
          :key="item.name"
          class="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3 border-b border-white/20 last:border-0"
        >
          <span class="ds-meta w-28 sm:w-32 flex-shrink-0">{{ item.name }}</span>
          <span class="ds-title text-sm">{{ item.value }}</span>
          <span v-if="item.comment" class="ds-body text-xs ml-auto">{{ item.comment }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
