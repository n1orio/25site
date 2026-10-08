<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from "vue"
import { onClickOutside } from "@vueuse/core"
import { navTabs } from "~/config"

const { isDark } = useSecretTheme()

const {
  navScrollRef, showLeftArrow, showRightArrow, navIndicator,
  handleNavScroll,
} = useNavigation()

const toggleDark = () => { isDark.value = !isDark.value }

const showPalette = ref(false)
const paletteRef = shallowRef<HTMLElement | null>(null)

const {
  gradientPresets, themeMode, activeGradient,
  primaryColor, secondaryColor,
  setSingleColor, setGradient,
} = useSecretTheme()

const setThemeColor = (color: string) => {
  setSingleColor(color)
  if (color === "#000000") isDark.value = true
  else if (color === "#ffffff") isDark.value = false
}

onClickOutside(paletteRef, () => { showPalette.value = false })
</script>

<template>
  <nav class="w-full mb-8 md:mb-12 z-50 flex justify-center">
    <div
      class="ds-card flex items-center w-full max-w-full md:max-w-fit px-2 py-1.5"
      style="border-radius: var(--radius-pill)"
    >
      <div class="flex-1 relative overflow-hidden h-[34px] min-w-0">
        <div v-if="showLeftArrow" class="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style="background: linear-gradient(to right, var(--accent-surface), transparent)" />
        <div v-if="showRightArrow" class="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style="background: linear-gradient(to left, var(--accent-surface), transparent)" />

        <div ref="navScrollRef" @scroll="handleNavScroll" class="flex items-center overflow-x-auto hide-scrollbar relative h-full px-1">
          <div
            class="absolute top-0 bottom-0 my-auto h-[28px] pointer-events-none z-0"
            :style="{
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              left: navIndicator.visible ? navIndicator.left + 'px' : '0px',
              width: navIndicator.visible ? navIndicator.width + 'px' : '0px',
              opacity: navIndicator.visible ? 1 : 0,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent-contrast)',
            }" />

          <NuxtLink
            v-for="(tab, i) in navTabs"
            :key="tab.to"
            :to="tab.to"
            class="nav-link cursor-pointer flex-shrink-0 z-10"
            :style="{ paddingRight: tab === navTabs[navTabs.length - 1] ? '0' : undefined }"
          >
            <span class="nav-num">{{ String(i + 1).padStart(2, '0') }}</span>
            {{ tab.label }}
          </NuxtLink>
        </div>
      </div>

      <span class="w-px h-5 mx-1.5 flex-shrink-0" style="background: color-mix(in srgb, var(--accent-contrast) 30%, transparent)" />

      <div class="flex items-center gap-1 flex-shrink-0">
        <button @click="toggleDark()"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          style="color: var(--accent-contrast)" aria-label="Сменить тему">
          <Icon :name="isDark ? 'lucide:moon' : 'lucide:sun'" size="16" class="w-4 h-4" />
        </button>

        <div class="relative" ref="paletteRef">
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer relative overflow-hidden"
            style="color: var(--accent-contrast)" aria-label="Цвета темы" @click="showPalette = !showPalette">
            <div class="absolute inset-[2px] rounded-full animate-[spin_3s_linear_infinite]"
              :style="{ background: `conic-gradient(from 0deg, transparent 0 300deg, var(--accent) 180deg, var(--accent-secondary) 360deg)` }" />
            <div class="absolute inset-[3px] rounded-full flex items-center justify-center" style="background: var(--accent-contrast)">
              <Icon name="lucide:palette" size="14" class="w-3.5 h-3.5" />
            </div>
          </button>

          <Transition name="pop">
            <div
              v-if="showPalette"
              class="ds-card absolute right-0 top-full mt-4 p-4 shadow-2xl flex flex-col gap-4 z-50 w-[260px] origin-top-right"
              style="border-radius: var(--radius-card); background: var(--bg-surface-elevated)"
            >
              <div class="flex flex-col gap-3">
                <p class="on-bg-meta">Темы</p>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="preset in gradientPresets"
                    :key="preset.id"
                    @click="setGradient(preset.colors)"
                    class="flex flex-col gap-2 p-2 rounded-xl transition-colors group cursor-pointer border"
                    :style="{
                      borderColor: themeMode === 'gradient' && activeGradient[0] === preset.colors[0]
                        ? 'var(--accent)' : 'transparent',
                    }"
                  >
                    <div class="w-full h-8 rounded-lg border"
                      :style="{
                        background: `linear-gradient(135deg, ${preset.colors[0]} 10%, ${preset.colors[1]} 90%)`,
                        borderColor: 'transparent',
                      }" />
                    <span class="on-bg-meta text-center">{{ preset.name }}</span>
                  </button>
                </div>
              </div>

              <span class="w-full h-px" style="background: color-mix(in srgb, var(--accent-contrast) 22%, transparent)" />

              <div class="flex items-center justify-between">
                <p class="on-bg-meta">Свой цвет</p>
                <div class="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer flex items-center justify-center"
                  style="background: conic-gradient(red,yellow,lime,aqua,blue,magenta,red)">
                  <div class="absolute inset-0.5 rounded-full flex items-center justify-center" style="background: var(--bg-primary)">
                    <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: themeMode === 'single' ? primaryColor : 'transparent' }" />
                  </div>
                  <input
                    type="color"
                    :value="themeMode === 'single' ? primaryColor : '#ffffff'"
                    class="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 opacity-0 cursor-pointer"
                    @input="setThemeColor(($event.target as HTMLInputElement).value)" />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </nav>
</template>
