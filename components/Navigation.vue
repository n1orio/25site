<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from "vue"
import { onClickOutside } from "@vueuse/core"

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
  <nav class="relative w-full mb-6 md:mb-8 z-50">
    <div class="theme-card p-1.5 !rounded-full flex items-center w-full shadow-sm relative">
      <div class="flex-1 relative overflow-hidden rounded-full h-[40px]">
        <div v-if="showLeftArrow" class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-zinc-900 to-transparent z-10 pointer-events-none"></div>
        <div v-if="showRightArrow" class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent z-10 pointer-events-none"></div>
        <div ref="navScrollRef" @scroll="handleNavScroll" class="flex items-center overflow-x-auto hide-scrollbar relative h-full px-1">
          <div class="absolute top-0 bottom-0 my-auto h-[36px] rounded-full pointer-events-none z-0"
            :style="{
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              left: navIndicator.visible ? navIndicator.left + 'px' : '0px',
              width: navIndicator.visible ? navIndicator.width + 'px' : '0px',
              opacity: navIndicator.visible ? 1 : 0,
              background: `color-mix(in srgb, var(--accent) 15%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent)`,
            }"></div>
          <NuxtLink to="/" class="nav-link cursor-pointer flex-shrink-0 z-10">Соцсети</NuxtLink>
          <NuxtLink to="/projects" class="nav-link cursor-pointer flex-shrink-0 z-10">Проекты</NuxtLink>
          <NuxtLink to="/uses" class="nav-link cursor-pointer flex-shrink-0 z-10">Мой Сетап</NuxtLink>
          <NuxtLink to="/now" class="nav-link cursor-pointer flex-shrink-0 z-10 mr-4">Топ Аниме</NuxtLink>
        </div>
      </div>
      <div class="w-[1px] h-6 bg-zinc-200 dark:bg-white/10 mx-2 flex-shrink-0 transition-colors duration-700"></div>
      <div class="flex items-center gap-1.5 pr-1 flex-shrink-0">
        <button @click="toggleDark()"
          class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
          <Icon :name="isDark ? 'lucide:moon' : 'lucide:sun'" class="w-4 h-4 transition-colors duration-300" :style="{ color: 'var(--accent)' }" />
        </button>
        <div class="relative" ref="paletteRef">
          <button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden"
            @click="showPalette = !showPalette">
            <div class="absolute inset-[2px] rounded-full animate-[spin_3s_linear_infinite] transition-colors duration-700"
              :style="{ background: `conic-gradient(from 0deg, transparent 0 300deg, var(--accent) 180deg, var(--accent-secondary) 360deg)` }"></div>
            <div class="absolute inset-[3px] rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center transition-colors duration-700">
              <Icon name="lucide:palette" class="w-3.5 h-3.5 transition-colors duration-300" :style="{ color: 'var(--accent)' }" />
            </div>
          </button>
          <Transition name="pop">
            <div v-if="showPalette" class="absolute right-0 top-full mt-4 p-4 theme-card !rounded-[24px] shadow-2xl flex flex-col gap-4 z-50 w-[260px] transition-colors duration-700 origin-top-right">
              <div class="flex flex-col gap-3">
                <p class="text-[10px] uppercase font-bold text-zinc-500 tracking-widest pl-1">Темы</p>
                <div class="grid grid-cols-2 gap-2">
                  <button v-for="preset in gradientPresets" :key="preset.id" @click="setGradient(preset.colors)"
                    class="flex flex-col gap-2 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer border border-transparent"
                    :class="{ 'bg-black/5 dark:bg-white/10 !border-black/10 dark:!border-white/10': themeMode === 'gradient' && activeGradient[0] === preset.colors[0] }">
                    <div class="w-full h-8 rounded-lg shadow-inner border border-black/5 dark:border-white/10 group-hover:scale-[1.03] transition-transform"
                      :style="{ background: `linear-gradient(135deg, ${preset.colors[0]} 10%, ${preset.colors[1]} 90%)` }"></div>
                    <span class="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 text-center uppercase tracking-wide">{{ preset.name }}</span>
                  </button>
                </div>
              </div>
              <div class="w-full h-[1px] bg-black/5 dark:bg-white/10 transition-colors duration-700"></div>
              <div class="flex items-center justify-between px-1">
                <p class="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Свой цвет</p>
                <div class="relative w-8 h-8 rounded-full overflow-hidden hover:scale-110 transition-transform shadow-inner cursor-pointer flex items-center justify-center bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)] transition-colors duration-700">
                  <div class="absolute inset-0.5 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                    <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: themeMode === 'single' ? primaryColor : 'transparent' }"></div>
                  </div>
                  <input type="color" :value="themeMode === 'single' ? primaryColor : '#ffffff'"
                    @input="setThemeColor(($event.target as HTMLInputElement).value)"
                    class="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </nav>
</template>
