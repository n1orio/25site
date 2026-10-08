<script setup lang="ts">
import { bioTitle as bioTitleConfig, bio } from "~/config"

const {
  primaryColor, secondaryColor, bgPrimary, bgSecondary,
  accentSurface, accentContrast, accentOnBg,
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
} = useCursor(primaryColor, accentContrast)

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
  <div class="theme-wrapper min-h-screen font-sans relative overflow-hidden"
    :style="{ '--bg-1': bgPrimary, '--bg-2': bgSecondary, '--accent': primaryColor, '--accent-secondary': secondaryColor, '--accent-surface': accentSurface, '--accent-contrast': accentContrast, '--accent-on-bg': accentOnBg, color: 'var(--text-primary)' }"
  >
    <div ref="cursorRef" class="custom-cursor" v-show="isCursorVisible" :class="{ 'is-hovering': isHovering }">
      <div class="cursor-corner top-left"></div>
      <div class="cursor-corner top-right"></div>
      <div class="cursor-corner bottom-left"></div>
      <div class="cursor-corner bottom-right"></div>
    </div>

    <AppBackground />

    <div class="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-10 relative z-10 flex flex-col">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-start">

        <aside class="lg:col-span-4 xl:col-span-3 flex flex-col gap-8 w-full lg:sticky lg:top-10 z-20">
          <ProfileCard
            :discord-avatar-url="discordAvatarUrl"
            :discord-status-color="discordStatusColor"
            :bio-title="bioTitle"
            :bio-paragraph0="bioParagraph0"
            :bio-paragraph1="bioParagraph1"
            :bio-paragraph2="bioParagraph2"
          />

          <WaveDivider class="ds-wave-muted" />

          <section class="ds-section">
            <header class="flex items-center gap-3 mb-4">
              <h2 class="on-bg-meta">Сейчас</h2>
            </header>
            <div class="ds-card p-5 flex flex-col gap-5">
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

              <span class="w-full h-px" style="background: color-mix(in srgb, var(--accent-contrast) 22%, transparent)" />

              <SteamStatus
                :steam="steam"
                :steam-pill-text="steamPillText"
                :steam-headline-text="steamHeadlineText"
                :steam-subline-text="steamSublineText"
              />
            </div>
          </section>

        </aside>

        <main class="lg:col-span-8 xl:col-span-9 flex flex-col min-w-0 z-10 w-full">
          <Navigation />

          <div class="relative w-full" @touchstart="onTouchStart" @touchend="onTouchEnd">
            <NuxtPage :transition="{ name: 'tab', mode: 'out-in' }" />
          </div>
        </main>
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
@property --accent-contrast { syntax: "<color>"; inherits: true; initial-value: #ffffff; }
@property --accent-surface { syntax: "<color>"; inherits: true; initial-value: #4f46e5; }
@property --accent-on-bg { syntax: "<color>"; inherits: true; initial-value: #4f46e5; }
@property --bg-1 { syntax: "<color>"; inherits: true; initial-value: #f4f4f5; }
@property --bg-2 { syntax: "<color>"; inherits: true; initial-value: #e4e4e7; }

/* переключение темы мгновенное, как у переключателя светлой/тёмной темы */
.theme-wrapper { transition: none; }

::selection { background-color: color-mix(in srgb, var(--accent) 30%, transparent); color: inherit; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--accent) 30%, #a1a1aa); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--accent) 60%, #a1a1aa); }

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 28px;
  padding: 0 0.75rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  color: color-mix(in srgb, var(--accent-contrast) 88%, var(--accent-surface));
  transition: color 0.25s ease;
}
.nav-link:hover { color: var(--accent-contrast); }
.router-link-exact-active { color: var(--accent-surface); }

.fade-enter-active, .fade-leave-active { transition: opacity 1.5s ease-in-out; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.9) translateY(-10px); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* === Design system :: yzewe-inspired === */

.ds-section { position: relative; }

/* --- on-accent foreground helpers --- */
.ds-title {
  font-family: var(--font-heading);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.02;
  color: var(--accent-contrast);
}
.ds-body {
  font-family: var(--font-sans);
  font-weight: 550;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: color-mix(in srgb, var(--accent-contrast) 94%, var(--accent-surface));
}
.ds-meta {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: color-mix(in srgb, var(--accent-contrast) 88%, var(--accent-surface));
}
.ds-num {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  color: color-mix(in srgb, var(--accent-contrast) 82%, var(--accent-surface));
  flex-shrink: 0;
}

/* --- accent surfaces, no borders --- */
.ds-card {
  background: var(--accent-surface);
  border: 0;
  border-radius: var(--radius-card);
  transition: filter 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.ds-card-hover:hover {
  filter: brightness(1.12) saturate(1.05);
  transform: translateY(-3px);
}

/* --- dividers inside accent surfaces --- */
.ds-divider {
  height: 1px;
  border: 0;
  margin: 0;
  background: color-mix(in srgb, var(--accent-contrast) 22%, transparent);
}

/* --- pill badges & buttons --- */
.ds-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: var(--radius-pill);
  border: 0;
  background: color-mix(in srgb, var(--accent-contrast) 14%, transparent);
  padding: 0.3rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-contrast);
  transition: all 0.3s ease;
}
.ds-pill-accent {
  background: var(--accent-contrast);
  color: var(--accent-surface);
}
.ds-pill-outline:hover {
  background: var(--accent-contrast);
  color: var(--accent);
}

/* --- action icon --- */
.ds-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-pill);
  border: 0;
  background: color-mix(in srgb, var(--accent-contrast) 16%, transparent);
  color: var(--accent-contrast);
  transition: all 0.3s ease;
}
.ds-action:hover {
  background: var(--accent-contrast);
  color: var(--accent);
}

/* --- wave divider --- */
.ds-wave {
  display: block;
  width: 100%;
  height: 14px;
  color: color-mix(in srgb, var(--accent-contrast) 30%, transparent);
}

/* --- scalloped badge (24-petal seal) --- */
.ds-scallop {
  position: relative;
  display: grid;
  place-items: center;
  width: 4.5rem;
  height: 4.5rem;
  background: var(--accent-contrast);
  color: var(--accent);
}
.ds-scallop::before {
  content: "";
  position: absolute;
  inset: 0;
  background: inherit;
  clip-path: polygon(
    50% 0%, 62% 12%, 77% 6%, 82% 22%, 97% 25%, 94% 41%, 100% 54%,
    88% 63%, 91% 78%, 76% 80%, 68% 93%, 54% 88%, 43% 100%, 32% 89%,
    18% 94%, 14% 79%, 1% 74%, 7% 59%, 0% 46%, 12% 38%, 8% 23%, 23% 20%,
    30% 7%, 44% 12%
  );
  z-index: 0;
}
.ds-scallop > * { position: relative; z-index: 1; }

/* --- nav controls (theme toggle / palette) --- */
.nav-ctl {
  --nav-ctl-bg: color-mix(in srgb, var(--accent-contrast) 20%, transparent);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-pill);
  border: 0;
  cursor: pointer;
  color: var(--accent-contrast);
  background: var(--nav-ctl-bg);
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-ctl:hover {
  background: var(--accent-contrast);
  color: var(--accent-surface);
  transform: scale(1.08);
}
.nav-ctl:active { transform: scale(0.96); }
.nav-ctl.is-active {
  background: var(--accent-contrast);
  color: var(--accent-surface);
}

/* --- on page background (not on accent surfaces) --- */
.on-bg-title {
  font-family: var(--font-heading);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}
.on-bg-body {
  font-family: var(--font-sans);
  font-weight: 550;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-secondary);
}
.on-bg-meta {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}
.ds-wave-muted { color: color-mix(in srgb, var(--text-secondary) 45%, transparent); }

/* --- misc --- */
.ds-stat {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: var(--accent-contrast);
}
.ds-bar {
  height: 3px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--accent-contrast) 25%, transparent);
  overflow: hidden;
}
.ds-bar > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--accent-contrast);
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
