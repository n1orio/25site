<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import { onClickOutside } from "@vueuse/core"

const {
  isDark, themeMode, activeGradient, accentColor,
  bgPrimary, bgSecondary, primaryColor, secondaryColor,
  gradientPresets, setSingleColor, setGradient,
} = useSecretTheme()

const toggleDark = () => { isDark.value = !isDark.value }

const { data: discord } = await useFetch("/api/discord")
const { data: steam } = await useFetch("/api/steam")

const {
  discordUser, discordStatus, discordStatusColor,
  visibleActivities, getActivityTypeLabel, getActivityTitle,
  getActivitySublines, getActivityIcon, getDiscordAssetUrl, discordAvatarUrl,
} = useDiscord(discord)

const {
  steamPillText, steamHeadlineText, steamSublineText,
  steamNameText, steamStateText, steamAvatarUrl, isOnline,
} = useSteam(steam)

const isDiscordOnline = computed(() => discordStatus.value !== "offline")

const {
  cursorRef, isCursorVisible, isHovering, startCursor, stopCursor,
} = useCursor(primaryColor)

const showPalette = ref(false)
const paletteRef = ref(null)

const setThemeColor = (color) => {
  setSingleColor(color)
  if (color === "#000000") isDark.value = true
  else if (color === "#ffffff") isDark.value = false
}

watch(primaryColor, (newColor) => {
  if (newColor === "#000000") isDark.value = true
  else if (newColor === "#ffffff") isDark.value = false
})

onClickOutside(paletteRef, () => { showPalette.value = false })

const birthDay = 25, birthMonth = 3, birthYear = 2010
const daysLeft = ref(0), nextAge = ref(0)

const logoText = ref("nio")
const bioTitle = ref("Привки 👋")
const bioParagraph0 = ref("Меня зовут Максим, мне 16 лет, живу в Армавире")
const bioParagraph1 = ref("Веду разные соцсети и делаю проекты в свободное время")
const bioParagraph2 = ref("Имею опыт работы с Java, Kotlin, Python, Vue/Nuxt, React, TypeScript, JavaScript, Denizen, Figma, Blockbench, Aseprite.")

const {
  navScrollRef, showLeftArrow, showRightArrow, navIndicator,
  handleNavScroll, scrollNav, onTouchStart, onTouchEnd,
  initNav, destroyNav,
} = useNavigation()

onMounted(() => {
  const today = new Date()
  let nextBday = new Date(today.getFullYear(), birthMonth - 1, birthDay)
  if (today.getTime() > nextBday.getTime() + 24 * 60 * 60 * 1000)
    nextBday = new Date(today.getFullYear() + 1, birthMonth - 1, birthDay)
  daysLeft.value = Math.max(0, Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 3600 * 24)))
  nextAge.value = nextBday.getFullYear() - birthYear

  startCursor()
  initNav()
})

onUnmounted(() => {
  stopCursor()
  destroyNav()
})
</script>

