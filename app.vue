<script setup lang="ts">
import { bioTitle as bioTitleConfig, bio } from "~/config"

const {
  primaryColor, secondaryColor, bgPrimary, bgSecondary,
} = useSecretTheme()

const { data: discord } = await useFetch("/api/discord")
const { data: steam } = await useFetch("/api/steam")

const {
  discordStatus, discordStatusColor,
  visibleActivities, getActivityTypeLabel, getActivityTitle,
  getActivitySublines, getActivityIcon, getDiscordAssetUrl, discordAvatarUrl,
} = useDiscord(discord)

const {
  steamPillText, steamHeadlineText, steamSublineText,
} = useSteam(steam)

const {
  cursorRef, isCursorVisible, isHovering, startCursor, stopCursor,
} = useCursor(primaryColor)

const { onTouchStart, onTouchEnd, initNav, destroyNav } = useNavigation()

const bioTitle = ref(bioTitleConfig)
const bioParagraph0 = ref(bio[0] ?? "")
const bioParagraph1 = ref(bio[1] ?? "")
const bioParagraph2 = ref(bio[2] ?? "")

onMounted(() => {
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
          <ProfileCard
            :discord-avatar-url="discordAvatarUrl"
            :discord-status-color="discordStatusColor"
            :bio-title="bioTitle"
            :bio-paragraph0="bioParagraph0"
            :bio-paragraph1="bioParagraph1"
            :bio-paragraph2="bioParagraph2"
          />

          <div class="flex flex-col sm:flex-row lg:flex-col gap-4">
            <DiscordStatus
              :discord-status-color="discordStatusColor"
              :discord-status="discordStatus"
              :visible-activities="visibleActivities"
              :get-activity-type-label="getActivityTypeLabel"
              :get-activity-title="getActivityTitle"
              :get-activity-sublines="getActivitySublines"
              :get-activity-icon="getActivityIcon"
              :get-discord-asset-url="getDiscordAssetUrl"
            />

            <SteamStatus
              :steam="steam"
              :steam-pill-text="steamPillText"
              :steam-headline-text="steamHeadlineText"
              :steam-subline-text="steamSublineText"
            />
          </div>
        </div>

        <div class="lg:col-span-7 xl:col-span-8 flex flex-col min-w-0 z-10 w-full mt-2 lg:mt-0">
          <Navigation />

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
