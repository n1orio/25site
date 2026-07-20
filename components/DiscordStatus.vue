<script setup lang="ts">
defineProps<{
  discordStatusColor: string
  discordStatus: string
  visibleActivities: any[]
  getActivityTypeLabel: (a: any) => string
  getActivityTitle: (a: any) => string
  getActivitySublines: (a: any) => string[]
  getActivityIcon: (type: number) => string
  getDiscordAssetUrl: (appId: string | undefined, image: string | null | undefined) => string | undefined
}>()
</script>

<template>
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
</template>