<template>
  <div class="theme-wrapper min-h-screen font-sans relative overflow-hidden text-zinc-900 dark:text-zinc-300"
    :style="{ '--bg-1': bgPrimary, '--bg-2': bgSecondary, '--accent': primaryColor, '--accent-secondary': secondaryColor }"
  >
    <div ref="cursorRef" class="custom-cursor" v-show="isCursorVisible" :class="{ 'is-hovering': isHovering }">
      <div class="cursor-corner top-left"></div>
      <div class="cursor-corner top-right"></div>
      <div class="cursor-corner bottom-left"></div>
      <div class="cursor-corner bottom-right"></div>
    </div>

    <AppBackground />

    <div class="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12 relative z-10 flex flex-col">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">

        <div class="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-8 z-20">
          <header class="w-full flex justify-between items-center mb-2 px-2">
            <h1 class="font-heading font-black text-zinc-900 dark:text-white text-3xl tracking-tighter flex items-center gap-2 transition-colors duration-700">
              {{ logoText }}<span class="transition-colors duration-700" :style="{ color: 'var(--accent)' }">.</span>
            </h1>
          </header>

          <div class="theme-card p-6 sm:p-8 rounded-[32px] flex flex-col gap-6 cursor-default transition-colors duration-700">
            <div class="flex items-center gap-5">
              <div class="relative flex-shrink-0">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-br transition-all duration-700"
                  :style="{ backgroundImage: `linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)` }">
                  <img :src="discordAvatarUrl" class="w-full h-full rounded-full border-[3px] border-white dark:border-zinc-900 object-cover" />
                </div>
                <span class="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white dark:border-zinc-900 transition-colors duration-500"
                  :style="{ backgroundColor: discordStatusColor }"></span>
              </div>
              <div class="flex flex-col justify-center">
                <h2 class="font-heading text-2xl sm:text-3xl font-black tracking-tight pb-0.5" :style="{ color: 'var(--accent)' }">{{ bioTitle }}</h2>
                <p class="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">@Niorio</p>
              </div>
            </div>
            <div class="w-full h-[1px] bg-zinc-200 dark:bg-white/10 transition-colors duration-700"></div>
            <div class="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3 transition-colors duration-700">
              <p>{{ bioParagraph0 }}</p>
              <p>{{ bioParagraph1 }}</p>
              <p>{{ bioParagraph2 }}</p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row lg:flex-col gap-4">
            <div class="theme-card p-5 rounded-[24px] flex-1 flex flex-col gap-5 relative overflow-hidden group h-fit">
              <div class="flex justify-between items-center z-10">
                <div class="flex items-center gap-2">
                  <Icon name="mdi:discord" class="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-[#5865F2] transition-colors" />
                  <p class="text-[10px] uppercase font-black tracking-widest text-zinc-500">Discord</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: discordStatusColor }"></span>
                  <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{{ discordStatus === "offline" ? "Оффлайн" : "В сети" }}</span>
                </div>
              </div>

              <div v-if="visibleActivities.length > 0" class="flex flex-col gap-3">
                <div v-for="activity in visibleActivities" :key="activity.id || activity.name"
                  class="flex items-center gap-4 z-10 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 transition-colors">
                  <div class="relative flex-shrink-0">
                    <template v-if="activity.assets?.large_image">
                      <img :src="getDiscordAssetUrl(activity.application_id, activity.assets.large_image)"
                        class="w-12 h-12 sm:w-14 sm:h-14 object-cover shadow-sm flex-shrink-0"
                        :class="activity.type === 2 && activity.name === 'Spotify' ? 'rounded-full animate-[spin_12s_linear_infinite]' : 'rounded-xl'" />
                    </template>
                    <template v-else>
                      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400 flex-shrink-0 transition-colors">
                        <Icon :name="getActivityIcon(activity.type)" class="w-6 h-6 transition-colors duration-700" />
                      </div>
                    </template>
                    <img v-if="activity.assets?.small_image" :src="getDiscordAssetUrl(activity.application_id, activity.assets.small_image)"
                      class="absolute -bottom-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-[#f8fafc] dark:border-[#09090b] object-cover" />
                  </div>
                  <div class="min-w-0 flex flex-col justify-center">
                    <p class="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-0.5" :style="{ color: 'var(--accent)' }">{{ getActivityTypeLabel(activity) }}</p>
                    <p class="font-bold text-zinc-900 dark:text-white text-sm sm:text-base truncate">{{ getActivityTitle(activity) }}</p>
                    <p v-for="(line, idx) in getActivitySublines(activity)" :key="idx" class="text-xs text-zinc-500 mt-0.5 truncate">{{ line }}</p>
                  </div>
                </div>
              </div>

              <div v-else class="flex items-center gap-4 z-10 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400 flex-shrink-0 transition-colors">
                  <Icon name="lucide:moon" class="w-6 h-6 transition-colors duration-700" />
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-0.5">Статус</p>
                  <p class="font-bold text-zinc-900 dark:text-white text-sm sm:text-base truncate">Нет активности</p>
                  <p class="text-xs text-zinc-500 mt-0.5 truncate">Оффлайн</p>
                </div>
              </div>
            </div>

            <a :href="steam?.profileurl || '#'" target="_blank"
              class="theme-card p-5 rounded-[24px] flex-1 flex flex-col gap-5 relative overflow-hidden group cursor-pointer h-fit">
              <div v-if="(steam?.isPlaying && steam?.gameArt) || (!steam?.isPlaying && steam?.recentGameArt)"
                class="absolute inset-0 z-0">
                <img :src="steam?.isPlaying ? steam.gameArt : steam.recentGameArt"
                  class="w-full h-full object-cover opacity-30 dark:opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-white via-white/80 dark:from-zinc-900 dark:via-zinc-900/80 to-transparent"></div>
              </div>
              <div class="flex justify-between items-center z-10">
                <div class="flex items-center gap-2">
                  <Icon name="mdi:steam" class="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <p class="text-[10px] uppercase font-black tracking-widest text-zinc-500">Steam</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full transition-colors"
                    :class="steam?.isPlaying ? 'bg-green-500' : steam?.state !== 'Не в сети' ? 'bg-blue-500' : 'bg-zinc-500'"></span>
                  <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{{ steam?.isPlaying ? "В игре" : steam?.state !== "Не в сети" ? "В сети" : "Оффлайн" }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4 z-10 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md">
                <template v-if="steam?.isPlaying && steam?.gameArt">
                  <img :src="steam.gameArt" class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shadow-sm flex-shrink-0" />
                </template>
                <template v-else-if="steam?.recentGameArt">
                  <img :src="steam.recentGameArt" class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shadow-sm opacity-80 grayscale group-hover:grayscale-0 transition duration-700 flex-shrink-0" />
                </template>
                <template v-else>
                  <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400 flex-shrink-0 transition-colors">
                    <Icon name="lucide:moon" class="w-6 h-6 transition-colors duration-700" />
                  </div>
                </template>
                <div class="min-w-0 flex flex-col justify-center">
                  <p class="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-0.5"
                    :style="{ color: steam?.isPlaying || steam?.recentGame ? 'var(--accent)' : '' }">{{ steamPillText }}</p>
                  <p class="font-bold text-zinc-900 dark:text-white text-sm sm:text-base truncate">{{ steamHeadlineText }}</p>
                  <p class="text-xs text-zinc-500 mt-0.5 truncate">{{ steamSublineText }}</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div class="lg:col-span-7 xl:col-span-8 flex flex-col min-w-0 z-10 w-full mt-2 lg:mt-0">
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
                  <transition name="pop">
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
                            @input="setThemeColor($event.target.value)"
                            class="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </nav>

          <div class="relative w-full" @touchstart="onTouchStart" @touchend="onTouchEnd">
            <NuxtPage :transition="{ name: 'tab', mode: 'out-in' }" />
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<style>
.tab-enter-active, .tab-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tab-enter-from { opacity: 0; transform: translateY(6px); }
.tab-leave-to   { opacity: 0; transform: translateY(-6px); }

@media (pointer: fine) {
  .theme-wrapper, .theme-wrapper * { cursor: none !important; }
}
.custom-cursor {
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 99999;
  will-change: transform, width, height;
}
.cursor-corner {
  box-sizing: border-box; position: absolute;
  background-color: transparent !important;
  border-style: solid; border-color: var(--cursor-color);
  width: 8px; height: 8px;
  transition: width 0.25s cubic-bezier(0.2,0.8,0.2,1),
              height 0.25s cubic-bezier(0.2,0.8,0.2,1),
              border-width 0.25s cubic-bezier(0.2,0.8,0.2,1),
              border-radius 0.25s ease;
}
.top-left   { top:0; left:0; transform-origin:top left;   border-width:8px 0 0 8px; border-top-left-radius:var(--cursor-radius); }
.top-right  { top:0; right:0; transform-origin:top right; border-width:8px 8px 0 0; border-top-right-radius:var(--cursor-radius); }
.bottom-left  { bottom:0; left:0; transform-origin:bottom left;  border-width:0 0 8px 8px; border-bottom-left-radius:var(--cursor-radius); }
.bottom-right { bottom:0; right:0; transform-origin:bottom right; border-width:0 8px 8px 0; border-bottom-right-radius:var(--cursor-radius); }
.is-hovering .cursor-corner { width:14px; height:14px; }
.is-hovering .top-left   { border-width:2px 0 0 2px; }
.is-hovering .top-right  { border-width:2px 2px 0 0; }
.is-hovering .bottom-left  { border-width:0 0 2px 2px; }
.is-hovering .bottom-right { border-width:0 2px 2px 0; }
@media (pointer: coarse) {
  .custom-cursor { display: none !important; }
  .theme-wrapper, .theme-wrapper * { cursor: auto !important; }
}

@property --accent { syntax: "<color>"; inherits: true; initial-value: #6366f1; }
@property --accent-secondary { syntax: "<color>"; inherits: true; initial-value: #8a2387; }
@property --bg-1 { syntax: "<color>"; inherits: true; initial-value: #f4f4f5; }
@property --bg-2 { syntax: "<color>"; inherits: true; initial-value: #e4e4e7; }

.theme-wrapper {
  transition: color 1.5s cubic-bezier(0.22, 1, 0.36, 1),
              background-color 1.5s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 1.5s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 1.5s cubic-bezier(0.22, 1, 0.36, 1),
              --accent 1.5s cubic-bezier(0.22, 1, 0.36, 1),
              --accent-secondary 1.5s cubic-bezier(0.22, 1, 0.36, 1),
              --bg-1 1.5s cubic-bezier(0.22, 1, 0.36, 1),
              --bg-2 1.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-card {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.dark .theme-card {
  background: rgba(24, 24, 27, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.theme-card:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 255, 255, 1);
  box-shadow: 0 12px 32px -12px color-mix(in srgb, var(--accent) 15%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}
.dark .theme-card:hover {
  background: rgba(24, 24, 27, 0.75);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 32px -12px color-mix(in srgb, var(--accent) 30%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

::selection { background-color: color-mix(in srgb, var(--accent) 30%, transparent); color: inherit; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--accent) 30%, #a1a1aa); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--accent) 60%, #a1a1aa); }

.nav-link {
  padding: 0.4rem 1.2rem; border-radius: 99px;
  color: #71717a; font-weight: 700; font-size: 0.875rem;
  letter-spacing: 0.01em; transition: all 0.3s ease; white-space: nowrap;
}
.dark .nav-link { color: #a1a1aa; }
.nav-link:hover { color: #18181b; }
.dark .nav-link:hover { color: #f4f4f5; }
.router-link-exact-active { color: color-mix(in srgb, var(--accent) 90%, black); }
.dark .router-link-exact-active { color: color-mix(in srgb, var(--accent) 20%, white); }

.fade-enter-active, .fade-leave-active { transition: opacity 1.5s ease-in-out; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.9) translateY(-10px); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
